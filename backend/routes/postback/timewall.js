// earnlab-backend/routes/postback/timewall.js
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const { pool } = require('../../db');

const normalizeIp = (ip) => {
  if (!ip) return '';
  if (ip.startsWith('::ffff:')) return ip.slice(7);
  return ip;
};

const envWhitelist = (process.env.TIMEWALL_POSTBACK_WHITELIST || '')
  .split(',')
  .map((ip) => ip.trim())
  .filter(Boolean);

const DEFAULT_TIMEWALL_WHITELIST = ['51.81.120.73', '142.111.248.18'];
const LOCAL_WHITELIST = ['127.0.0.1', '::1'];

const TIMEWALL_ALLOWED_IPS = Array.from(
  new Set([...DEFAULT_TIMEWALL_WHITELIST, ...LOCAL_WHITELIST, ...envWhitelist])
);

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

router.get('/timewall', async (req, res) => {
  // 1) IP whitelist
  const enforceIp = String(process.env.TIMEWALL_ENFORCE_IP_WHITELIST || 'true').toLowerCase() === 'true';
  const remoteIp = normalizeIp(req.ip);

  if (enforceIp && TIMEWALL_ALLOWED_IPS.length) {
    const ok = TIMEWALL_ALLOWED_IPS.some((allowed) => normalizeIp(allowed) === remoteIp);
    if (!ok) return res.status(403).send('FORBIDDEN_IP');
  }

  // 2) Read params (TimeWall macros)
  const userID = String(req.query.userID || '');
  const transactionID = String(req.query.transactionID || '');
  const revenueRaw = String(req.query.revenue ?? '0');           // keep raw string for hash match
  const currencyRaw = String(req.query.currencyAmount ?? '0');   // can be negative
  const hash = String(req.query.hash || '');
  const type = String(req.query.type || 'credit');              // credit|chargeback
  const withdrawid = req.query.withdrawid ? String(req.query.withdrawid) : null;
  const ip = req.query.ip ? String(req.query.ip) : null;

  if (!userID || !transactionID) {
    return res.status(400).send('MISSING_USER_OR_TX');
  }

  const revenue = Number(revenueRaw);
  const currencyAmount = Number(currencyRaw);
  if (!Number.isFinite(revenue) || !Number.isFinite(currencyAmount)) {
    return res.status(400).send('INVALID_AMOUNT');
  }

  // 3) Hash verify: sha256(userID + revenue + SecretKey)
  const requireHash = String(process.env.TIMEWALL_REQUIRE_HASH || 'true').toLowerCase() === 'true';
  const secretKey = process.env.TIMEWALL_SECRET_KEY || '';

  if (requireHash) {
    if (!secretKey) return res.status(500).send('MISSING_SECRET');
    if (!hash) return res.status(403).send('MISSING_HASH');

    const expected = sha256(`${userID}${revenueRaw}${secretKey}`);
    if (hash.toLowerCase() !== expected.toLowerCase()) {
      return res.status(403).send('INVALID_HASH');
    }
  }

  // 4) USD conversion (your DB balance is USD)
  const conv = Number(process.env.TIMEWALL_CURRENCY_CONVERSION_RATE || 1);
  const usdAmount = Number((currencyAmount / conv).toFixed(2)); // negative হলে chargeback

  const txId = `TW_${transactionID}`;

  const client = await pool.connect();
  try {
    // 5) Idempotency
    const existing = await client.query('SELECT id FROM transactions WHERE id = $1', [txId]);
    if (existing.rows.length > 0) {
      return res.status(200).send('ALREADY_HANDLED');
    }

    // 6) user exists?
    const u = await client.query('SELECT id FROM users WHERE earn_id = $1 OR id::text = $1', [userID]);
    if (u.rows.length === 0) {
      return res.status(404).send('USER_NOT_FOUND');
    }
    const realUserId = u.rows[0].id;

    await client.query('BEGIN');

    // 7) Apply to USD balance
    await client.query(
      'UPDATE users SET balance = GREATEST(balance + $1, 0) WHERE id = $2',
      [usdAmount, realUserId]
    );

    // 8) Insert transaction (meta সহ)
    await client.query(
      `INSERT INTO transactions
        (id, user_id, type, method, amount, status, date, source, meta)
       VALUES
        ($1, $2, $3, $4, $5, $6, NOW(), $7, $8)`,
      [
        txId,
        userID,
        usdAmount >= 0 ? 'earn' : 'reversal',
        'offerwall',
        usdAmount,
        usdAmount >= 0 ? 'completed' : 'reversed',
        'TimeWall',
        JSON.stringify({
          raw: {
            userID,
            transactionID,
            revenue: revenueRaw,
            currencyAmount: currencyRaw,
            hash,
            type,
            withdrawid,
            ip,
          },
          parsed: { revenue, currencyAmount, usdAmount, conv },
          request_ip: remoteIp,
        }),
      ]
    );

    await client.query('COMMIT');
    return res.status(200).send('OK');
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch {}
    console.error('TimeWall postback error', err);
    return res.status(500).send('SERVER_ERROR');
  } finally {
    client.release();
  }
});

module.exports = router;
