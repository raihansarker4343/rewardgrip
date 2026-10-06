// backend/routes/postback/skylup.js
const express = require('express');
const router = express.Router();

const { pool } = require('../../db');
const { supabase } = require('../../supabase');
const {
  USER_PAYOUT_RATIO,
  MIN_POSTBACK_AMOUNT,
  parseUsdAmount,
  toMoney,
} = require('../../config/earnings');

/**
 * Skylup (Pixylab) Postback Handler
 * Supports both Vercel Serverless (Supabase-first) and full-stack PostgreSQL.
 */
const handleSkylupPostback = async (req, res) => {
  try {
    const params = { ...req.query, ...req.body };

    const userId = String(
      params.user_id ||
      params.sub_id ||
      params.pub_sub_id ||
      params.subId ||
      params.click_id ||
      params.pub_click_id ||
      params.custom1 ||
      ''
    ).trim();

    const externalTx = String(
      params.trans_id ||
      params.tx_id ||
      params.id ||
      ''
    ).trim();

    const rawPayout = params.payout || params.amount || '0';
    const offerId = String(params.offer_id || params.offerId || '').trim();

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
    const userEarnUsd = toMoney(amt * (USER_PAYOUT_RATIO || 0.7)); // 70% user payout
    const offerDescription = offerId ? `Pixylab Offer #${offerId}` : 'Pixylab Offer';
    let userCredited = false;

    // 1. Supabase First (Used by Vercel & React Frontend)
    if (supabase) {
      try {
        const { data: existingTx } = await supabase
          .from('transactions')
          .select('id')
          .eq('id', txId)
          .maybeSingle();

        if (existingTx) {
          console.log(`[Skylup Postback] Transaction ${txId} already handled.`);
          return res.status(200).send('ALREADY_HANDLED');
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

        if (!uErr && userData) {
          const newBal = Number((Number(userData.balance || 0) + userEarnUsd).toFixed(2));
          const newTot = Number((Number(userData.total_earned || 0) + userEarnUsd).toFixed(2));
          const newComp = (userData.completed_tasks || 0) + 1;

          await supabase
            .from('users')
            .update({
              balance: newBal,
              total_earned: newTot,
              completed_tasks: newComp,
            })
            .eq('id', userData.id);

          await supabase
            .from('transactions')
            .upsert({
              id: txId,
              user_id: userData.id,
              type: 'earning',
              method: 'Pixylab',
              amount: userEarnUsd,
              status: 'completed',
              date: new Date().toISOString(),
              source: offerDescription,
            });

          userCredited = true;
          console.log(`[Skylup Postback Supabase] Successfully credited $${userEarnUsd} to user #${userData.id} (${userId})`);
        }
      } catch (sbErr) {
        console.warn('[Skylup Postback Supabase Warning]:', sbErr.message);
      }
    }

    // 2. PostgreSQL Sync (Optional, safe fallback if pool is configured)
    if (pool && process.env.DATABASE_URL) {
      try {
        const client = await pool.connect();
        try {
          const existing = await client.query('SELECT id FROM transactions WHERE id = $1', [txId]);
          if (existing.rows.length === 0) {
            const userResult = await client.query(
              'SELECT id, balance, total_earned FROM users WHERE earn_id = $1 OR id::text = $1',
              [userId]
            );

            if (userResult.rows.length > 0) {
              const user = userResult.rows[0];
              await client.query('BEGIN');
              await client.query(
                `UPDATE users 
                 SET balance = balance + $1, 
                     total_earned = total_earned + $1,
                     completed_tasks = COALESCE(completed_tasks, 0) + 1
                 WHERE id = $2`,
                [userEarnUsd, user.id]
              );
              await client.query(
                `INSERT INTO transactions (id, user_id, type, method, amount, status, date, source)
                 VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
                 ON CONFLICT (id) DO NOTHING`,
                [txId, user.id, 'earn', 'offer', userEarnUsd, 'completed', offerDescription]
              );
              await client.query('COMMIT');
              userCredited = true;
              console.log(`[Skylup Postback Postgres] Successfully credited $${userEarnUsd} to user #${user.id}`);
            }
          }
        } finally {
          client.release();
        }
      } catch (pgErr) {
        console.warn('[Skylup Postback Postgres Notice]:', pgErr.message);
      }
    }

    if (userCredited) {
      return res.status(200).send('OK');
    }

    // Even if user not found, return 200 with notice so Skylup does not continuously retry
    console.warn(`[Skylup Postback] User ${userId} could not be located in database.`);
    return res.status(200).send('USER_NOT_FOUND');
  } catch (error) {
    console.error('[Skylup Postback] Handler error:', error);
    return res.status(500).send('SERVER_ERROR');
  }
};

router.get('/skylup', handleSkylupPostback);
router.post('/skylup', handleSkylupPostback);

router.get('/pixylab', handleSkylupPostback);
router.post('/pixylab', handleSkylupPostback);

module.exports = router;
