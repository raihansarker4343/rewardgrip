// api/postback/skylup.js - Dedicated Vercel Serverless Postback Handler
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  'https://ohngslvxuokstopokkfc.supabase.co';

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_73ltiA_P1XtjTbrUMFk6yw_jO9SkPPo';

const supabase = createClient(supabaseUrl, supabaseKey);

const USER_PAYOUT_RATIO = 0.7; // User 70%, Platform 30%

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const params = { ...(req.query || {}), ...(req.body || {}) };

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

    const rawPayout = parseFloat(params.payout || params.amount || '0');
    const offerId = String(params.offer_id || params.offerId || '').trim();

    if (!userId || !externalTx) {
      console.warn('[Vercel Skylup Postback] Missing user_id or trans_id:', params);
      return res.status(400).send('MISSING_USER_OR_TX');
    }

    if (isNaN(rawPayout) || rawPayout < 0.01) {
      console.warn(`[Vercel Skylup Postback] Zero or invalid payout: ${rawPayout}`);
      return res.status(200).send('IGNORED_ZERO_PAYOUT');
    }

    const txId = `SKYLUP_${externalTx}`;
    const userEarnUsd = Math.round(rawPayout * USER_PAYOUT_RATIO * 100) / 100;
    const offerDescription = offerId ? `Pixylab Offer #${offerId}` : 'Pixylab Offer';

    // 1. Idempotency Check (Supabase)
    const { data: existingTx } = await supabase
      .from('transactions')
      .select('id')
      .eq('id', txId)
      .maybeSingle();

    if (existingTx) {
      console.log(`[Vercel Skylup Postback] Tx ${txId} already handled.`);
      return res.status(200).send('ALREADY_HANDLED');
    }

    // 2. Find User (by earn_id or numeric ID)
    let query = supabase
      .from('users')
      .select('id, earn_id, balance, total_earned, completed_tasks');

    if (String(userId).startsWith('rewardgrip') || String(userId).startsWith('rewarddrip')) {
      query = query.eq('earn_id', userId);
    } else if (!isNaN(Number(userId))) {
      query = query.or(`id.eq.${userId},earn_id.eq.${userId}`);
    } else {
      query = query.eq('earn_id', userId);
    }

    const { data: userData, error: uErr } = await query.maybeSingle();

    if (uErr || !userData) {
      console.warn(`[Vercel Skylup Postback] User not found: ${userId}`);
      return res.status(200).send('USER_NOT_FOUND');
    }

    // 3. Update Balance in Supabase
    const newBal = Number((Number(userData.balance || 0) + userEarnUsd).toFixed(2));
    const newTot = Number((Number(userData.total_earned || 0) + userEarnUsd).toFixed(2));
    const newComp = (userData.completed_tasks || 0) + 1;

    const { error: updateErr } = await supabase
      .from('users')
      .update({
        balance: newBal,
        total_earned: newTot,
        completed_tasks: newComp,
      })
      .eq('id', userData.id);

    if (updateErr) {
      console.error('[Vercel Skylup Postback] User update error:', updateErr.message);
      return res.status(500).send('DB_UPDATE_ERROR');
    }

    // 4. Insert Transaction in Supabase
    await supabase.from('transactions').upsert({
      id: txId,
      user_id: userData.id,
      type: 'earning',
      method: 'Pixylab',
      amount: userEarnUsd,
      status: 'completed',
      date: new Date().toISOString(),
      source: offerDescription,
    });

    console.log(
      `[Vercel Skylup Postback SUCCESS] Credited $${userEarnUsd} to user #${userData.id} (${userId}) (tx: ${txId})`
    );

    return res.status(200).send('OK');
  } catch (error) {
    console.error('[Vercel Skylup Postback Fatal Error]:', error);
    return res.status(500).send('SERVER_ERROR');
  }
}
