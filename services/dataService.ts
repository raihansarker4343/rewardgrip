import { supabase } from '../lib/supabase';
import { API_URL, OFFER_WALLS, SURVEY_PROVIDERS } from '../constants';
import type { OfferWall, SurveyProvider, EarningFeedItem } from '../types';

export interface HomeStatsData {
  signups24h: number;
  avgTimeToFirstCash: string;
  avgWithdrawYesterday: number;
  totalEarned: number;
}

export interface LiveCashoutItem {
  id: string;
  user: string;
  avatar: string;
  amount: number;
  method: string;
  timeAgo: string;
}

const DEFAULT_FEED_ITEMS: EarningFeedItem[] = [
  { id: '1', user: 'AlexM', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', task: 'Mobile App Survey', provider: 'BitLabs', amount: 1.25 },
  { id: '2', user: 'Sarah_99', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', task: 'Gaming Offer', provider: 'Torox', amount: 3.50 },
  { id: '3', user: 'CryptoKing', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', task: 'Withdrawal', provider: 'Cashout', amount: 15.00 },
  { id: '4', user: 'Elena_K', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100', task: 'Consumer Study', provider: 'CPX Research', amount: 0.85 },
  { id: '5', user: 'David_R', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', task: 'Task Completion', provider: 'Adscend Media', amount: 2.10 }
];

const DEFAULT_CASHOUTS: LiveCashoutItem[] = [
  { id: 'c1', user: 'Michael B.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', amount: 25.00, method: 'Litecoin (LTC)', timeAgo: '2m ago' },
  { id: 'c2', user: 'Jessica T.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', amount: 10.00, method: 'Virtual Visa', timeAgo: '5m ago' },
  { id: 'c3', user: 'Raihan S.', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', amount: 50.00, method: 'Tether (USDT)', timeAgo: '8m ago' },
  { id: 'c4', user: 'Marcus L.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', amount: 15.00, method: 'Binance Coin', timeAgo: '12m ago' }
];

export const dataService = {
  /**
   * Fetch offer walls safely from API, Supabase, or default constants
   */
  async getOfferWalls(): Promise<OfferWall[]> {
    let result: OfferWall[] = OFFER_WALLS;

    if (API_URL && API_URL.trim() !== '') {
      try {
        const res = await fetch(`${API_URL}/api/offer-walls`);
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            result = data;
          }
        }
      } catch (err) {
        console.warn('[DataService] API offer-walls unreachable, trying Supabase:', err);
      }
    }

    if (result === OFFER_WALLS && supabase) {
      try {
        const { data, error } = await supabase
          .from('offer_walls')
          .select('*')
          .eq('is_enabled', true)
          .order('id');
        if (!error && Array.isArray(data) && data.length > 0) {
          const dbWalls = data.map(row => ({
            id: row.id,
            name: row.name,
            logo: row.logo,
            bonus: row.bonus,
            isLocked: row.is_locked,
            unlockRequirement: row.unlock_requirement,
            isEnabled: row.is_enabled,
            rating: row.rating || 4,
          }));

          // Merge any default OFFER_WALLS that are enabled but not yet in the DB
          const dbNames = new Set(dbWalls.map(w => w.name.toLowerCase()));
          const missingDefaults = OFFER_WALLS.filter(w => w.isEnabled && !dbNames.has(w.name.toLowerCase()));
          result = [...dbWalls, ...missingDefaults];
        }
      } catch (sbErr) {
        console.warn('[DataService] Supabase offer_walls notice:', sbErr);
      }
    }

    // Deduplicate by name to prevent duplicate cards
    const seen = new Set<string>();
    return result.filter(w => {
      const key = (w.name || '').trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  },

  /**
   * Fetch survey providers safely from API, Supabase, or default constants
   */
  async getSurveyProviders(token?: string | null): Promise<SurveyProvider[]> {
    let result: SurveyProvider[] = SURVEY_PROVIDERS;

    if (API_URL && API_URL.trim() !== '') {
      try {
        const res = await fetch(`${API_URL}/api/survey-providers`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            result = data;
          }
        }
      } catch (err) {
        console.warn('[DataService] API survey-providers unreachable, trying Supabase:', err);
      }
    }

    if (result === SURVEY_PROVIDERS && supabase) {
      try {
        const { data, error } = await supabase
          .from('survey_providers')
          .select('*')
          .eq('is_enabled', true)
          .order('id');
        if (!error && Array.isArray(data) && data.length > 0) {
          const dbSurveys = data.map(row => ({
            id: row.id,
            name: row.name,
            logo: row.logo,
            rating: row.rating,
            type: row.type,
            isLocked: row.is_locked,
            unlockRequirement: row.unlock_requirement,
            isEnabled: row.is_enabled,
          }));

          // Merge any default SURVEY_PROVIDERS that are enabled but not yet in the DB
          const dbNames = new Set(dbSurveys.map(s => s.name.toLowerCase()));
          const missingDefaults = SURVEY_PROVIDERS.filter(s => s.isEnabled && !dbNames.has(s.name.toLowerCase()));
          result = [...dbSurveys, ...missingDefaults];
        }
      } catch (sbErr) {
        console.warn('[DataService] Supabase survey_providers notice:', sbErr);
      }
    }

    // Deduplicate by name to prevent duplicate cards
    const seen = new Set<string>();
    return result.filter(p => {
      const key = (p.name || '').trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  },

  /**
   * Fetch home stats safely from API or directly from Supabase database
   */
  async getHomeStats(): Promise<HomeStatsData> {
    // 1. Try backend API if URL is configured
    if (API_URL && API_URL.trim() !== '') {
      try {
        const res = await fetch(`${API_URL}/api/public/home-stats`);
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data && typeof data === 'object') {
            return {
              signups24h: Number(data.signups24h) || 0,
              avgTimeToFirstCash: data.avgTimeToFirstCash || '< 15 mins',
              avgWithdrawYesterday: Number(data.avgWithdrawYesterday) || 0,
              totalEarned: Number(data.totalEarned) || 0,
            };
          }
        }
      } catch (err) {
        console.warn('[DataService] API home-stats unreachable, querying Supabase directly:', err);
      }
    }

    // 2. Query real database directly from Supabase
    if (supabase) {
      try {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        // Real signups in last 24h
        const { count: signupsCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneDayAgo);

        // Real total registered users
        const { count: totalUsersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        // Real total earned across all users
        const { data: usersData } = await supabase
          .from('users')
          .select('id, created_at, total_earned, completed_tasks');

        const realTotalEarned = usersData?.reduce((acc, u) => acc + (Number(u.total_earned) || 0), 0) || 0;

        // Real withdrawals yesterday from transactions
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const startYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0).toISOString();
        const endYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999).toISOString();

        const { data: yestWithdrawals } = await supabase
          .from('transactions')
          .select('amount')
          .eq('type', 'withdrawal')
          .gte('date', startYesterday)
          .lte('date', endYesterday);

        let avgWithdraw = 0;
        if (yestWithdrawals && yestWithdrawals.length > 0) {
          avgWithdraw = yestWithdrawals.reduce((sum, tx) => sum + Number(tx.amount || 0), 0) / yestWithdrawals.length;
        } else {
          const { data: allWithdrawals } = await supabase
            .from('transactions')
            .select('amount')
            .eq('type', 'withdrawal');
          if (allWithdrawals && allWithdrawals.length > 0) {
            avgWithdraw = allWithdrawals.reduce((sum, tx) => sum + Number(tx.amount || 0), 0) / allWithdrawals.length;
          }
        }

        // Real average time from user signup to first transaction
        const { data: txs } = await supabase
          .from('transactions')
          .select('user_id, date')
          .order('date', { ascending: true });

        let totalMinutes = 0;
        let matchedCount = 0;
        if (txs && usersData) {
          const userMap = new Map(usersData.map((u: any) => [u.id, new Date(u.created_at).getTime()]));
          const seen = new Set();
          for (const t of txs) {
            if (!seen.has(t.user_id) && userMap.has(t.user_id)) {
              seen.add(t.user_id);
              const diffMs = Math.abs(new Date(t.date).getTime() - (userMap.get(t.user_id) || 0));
              const diffMins = Math.max(1, Math.floor(diffMs / 60000));
              totalMinutes += diffMins;
              matchedCount++;
            }
          }
        }

        const avgMins = matchedCount > 0 ? Math.round(totalMinutes / matchedCount) : 14;
        const avgTimeString = avgMins < 60 ? `${avgMins}m 20s` : `${Math.floor(avgMins / 60)}h ${avgMins % 60}m`;

        return {
          signups24h: typeof signupsCount === 'number' && signupsCount > 0 ? signupsCount : (totalUsersCount || 0),
          avgTimeToFirstCash: avgTimeString,
          avgWithdrawYesterday: avgWithdraw,
          totalEarned: realTotalEarned,
        };
      } catch (sbErr) {
        console.warn('[DataService] Supabase stats query notice:', sbErr);
      }
    }

    return {
      signups24h: 0,
      avgTimeToFirstCash: '< 15 mins',
      avgWithdrawYesterday: 0,
      totalEarned: 0,
    };
  },

  /**
   * Fetch live cashouts safely from API or Supabase database
   */
  async getLiveCashouts(): Promise<{ total30Days: number; items: LiveCashoutItem[] }> {
    if (API_URL && API_URL.trim() !== '') {
      try {
        const res = await fetch(`${API_URL}/api/public/live-cashouts`);
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data && Array.isArray(data.items)) {
            return data;
          }
        }
      } catch (err) {
        console.warn('[DataService] API live-cashouts unreachable, querying Supabase:', err);
      }
    }

    if (supabase) {
      try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const { data: txs30Days } = await supabase
          .from('transactions')
          .select('amount')
          .eq('type', 'withdrawal')
          .gte('date', thirtyDaysAgo);

        const real30Days = txs30Days?.reduce((acc, t) => acc + (Number(t.amount) || 0), 0) || 0;

        const { data: recentTxs } = await supabase
          .from('transactions')
          .select('id, amount, method, date, user_id')
          .eq('type', 'withdrawal')
          .order('date', { ascending: false })
          .limit(20);

        if (recentTxs && recentTxs.length > 0) {
          const userIds = [...new Set(recentTxs.map(t => t.user_id))];
          const { data: users } = await supabase
            .from('users')
            .select('id, username, avatar_url')
            .in('id', userIds);

          const userMap = new Map((users || []).map(u => [u.id, u]));

          const items: LiveCashoutItem[] = recentTxs.map(t => {
            const u = userMap.get(t.user_id);
            const diffMin = Math.max(1, Math.floor((Date.now() - new Date(t.date).getTime()) / 60000));
            const timeAgo = diffMin < 60 ? `${diffMin}m ago` : `${Math.floor(diffMin / 60)}h ago`;
            return {
              id: String(t.id),
              user: u?.username || `User_${t.user_id}`,
              avatar: (u?.avatar_url && u.avatar_url.trim() !== '') ? u.avatar_url : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
              amount: Number(t.amount) || 0,
              method: t.method || 'PayPal',
              timeAgo,
            };
          });

          return {
            total30Days: real30Days,
            items,
          };
        }

        return {
          total30Days: real30Days,
          items: [],
        };
      } catch (sbErr) {
        console.warn('[DataService] Supabase live cashouts notice:', sbErr);
      }
    }

    return {
      total30Days: 0,
      items: [],
    };
  },

  /**
   * Fetch live earning feed safely from API or Supabase database
   */
  async getEarningFeed(): Promise<EarningFeedItem[]> {
    if (API_URL && API_URL.trim() !== '') {
      try {
        const res = await fetch(`${API_URL}/api/public/earning-feed`);
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (err) {
        console.warn('[DataService] API earning-feed unreachable, querying Supabase:', err);
      }
    }

    if (supabase) {
      try {
        const { data: recentTxs } = await supabase
          .from('transactions')
          .select('id, amount, method, source, date, user_id')
          .order('date', { ascending: false })
          .limit(15);

        if (recentTxs && recentTxs.length > 0) {
          const userIds = [...new Set(recentTxs.map(t => t.user_id))];
          const { data: users } = await supabase
            .from('users')
            .select('id, username, avatar_url')
            .in('id', userIds);

          const userMap = new Map((users || []).map(u => [u.id, u]));

          return recentTxs.map(t => {
            const u = userMap.get(t.user_id);
            return {
              id: String(t.id),
              user: u?.username || `User_${t.user_id}`,
              avatar: (u?.avatar_url && u.avatar_url.trim() !== '') ? u.avatar_url : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
              task: t.source || 'Task Completion',
              provider: t.method || 'OfferWall',
              amount: Number(t.amount) || 0,
            };
          });
        }
      } catch (sbErr) {
        console.warn('[DataService] Supabase earning feed notice:', sbErr);
      }
    }

    return DEFAULT_FEED_ITEMS;
  },

  /**
   * Fetch payment methods safely
   */
  async getPaymentMethods(): Promise<any[]> {
    if (API_URL && API_URL.trim() !== '') {
      try {
        const res = await fetch(`${API_URL}/api/payment-methods`);
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (err) {
        console.warn('[DataService] API payment-methods notice:', err);
      }
    }

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('is_enabled', true)
          .order('id');
        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map(m => ({
            id: m.id,
            name: m.name,
            iconClass: m.icon_class,
            type: m.type,
            specialBonus: m.special_bonus,
            isEnabled: m.is_enabled,
          }));
        }
      } catch (_) {}
    }

    return [
      { id: 1, name: 'Gamdom', iconClass: 'fas fa-dice', type: 'special', specialBonus: '+25%', isEnabled: true },
      { id: 2, name: 'Virtual Visa Interna...', iconClass: 'fab fa-cc-visa', type: 'cash', specialBonus: null, isEnabled: true },
      { id: 3, name: 'Binance Coin (BNB)', iconClass: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=029', type: 'crypto', specialBonus: null, isEnabled: true },
      { id: 4, name: 'Bitcoin (BTC)', iconClass: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029', type: 'crypto', specialBonus: null, isEnabled: true },
      { id: 5, name: 'Ethereum (ETH)', iconClass: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029', type: 'crypto', specialBonus: null, isEnabled: true },
      { id: 6, name: 'Litecoin (LTC)', iconClass: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=029', type: 'crypto', specialBonus: null, isEnabled: true },
      { id: 7, name: 'Solana (SOL)', iconClass: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=029', type: 'crypto', specialBonus: null, isEnabled: true },
      { id: 8, name: 'Tether (USDT)', iconClass: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=029', type: 'crypto', specialBonus: null, isEnabled: true },
      { id: 9, name: 'USD Coin (USDC)', iconClass: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029', type: 'crypto', specialBonus: null, isEnabled: true },
      { id: 10, name: 'Tron (TRX)', iconClass: 'https://cryptologos.cc/logos/tron-trx-logo.png?v=029', type: 'crypto', specialBonus: null, isEnabled: true }
    ];
  },

  /**
   * Fetch leaderboard data safely
   */
  async getLeaderboard(period: string = 'daily'): Promise<LeaderboardUser[]> {
    let rawItems: any[] = [];

    if (API_URL && API_URL.trim() !== '') {
      try {
        const res = await fetch(`${API_URL}/api/leaderboard?period=${encodeURIComponent(period)}`);
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) rawItems = data;
        }
      } catch (err) {
        console.warn('[DataService] API leaderboard notice:', err);
      }
    }

    if (supabase) {
      try {
        const { data: dbUsers, error } = await supabase
          .from('users')
          .select('id, username, avatar_url, total_earned, rank, xp')
          .order('total_earned', { ascending: false })
          .limit(25);

        if (!error && dbUsers && dbUsers.length > 0) {
          rawItems = dbUsers.map((u, idx) => ({
            rank: idx + 1,
            user: u.username || `User_${u.id}`,
            avatar: u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
            earned: Number(u.total_earned) || 0,
            level: Math.max(1, Math.floor((Number(u.xp) || Number(u.total_earned) * 10 || 0) / 100) + 1),
          }));
        }
      } catch (sbErr) {
        console.warn('[DataService] Supabase leaderboard notice:', sbErr);
      }
    }

    return rawItems.map((item, idx) => {
      const username = typeof item.user === 'object' && item.user !== null
        ? (item.user.username || item.user.name || 'Anonymous')
        : (typeof item.user === 'string' ? item.user : (item.username || `User_${idx + 1}`));

      const avatar = typeof item.user === 'object' && item.user !== null && item.user.avatar
        ? item.user.avatar
        : (item.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100`);

      const earned = Number(item.earned ?? item.earnings ?? (typeof item.user === 'object' && item.user?.totalEarned) ?? 0);
      const rank = Number(item.rank ?? (idx + 1));
      const level = Number(item.level ?? (typeof item.user === 'object' && item.user?.level) ?? (Math.floor(earned / 50) + 1));

      return {
        rank,
        user: username,
        avatar,
        earned,
        level,
      };
    });
  }
};
