// backend/routes/postback/skylup.js
const express = require('express');
const router = express.Router();

const { pool } = require('../../db');
const {
  USER_PAYOUT_RATIO,
  MIN_POSTBACK_AMOUNT,
  parseUsdAmount,
  toMoney,
} = require('../../config/earnings');

/**
 * Skylup (Pixylab) Postback Handler
 * Swaarm platform postback macros:
 * user_id: #{click.publisher.subId}
 * trans_id: #{id}
 * payout: #{payout.theyGetInDollarsExact}
 * offer_id: #{offer.id}
 *
 * Example URL:
 * https://api.rewardgrip.com/api/postback/skylup?user_id=#{click.publisher.subId}&trans_id=#{id}&payout=#{payout.theyGetInDollarsExact}&offer_id=#{offer.id}
 */
const handleSkylupPostback = async (req, res) => {
  try {
    const params = { ...req.query, ...req.body };

    const userId = String(params.user_id || '').trim();
    const externalTx = String(params.trans_id || params.tx_id || '').trim();
    const rawPayout = params.payout || params.amount || '0';
    const offerId = String(params.offer_id || '').trim();

    if (!userId || !externalTx) {
      console.warn('[Skylup Postback] Missing user_id or trans_id:', params);
      return res.status(400).send('MISSING_USER_OR_TX');
    }

    const amt = parseUsdAmount(rawPayout);
    if (amt === null || amt < (MIN_POSTBACK_AMOUNT || 0.01)) {
      console.warn(`[Skylup Postback] Ignored zero or invalid payout: ${rawPayout}`);
      return res.status(200).send('IGNORED_ZERO_PAYOUT');
    }

    const txId = `SKYLUP_${externalTx}`;
    const client = await pool.connect();

    try {
      // 1. Deduplication check
      const existing = await client.query(
        'SELECT id FROM transactions WHERE id = $1',
        [txId]
      );
      if (existing.rows.length > 0) {
        console.log(`[Skylup Postback] Duplicate transaction ${txId} ignored.`);
        return res.status(200).send('ALREADY_HANDLED');
      }

      // 2. Find user by earn_id or numeric ID
      const userResult = await client.query(
        'SELECT id, balance, total_earned FROM users WHERE earn_id = $1 OR id::text = $1',
        [userId]
      );
      if (userResult.rows.length === 0) {
        console.warn(`[Skylup Postback] User not found: ${userId}`);
        return res.status(404).send('USER_NOT_FOUND');
      }

      const user = userResult.rows[0];
      const userEarnUsd = toMoney(amt * (USER_PAYOUT_RATIO || 0.7)); // default user share

      await client.query('BEGIN');

      // 3. Credit user's balance and completed_tasks
      await client.query(
        `UPDATE users 
         SET balance = balance + $1, 
             total_earned = total_earned + $1,
             completed_tasks = COALESCE(completed_tasks, 0) + 1
         WHERE id = $2`,
        [userEarnUsd, user.id]
      );

      // 4. Record transaction log
      const offerDescription = offerId ? `Pixylab Offer #${offerId}` : 'Pixylab Offer';
      await client.query(
        `INSERT INTO transactions (id, user_id, type, method, amount, status, date, source)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)`,
        [txId, user.id, 'earn', 'offer', userEarnUsd, 'completed', offerDescription]
      );

      await client.query('COMMIT');
      console.log(`[Skylup Postback] Successfully credited $${userEarnUsd} to user #${user.id} (tx: ${txId})`);

      return res.status(200).send('OK');
    } catch (dbErr) {
      await client.query('ROLLBACK').catch(() => {});
      console.error('[Skylup Postback] Database transaction error:', dbErr);
      return res.status(500).send('DATABASE_ERROR');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[Skylup Postback] Handler error:', error);
    return res.status(500).send('SERVER_ERROR');
  }
};

router.get('/skylup', handleSkylupPostback);
router.post('/skylup', handleSkylupPostback);

// Also alias /pixylab in case either path is invoked
router.get('/pixylab', handleSkylupPostback);
router.post('/pixylab', handleSkylupPostback);

module.exports = router;
