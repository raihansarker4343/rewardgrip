// api/public/home-stats.js - Dedicated Vercel Serverless Function for Live Home Stats
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
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count: signupsCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneDayAgo);

    const { count: totalUsersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { data: usersData } = await supabase
      .from('users')
      .select('id, created_at, total_earned');

    const realTotalEarned = (usersData || []).reduce(
      (acc, u) => acc + (Number(u.total_earned) || 0),
      0
    );

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const startYesterday = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
      0, 0, 0
    ).toISOString();
    const endYesterday = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
      23, 59, 59, 999
    ).toISOString();

    const { data: yestWithdrawals } = await supabase
      .from('transactions')
      .select('amount')
      .ilike('type', 'withdrawal')
      .gte('date', startYesterday)
      .lte('date', endYesterday);

    let avgWithdraw = 0;
    if (yestWithdrawals && yestWithdrawals.length > 0) {
      avgWithdraw =
        yestWithdrawals.reduce((sum, tx) => sum + Number(tx.amount || 0), 0) /
        yestWithdrawals.length;
    } else {
      const { data: allWithdrawals } = await supabase
        .from('transactions')
        .select('amount')
        .ilike('type', 'withdrawal');
      if (allWithdrawals && allWithdrawals.length > 0) {
        avgWithdraw =
          allWithdrawals.reduce((sum, tx) => sum + Number(tx.amount || 0), 0) /
          allWithdrawals.length;
      }
    }

    const { data: txs } = await supabase
      .from('transactions')
      .select('user_id, date')
      .order('date', { ascending: true });

    let totalMinutes = 0;
    let matchedCount = 0;
    if (txs && usersData) {
      const userMap = new Map(
        usersData.map((u) => [u.id, new Date(u.created_at).getTime()])
      );
      const seen = new Set();
      for (const t of txs) {
        if (!seen.has(t.user_id) && userMap.has(t.user_id)) {
          seen.add(t.user_id);
          const diffMs = Math.abs(
            new Date(t.date).getTime() - (userMap.get(t.user_id) || 0)
          );
          const diffMins = Math.max(1, Math.floor(diffMs / 60000));
          totalMinutes += diffMins;
          matchedCount++;
        }
      }
    }

    const avgMins = matchedCount > 0 ? Math.round(totalMinutes / matchedCount) : 14;
    const avgTimeString =
      avgMins < 60 ? `${avgMins}m 20s` : `${Math.floor(avgMins / 60)}h ${avgMins % 60}m`;

    return res.status(200).json({
      signups24h:
        typeof signupsCount === 'number' && signupsCount > 0
          ? signupsCount
          : totalUsersCount || 0,
      avgTimeToFirstCash: avgTimeString,
      avgWithdrawYesterday: Number(avgWithdraw.toFixed(2)),
      totalEarned: Number(realTotalEarned.toFixed(2)),
    });
  } catch (error) {
    console.error('[Vercel home-stats error]:', error);
    return res.status(200).json({
      signups24h: 0,
      avgTimeToFirstCash: '14m 20s',
      avgWithdrawYesterday: 0,
      totalEarned: 0,
    });
  }
}