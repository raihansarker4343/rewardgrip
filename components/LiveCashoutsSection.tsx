import React, { useEffect, useState } from 'react';
import { API_URL, REWARD_OPTIONS } from '../constants';
import { dataService } from '../services/dataService';
import RewardLogo from './RewardLogo';

interface LiveCashoutItem {
  id: string | number;
  method: string;
  user: string;
  amount: number;
}

interface LiveCashoutsData {
  total30Days: number;
  items: LiveCashoutItem[];
}

const FALLBACK_CASHOUTS: LiveCashoutItem[] = [
  { id: '1', method: 'PayPal', user: 'Monica', amount: 48 },
  { id: '2', method: 'Amazon', user: 'Sarah', amount: 25 },
  { id: '3', method: 'Venmo', user: 'Brian', amount: 95 },
  { id: '4', method: 'Google Play', user: 'Nova', amount: 200 },
  { id: '5', method: 'Apple', user: 'Nataly Fischer', amount: 48 },
  { id: '6', method: 'PayPal', user: 'Jason', amount: 190 },
  { id: '7', method: 'Litecoin', user: 'Rob', amount: 18 },
  { id: '8', method: 'ACH', user: 'zane', amount: 95 },
  { id: '9', method: 'Visa', user: 'Cindy', amount: 24 },
  { id: '10', method: 'PayPal', user: 'Florian', amount: 29 },
  { id: '11', method: 'Amazon', user: 'Simon', amount: 50 },
  { id: '12', method: 'PayPal', user: 'Katie Hope', amount: 9 },
  { id: '13', method: 'Venmo', user: 'Harmony', amount: 24 },
  { id: '14', method: 'PayPal', user: 'Antony', amount: 190 },
  { id: '15', method: 'Amazon', user: 'medflyster', amount: 50 },
  { id: '16', method: 'PayPal', user: 'RONALD', amount: 9 },
];

const DEFAULT_TOTAL_30_DAYS = 14265354.13;

const METHOD_ICON_MAP = REWARD_OPTIONS.reduce<Record<string, string>>((acc, option) => {
  acc[option.name.toLowerCase()] = option.imageUrl;
  acc[option.name.toLowerCase().replace(/\s+/g, '')] = option.imageUrl;
  return acc;
}, {
  googleplay: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg',
  stake: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=002',
});

const getMethodIcon = (method: string): string | null => {
  const key = method.toLowerCase().replace(/\s+/g, '');
  return METHOD_ICON_MAP[key] || METHOD_ICON_MAP[method.toLowerCase()] || null;
};

const formatMethodLabel = (method: string): string =>
  method.replace(/\s+/g, '');

const formatAmount = (amount: number): string => {
  const rounded = Math.round(amount * 100) / 100;
  return rounded % 1 === 0
    ? rounded.toLocaleString('en-US', { maximumFractionDigits: 0 })
    : rounded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const CashoutCard: React.FC<{ item: LiveCashoutItem }> = ({ item }) => {
  const icon = getMethodIcon(item.method);

  return (
    <div className="flex items-center justify-between gap-3 bg-[#1a1f2e] border border-white/10 rounded-xl px-3 py-2.5 min-w-0 shadow-sm">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden p-1">
          <RewardLogo name={item.method} imageUrl={icon && icon.trim() !== '' ? icon : undefined} className="w-5 h-5 object-contain" />
        </div>
        <span className="text-sm font-semibold text-white truncate">
          {formatMethodLabel(item.method)}@{item.user}
        </span>
      </div>
      <div className="shrink-0 bg-[#0f1115] border border-white/10 rounded-lg px-3 py-1.5">
        <span className="text-sm font-extrabold text-white font-mono">
          ${formatAmount(item.amount)}
        </span>
      </div>
    </div>
  );
};

const CashoutColumn: React.FC<{
  items: LiveCashoutItem[];
  direction: 'up' | 'down';
}> = ({ items, direction }) => {
  const duplicated = [...items, ...items];
  const animationClass =
    direction === 'up' ? 'animate-cashout-scroll-up' : 'animate-cashout-scroll-down';

  return (
    <div className="relative h-[420px] overflow-hidden">
      <div className={`flex flex-col gap-3 ${animationClass} hover:[animation-play-state:paused]`}>
        {duplicated.map((item, index) => (
          <CashoutCard key={`${item.id}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
};

const LiveCashoutsSection: React.FC = () => {
  const [total30Days, setTotal30Days] = useState<number>(0);
  const [cashouts, setCashouts] = useState<LiveCashoutItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCashouts = async () => {
      try {
        const data = await dataService.getLiveCashouts();
        setTotal30Days(Number(data.total30Days) || 0);
        if (data.items && data.items.length > 0) {
          setCashouts(data.items as any);
        } else {
          setCashouts([]);
        }
      } catch (error) {
        console.error('Failed to fetch live cashouts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCashouts();
    const interval = setInterval(fetchCashouts, 60000);
    return () => clearInterval(interval);
  }, []);

  const leftColumn = cashouts.filter((_, i) => i % 2 === 0);
  const rightColumn = cashouts.filter((_, i) => i % 2 === 1);

  return (
    <section className="relative py-8 sm:py-10 md:py-12 bg-[#141826] overflow-hidden">
      <div className="container mx-auto px-6 sm:px-8 max-w-5xl">
        <div className="text-center mb-6 sm:mb-7">
          <p className="text-slate-400 text-sm md:text-base mb-1.5">
            In the last 30 days users cashed out
          </p>
          <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00D26A] tracking-tight">
            ${total30Days.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
          Live cashouts
        </h2>

        {cashouts.length > 0 ? (
          <div className="relative">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#141826] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#141826] to-transparent z-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <CashoutColumn items={leftColumn.length > 0 ? leftColumn : cashouts} direction="up" />
              <CashoutColumn items={rightColumn.length > 0 ? rightColumn : cashouts} direction="down" />
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-[#1a1f2e]/60 border border-white/10 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3 text-emerald-400">
              <i className="fas fa-wallet text-xl" />
            </div>
            <p className="text-white font-bold mb-1">No withdrawals processed yet</p>
            <p className="text-slate-400 text-xs">
              Complete offers, earn rewards, and be among the first to cash out instantly!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveCashoutsSection;
