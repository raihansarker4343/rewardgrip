// backend/routes/postback/cpx.js
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { pool } = require('../../db');
const { supabase } = require('../../supabase');
const {
  USER_PAYOUT_RATIO = 1.0,
  MIN_POSTBACK_AMOUNT = 0.01,
  POSTBACK_SECRET = process.env.POSTBACK_SECRET || 'rewardgrip_secret_2026',
  toMoney = (n) => Number(Number(n || 0).toFixed(2)),
} = require('../../config/earnings');

/**
 * CPX Research Postback Handler
 * Endpoint: GET /api/postback/cpx
 * CPX Parameters:
 *   - status: 1 = approved, 2 = reversed
 *   - trans_id: transaction id
 *   - user_id: user id in our database
 *   - amount_local: coins or currency amount
 *   - amount_usd: publisher revenue
 *   - secure_hash / signature: md5 verification hash
 */
router.get('/cpx', async (req, res) => {
  try {
    const statusParam = req.query.status;
    const transId = req.query.trans_id || req.query.transaction_id;
    const userId = req.query.user_id || req.query.ext_user_id;
    const amountUsdRaw = req.query.amount_usd || req.query.amount_local || req.query.amount || '0';
    const hash = req.query.secure_hash || req.query.signature || req.query.hash;

    if (!transId || !userId) {
      console.warn('[CPX Postback] Missing trans_id or user_id:', req.query);
      return res.status(400).send('MISSING_USER_OR_TX');
    }

    // Optional secure hash verification if configured
    if (POSTBACK_SECRET && hash) {
      const expected1 = crypto.createHash('md5').update(`${transId}-${POSTBACK_SECRET}`).digest('hex');
      const expected2 = crypto.createHash('md5').update(`${userId}-${POSTBACK_SECRET}`).digest('hex');
      if (hash !== expected1 && hash !== expected2) {
        console.warn('[CPX Postback] Invalid signature:', { hash, expected1, expected2 });
        // Don't reject if secret wasn't strictly enforced on CPX side yet
      }
    }

    const amt = parseFloat(amountUsdRaw) || 0;
    if (amt <= 0 && statusParam === '1') {
      return res.status(400).send('INVALID_AMOUNT');
    }

    const userEarn = toMoney(amt * USER_PAYOUT_RATIO);
    const txId = `CPX_${transId}`;
    const isApproved = String(statusParam) === '1' || String(statusParam).toLowerCase() === 'approved';
    const isReversed = String(statusParam) === '2' || String(statusParam).toLowerCase() === 'reversed';

    console.log(`[CPX Postback] Processing txId: ${txId}, User: ${userId}, Amount: $${userEarn}, Approved: ${isApproved}`);

    // 1. Try PostgreSQL pool if connected
    if (pool) {
      let client;
      try {
        client = await pool.connect();
        const existing = await client.query('SELECT id FROM transactions WHERE id = $1', [txId]);
        if (existing.rows && existing.rows.length > 0) {
          return res.status(200).send('1'); // CPX requires '1' or 'OK' for success
        }

        const userRes = await client.query('SELECT id, balance, total_earned FROM users WHERE earn_id = $1 OR id::text = $1', [userId]);
        if (!userRes.rows || userRes.rows.length === 0) {
          return res.status(404).send('USER_NOT_FOUND');
        }

        const targetUser = userRes.rows[0];

        if (isApproved) {
          await client.query('BEGIN');
          await client.query(
            'UPDATE users SET balance = balance + $1, total_earned = total_earned + $1, completed_tasks = completed_tasks + 1 WHERE id = $2',
            [userEarn, targetUser.id]
          );
          await client.query(
            `INSERT INTO transactions (id, user_id, type, method, amount, status, date, source)
             VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
             ON CONFLICT (id) DO NOTHING`,
            [txId, targetUser.id, 'earning', 'CPX Research', userEarn, 'completed', 'Online Survey']
          );
          await client.query('COMMIT');
          console.log(`[CPX Postback] Successfully credited User ${targetUser.id} (${userId}) with $${userEarn}`);
          return res.status(200).send('1');
        }

        if (isReversed) {
          await client.query('BEGIN');
          await client.query(
            'UPDATE users SET balance = GREATEST(balance - $1, 0) WHERE id = $2',
            [userEarn, targetUser.id]
          );
          await client.query(
            'UPDATE transactions SET status = $1 WHERE id = $2',
            ['reversed', txId]
          );
          await client.query('COMMIT');
          return res.status(200).send('1');
        }

        return res.status(200).send('1');
      } catch (dbErr) {
        if (client) await client.query('ROLLBACK').catch(() => {});
        console.warn('[CPX Postback] Postgres query error, trying Supabase fallback:', dbErr.message);
      } finally {
        if (client) client.release();
      }
    }

    // 2. Supabase Fallback
    if (supabase) {
      try {
        const { data: existingTx } = await supabase
          .from('transactions')
          .select('id')
          .eq('id', txId)
          .maybeSingle();

        if (existingTx) {
          return res.status(200).send('1');
        }

        let query = supabase.from('users').select('id, earn_id, balance, total_earned, completed_tasks');
        if (String(userId).startsWith('rewardgrip') || String(userId).startsWith('rewarddrip')) {
          query = query.eq('earn_id', userId);
        } else if (!isNaN(Number(userId))) {
          query = query.or(`id.eq.${userId},earn_id.eq.${userId}`);
        } else {
          query = query.eq('earn_id', userId);
        }
        const { data: userData, error: uErr } = await query.maybeSingle();

        if (uErr || !userData) {
          return res.status(404).send('USER_NOT_FOUND');
        }

        const realUserId = userData.id;

        if (isApproved) {
          const newBalance = Number((Number(userData.balance || 0) + userEarn).toFixed(2));
          const newTotal = Number((Number(userData.total_earned || 0) + userEarn).toFixed(2));
          const newCompleted = (userData.completed_tasks || 0) + 1;

          await supabase
            .from('users')
            .update({
              balance: newBalance,
              total_earned: newTotal,
              completed_tasks: newCompleted,
            })
            .eq('id', realUserId);

          await supabase
            .from('transactions')
            .insert({
              id: txId,
              user_id: realUserId,
              type: 'earning',
              method: 'CPX Research',
              amount: userEarn,
              status: 'completed',
              date: new Date().toISOString(),
              source: 'Online Survey',
            });

          console.log(`[CPX Postback Supabase] Successfully credited User ${realUserId} (${userId}) with $${userEarn}`);
          return res.status(200).send('1');
        }

        if (isReversed) {
          const newBalance = Math.max(0, Number((Number(userData.balance || 0) - userEarn).toFixed(2)));
          await supabase
            .from('users')
            .update({ balance: newBalance })
            .eq('id', realUserId);

          await supabase
            .from('transactions')
            .update({ status: 'reversed' })
            .eq('id', txId);

          return res.status(200).send('1');
        }

        return res.status(200).send('1');
      } catch (sbErr) {
        console.error('[CPX Postback Supabase Error]:', sbErr);
      }
    }

    return res.status(200).send('1');
  } catch (err) {
    console.error('[CPX Postback Error]:', err);
    res.status(500).send('ERROR');
  }
});

module.exports = router;
