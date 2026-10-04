import React, { useState, useEffect, useContext } from 'react';
import { API_URL } from '../constants';
import type { EarningFeedItem } from '../types';
import { AppContext } from '../App';
import { dataService } from '../services/dataService';

const INITIAL_FEED: EarningFeedItem[] = [
  { id: '1', user: 'AlexGamer', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', task: 'Mobile App Survey', provider: 'BitLabs', amount: 1.45 },
  { id: '2', user: 'SarahK', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', task: 'Monopoly GO Level 12', provider: 'Torox', amount: 3.20 },
  { id: '3', user: 'CryptoWhale', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', task: 'Withdrawal', provider: 'Litecoin (LTC)', amount: 15.00 },
  { id: '4', user: 'NovaTasker', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100', task: 'Consumer Study', provider: 'CPX Research', amount: 0.95 },
  { id: '5', user: 'Elena_V', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', task: 'Withdrawal', provider: 'PayPal', amount: 10.00 }
];

const LiveEarningFeed: React.FC = () => {
    const { isLoggedIn, currentPage } = useContext(AppContext);
    const isPublicHomepage = !isLoggedIn && currentPage === 'Home';
    const [feedItems, setFeedItems] = useState<EarningFeedItem[]>(INITIAL_FEED);

    useEffect(() => {
        const fetchFeedData = async () => {
            try {
                const data = await dataService.getEarningFeed();
                if (data && data.length > 0) {
                    setFeedItems(data);
                }
            } catch (error) {
                console.error('Error fetching live earning feed:', error);
            }
        };

        fetchFeedData();
        
        // Refresh the feed every minute
        const interval = setInterval(fetchFeedData, 60000);
        
        return () => clearInterval(interval);

    }, []);

    if (feedItems.length === 0) {
        return null;
    }

    // Triplicate items for smoother infinite scroll on wider screens
    const duplicatedItems = [...feedItems, ...feedItems, ...feedItems];

  return (
    <div className={`overflow-hidden py-3 select-none border-b ${
        isPublicHomepage
            ? 'bg-[#141826] border-white/10'
            : 'bg-white dark:bg-[#0b111e] border-slate-200 dark:border-slate-800'
    }`}>
      <div className="flex animate-marquee gap-4 hover:[animation-play-state:paused] items-center">
        {duplicatedItems.map((item, index) => {
          const isWithdrawal = item.task === 'Withdrawal';
          const providerName = isWithdrawal ? 'Cashout' : (item.provider || 'Offer');
          
          return (
            <div key={`${item.id}-${index}`} className="flex-shrink-0">
                {/* Card Container */}
                <div className="flex items-center bg-slate-100 dark:bg-[#1e2330] rounded-xl p-1.5 pr-3 min-w-[200px] border border-slate-200 dark:border-slate-700/50 shadow-sm group transition-colors hover:bg-slate-200 dark:hover:bg-[#252a38]">
                    
                    {/* Avatar */}
                    <div className="relative mr-3">
                        <img 
                            src={item.avatar && item.avatar.trim() !== '' ? item.avatar : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(typeof item.user === 'object' && item.user ? ((item.user as any).username || 'User') : String(item.user || 'User'))}`} 
                            alt={typeof item.user === 'object' && item.user ? ((item.user as any).username || 'User') : String(item.user || 'User')} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-[#2d3342]" 
                        />
                    </div>
                    
                    {/* Text Info */}
                    <div className="flex flex-col min-w-0 flex-1 mr-3">
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                            {providerName}
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[90px] leading-tight">
                            {typeof item.user === 'object' && item.user ? ((item.user as any).username || 'User') : String(item.user || 'User')}
                        </span>
                    </div>

                    {/* Amount Badge */}
                    <div className="bg-slate-200 dark:bg-[#0f1115] h-9 px-3 rounded-lg border border-slate-300 dark:border-white/10 flex items-center justify-center gap-1.5 shadow-inner">
                        <span className={`text-sm font-extrabold font-mono ${isWithdrawal ? 'text-red-500' : 'text-slate-500'}`}>
                            {Number(item.amount).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-slate-400 dark:text-slate-600 text-lg font-light leading-none mb-0.5">|</span>
                    </div>
                </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default LiveEarningFeed;
