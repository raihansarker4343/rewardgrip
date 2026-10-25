// api/public/live-cashouts.js - Dedicated Vercel Serverless Function for Live Cashouts
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: txs30Days } = await supabase
      .from('transactions')
      .select('amount')
      .ilike('type', 'withdrawal')
      .gte('date', thirtyDaysAgo);

    let real30Days = (txs30Days || []).reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    if (real30Days === 0) {
      const { data: allWithdrawals } = await supabase
        .from('transactions')
        .select('amount')
        .ilike('type', 'withdrawal');
      real30Days = (allWithdrawals || []).reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    }

    const { data: recentTxs } = await supabase
      .from('transactions')
      .select('id, amount, method, date, user_id')
      .ilike('type', 'withdrawal')
      .order('date', { ascending: false })
      .limit(30);

    if (recentTxs && recentTxs.length > 0) {
      const userIds = [...new Set(recentTxs.map((t) => t.user_id).filter(Boolean))];
      let userMap = new Map();
      if (userIds.length > 0) {
        const { data: users } = await supabase
          .from('users')
          .select('id, username')
          .in('id', userIds);
        if (users) {
          userMap = new Map(users.map((u) => [u.id, u.username]));
        }
      }

      const items = recentTxs.map((t) => ({
        id: String(t.id),
        method: t.method || 'PayPal',
        user: userMap.get(t.user_id) || `User_${t.user_id}`,
        amount: Number(t.amount) || 0,
      }));

      return res.status(200).json({
        total30Days: Number(real30Days.toFixed(2)),
        items,
      });
    }

    return res.status(200).json({ total30Days: 0, items: [] });
  } catch (error) {
    console.error('[Vercel live-cashouts error]:', error);
    return res.status(200).json({ total30Days: 0, items: [] });
  }
}
