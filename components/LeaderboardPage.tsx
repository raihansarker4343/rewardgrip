import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import type { LeaderboardUser } from '../types';
import { API_URL } from '../constants';
import { dataService } from '../services/dataService';
import SkeletonLoader from './SkeletonLoader';

const getNextResetDate = (period: 'Daily' | 'Weekly' | 'Monthly'): Date => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(0, 0, 0, 0);

    if (period === 'Daily') {
        target.setUTCDate(target.getUTCDate() + 1);
    } else if (period === 'Weekly') {
        const day = target.getUTCDay(); // Sunday = 0, Monday = 1
        const daysUntilMonday = day === 0 ? 1 : 8 - day;
        target.setUTCDate(target.getUTCDate() + daysUntilMonday);
    } else if (period === 'Monthly') {
        target.setUTCMonth(target.getUTCMonth() + 1, 1);
    }
    return target;
};

const PrizeCard: React.FC<{ rank: number; prize: string; color: string; icon: string }> = ({ rank, prize, color, icon }) => (
    <div className={`p-6 rounded-lg text-white shadow-lg text-center flex flex-col items-center justify-center ${color}`}>
        <div className="text-4xl mb-2 opacity-80"><i className={icon}></i></div>
        <p className="font-bold text-lg">#{rank} Place</p>
        <p className="text-3xl font-extrabold">{prize}</p>
    </div>
);

const getUsername = (userVal: any): string => {
    if (!userVal) return 'Anonymous';
    if (typeof userVal === 'string') return userVal;
    if (typeof userVal === 'object') return userVal.username || userVal.name || 'Anonymous';
    return String(userVal);
};

const getAvatar = (avatarVal?: string, userVal?: any): string => {
    if (avatarVal && typeof avatarVal === 'string' && avatarVal.trim() !== '') return avatarVal;
    if (typeof userVal === 'object' && userVal?.avatar && typeof userVal.avatar === 'string' && userVal.avatar.trim() !== '') return userVal.avatar;
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';
};

const LeaderboardPage: React.FC = () => {
    const { user } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
    const [timeLeft, setTimeLeft] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const period = activeTab.toLowerCase();
                const data = await dataService.getLeaderboard(period);
                setLeaderboardData(data);
            } catch (err: any) {
                setError(err.message);
                setLeaderboardData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboardData();
    }, [activeTab]);

    useEffect(() => {
        const targetDate = getNextResetDate(activeTab);
        const timer = setInterval(() => {
            const difference = targetDate.getTime() - new Date().getTime();
            if (difference <= 0) {
                setTimeLeft('Resetting...');
                if (difference <= -1000) {
                    // Refetch data after reset
                    setActiveTab(prev => prev);
                }
                return;
            }
            const d = Math.floor(difference / (1000 * 60 * 60 * 24));
            const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const m = Math.floor((difference / 1000 / 60) % 60);
            const s = Math.floor((difference / 1000) % 60);
            setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
        }, 1000);

        return () => clearInterval(timer);
    }, [activeTab]);
    
    const currentUserData = leaderboardData.find(u => getUsername(u.user) === user?.username);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Leaderboard</h1>
                <p className="text-slate-500 dark:text-slate-400">See who's at the top and compete for exclusive prizes.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PrizeCard rank={1} prize="$100" color="bg-gradient-to-br from-yellow-400 to-yellow-600" icon="fas fa-trophy" />
                <PrizeCard rank={2} prize="$50" color="bg-gradient-to-br from-slate-400 to-slate-600" icon="fas fa-trophy" />
                <PrizeCard rank={3} prize="$25" color="bg-gradient-to-br from-orange-400 to-orange-600" icon="fas fa-trophy" />
            </div>

            <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg">
                        {(['Daily', 'Weekly', 'Monthly'] as const).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Resets in: <span className="font-mono font-bold text-slate-700 dark:text-slate-200 tracking-wider">{timeLeft}</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-700 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Rank</th>
                                <th scope="col" className="px-6 py-3">User</th>
                                <th scope="col" className="px-6 py-3 text-right">Earned</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-800 dark:text-slate-300">
                            {isLoading ? (
                                [...Array(10)].map((_, i) => (
                                    <tr key={i} className="border-t border-slate-200 dark:border-slate-800">
                                        <td className="px-6 py-4 w-16 text-center">
                                            <SkeletonLoader className="h-6 w-6 rounded-md mx-auto" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <SkeletonLoader className="w-9 h-9 rounded-full" />
                                                <div>
                                                    <SkeletonLoader className="h-5 w-24 mb-1" />
                                                    <SkeletonLoader className="h-3 w-16" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <SkeletonLoader className="h-6 w-20 ml-auto" />
                                        </td>
                                    </tr>
                                ))
                            ) : error ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-16 text-red-500">{error}</td>
                                </tr>
                            ) : leaderboardData.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-16 text-slate-500 dark:text-slate-400">
                                        No data available for this period yet.
                                    </td>
                                </tr>
                            ) : (
                                leaderboardData.map((leader, index) => {
                                    const leaderName = getUsername(leader.user);
                                    const leaderAvatar = getAvatar(leader.avatar, leader.user);
                                    const isCurrentUser = leaderName === user?.username;

                                    return (
                                        <tr key={`${leader.rank}-${leaderName}-${index}`} className={`border-t border-slate-200 dark:border-slate-800 transition-colors ${isCurrentUser ? 'bg-blue-100 dark:bg-blue-900/40' : ''}`}>
                                            <td className="px-6 py-4 font-bold text-lg w-16 text-center">
                                                {leader.rank === 1 && <i className="fas fa-trophy text-yellow-400 text-2xl"></i>}
                                                {leader.rank === 2 && <i className="fas fa-trophy text-gray-400 text-xl"></i>}
                                                {leader.rank === 3 && <i className="fas fa-trophy text-orange-400 text-lg"></i>}
                                                {leader.rank > 3 && <span className="text-slate-500 dark:text-slate-400">{leader.rank}</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={leaderAvatar} alt={leaderName} className="w-9 h-9 rounded-full" />
                                                    <div>
                                                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                            <span>{leaderName}</span>
                                                            {isCurrentUser && (
                                                                <span className="text-xs bg-blue-500 text-white font-semibold px-2 py-0.5 rounded-full">You</span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">Level {leader.level || 1}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-green-500 dark:text-green-400">
                                                ${(Number(leader?.earned) || 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {currentUserData && !isLoading && (
                     <div className="p-4 border-t-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 sticky bottom-0">
                         <div className="flex items-center justify-between text-sm font-bold">
                            <div className="flex items-center gap-4">
                               <span className="text-slate-900 dark:text-white">Your Rank: #{currentUserData.rank}</span>
                                <div className="flex items-center gap-2">
                                    <img src={getAvatar(currentUserData.avatar, currentUserData.user)} alt={getUsername(currentUserData.user)} className="w-6 h-6 rounded-full" />
                                    <span className="text-slate-900 dark:text-white">{getUsername(currentUserData.user)}</span>
                               </div>
                            </div>
                             <span className="text-green-500 dark:text-green-400">${(Number(currentUserData?.earned) || 0).toFixed(2)}</span>
                         </div>
                     </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;