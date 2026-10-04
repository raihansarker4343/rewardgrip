
// earnlab-backend/routes/postback/bitlabs.js
const express = require('express');
const router = express.Router();

const { pool } = require('../../db');
const {
  USER_PAYOUT_RATIO,
  MIN_POSTBACK_AMOUNT,
  POSTBACK_SECRET,
  parseUsdAmount,
  toMoney,
} = require('../../config/earnings');

// Final route: GET /api/postback/bitlabs
// BitLabs panel: https://YOUR_DOMAIN/api/postback/bitlabs?user_id={user_id}&value={value}&transaction_id={transaction_id}&event={event}&secret=YOUR_SECRET

router.get('/bitlabs', async (req, res) => {
  if (POSTBACK_SECRET) {
    const fromReq = req.query.secret || '';
    if (fromReq !== POSTBACK_SECRET) {
      return res.status(403).send('INVALID_SECRET');
    }
  }

  const userId = req.query.user_id;
  const rawAmount = req.query.value || req.query.amount || '0';
  const externalTx = req.query.transaction_id || req.query.tx_id;
  const event = (req.query.event || '').toLowerCase();

  if (!userId || !externalTx) {
    return res.status(400).send('MISSING_USER_OR_TX');
  }

  const amt = parseUsdAmount(rawAmount);
  if (!amt || amt < MIN_POSTBACK_AMOUNT) {
    return res.status(400).send('INVALID_AMOUNT');
  }

  let status;
  if (event === 'completed' || event === 'approved') {
    status = 'approved';
  } else if (event === 'reversed' || event === 'chargeback') {
    status = 'reversed';
  } else {
    return res.status(200).send('IGNORED_EVENT');
  }

  const txId = `BITLABS_${externalTx}`;

  // We must use a dedicated client for transactions
  const client = await pool.connect();

  try {
    const existing = await client.query(
      'SELECT id FROM transactions WHERE id = $1',
      [txId]
    );
    if (existing.rows.length > 0) {
      return res.status(200).send('ALREADY_HANDLED');
    }

    const userResult = await client.query(
      'SELECT id, balance, total_earned FROM users WHERE earn_id = $1 OR id::text = $1',
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).send('USER_NOT_FOUND');
    }

    const user = userResult.rows[0];
    const userEarnUsd = toMoney(amt * USER_PAYOUT_RATIO);

    if (status === 'approved') {
      await client.query('BEGIN');

      await client.query(
        'UPDATE users SET balance = balance + $1, total_earned = total_earned + $1 WHERE id = $2',
        [userEarnUsd, user.id]
      );

      await client.query(
        `INSERT INTO transactions (id, user_id, type, method, amount, status, date, source)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)`,
        [txId, user.id, 'earn', 'survey', userEarnUsd, 'completed', 'BitLabs']
      );

      await client.query('COMMIT');
      return res.status(200).send('OK');
    }

    if (status === 'reversed') {
      await client.query('BEGIN');

      await client.query(
        'UPDATE users SET balance = GREATEST(balance - $1, 0) WHERE id = $2',
        [userEarnUsd, user.id]
      );

      await client.query(
        `INSERT INTO transactions (id, user_id, type, method, amount, status, date, source)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)`,
        [txId, user.id, 'reversal', 'survey', -userEarnUsd, 'reversed', 'BitLabs']
      );

      await client.query('COMMIT');
      return res.status(200).send('REVERSED');
    }

    return res.status(400).send('INVALID_STATUS');
  } catch (err) {
    console.error('BitLabs postback error', err);
    try {
      await client.query('ROLLBACK');
    } catch (e) {}
    return res.status(500).send('SERVER_ERROR');
  } finally {
    client.release(); // Release client back to pool
  }
});

module.exports = router;
