import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import SkeletonLoader from '../SkeletonLoader';
import StatusBadge from '../StatusBadge';

const DashboardPage: React.FC = () => {
    const { user, setCurrentPage, transactions, setIsProfileEditModalOpen } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('Tasks');
    const [isLoading, setIsLoading] = useState(true);
    const [copiedEarnId, setCopiedEarnId] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500); // Simulate data fetching
        return () => clearTimeout(timer);
    }, []);

    if (!user) return <div>Loading...</div>;

    const xpPercentage = user.xpToNextLevel ? ((user.xp || 0) / user.xpToNextLevel) * 100 : 0;
    const earnIdValue = user.earnId || user.earn_id || `rewardgrip${String(user.id).padStart(6, '0')}`;

    const handleCopyEarnId = () => {
        navigator.clipboard.writeText(earnIdValue);
        setCopiedEarnId(true);
        setTimeout(() => setCopiedEarnId(false), 2000);
    };

    const renderTabContent = () => {
        if (isLoading) {
            return (
                <div className="p-6">
                    <SkeletonLoader className="h-8 w-full mb-2" />
                    <SkeletonLoader className="h-8 w-full mb-2" />
                    <SkeletonLoader className="h-8 w-full" />
                </div>
            )
        }

        const dataForTab = (transactions ?? []).filter(tx => {
            const type = (tx.type ?? "").toLowerCase();
            const method = (tx.method ?? "").toLowerCase();
            const source = (tx.source ?? "").toLowerCase();

            if (activeTab === 'Withdrawals') return type === 'withdrawal';

            // Surveys = earn + method survey (DB অনুযায়ী)
            if (activeTab === 'Surveys') return type === 'earn' && method === 'survey';

            // Tasks/Offers যদি তোমার DB তে method/source দিয়ে আসে, সেভাবে সেট করো
            if (activeTab === 'Tasks') return method === 'task';
            if (activeTab === 'Offers') return method === 'offer';

            return false;
        });


        const headers = ['Method', 'ID', 'Category', 'Provider', 'Status', 'Total', 'Date'];

        return (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-900/50">
                        <tr>
                            {headers.map(header => (
                                <th scope="col" key={header} className="px-6 py-3">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dataForTab.length > 0 ? (
                            dataForTab.map((item) => (
                                <tr key={item.id} className="border-t border-slate-200 dark:border-slate-700">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{item.method}</td>
                                    <td className="px-6 py-4">{item.id}</td>
                                    <td className="px-6 py-4">
                                        {activeTab === 'Surveys' ? 'Survey' : (item.source || item.type)}
                                    </td>

                                    <td className="px-6 py-4">
                                        {activeTab === 'Surveys' ? (item.source ?? 'N/A') : 'N/A'}
                                    </td>

                                    <td className="px-6 py-4">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-green-500 dark:text-green-400">${(Number(item.amount) || 0).toFixed(2)}</td>
                                    <td className="px-6 py-4">{item.date}</td>
                                </tr>
                            ))
                        ) : (
                            <tr className="border-t border-slate-200 dark:border-slate-700">
                                <td colSpan={headers.length} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-4">
                                        <i className="fas fa-folder-open text-4xl text-slate-400 dark:text-slate-500"></i>
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-300">No History Found</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">Your completed {activeTab.toLowerCase()} will appear here.</p>
                                        <button
                                            onClick={() => setCurrentPage(activeTab === 'Tasks' ? 'Tasks' : activeTab === 'Surveys' ? 'Surveys' : 'Offer')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-transform active:scale-95"
                                        >
                                            Browse {activeTab}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="flex justify-center items-center p-4 border-t border-slate-200 dark:border-slate-700">
                    <button className="text-slate-400 dark:text-slate-500 mx-2" disabled>&lt;</button>
                    <button className="text-slate-400 dark:text-slate-500 mx-2" disabled>&gt;</button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* User Profile Section */}
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <img 
                      src={user.avatarUrl && user.avatarUrl.trim() !== '' ? user.avatarUrl : `https://i.pravatar.cc/150?u=${encodeURIComponent(user.username || 'user')}`} 
                      alt={user.username} 
                      className="w-24 h-24 rounded-lg object-cover" 
                    />
                    <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white break-all">{user.username}</h2>
                            <div className="flex items-center gap-2 self-start sm:self-auto">
                                <span className="bg-slate-100 dark:bg-slate-700 text-yellow-500 dark:text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">{user.rank}</span>
                                <button
                                    onClick={() => setIsProfileEditModalOpen(true)}
                                    className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 px-3 py-1 rounded-full text-sm font-semibold transition-colors flex items-center gap-2"
                                    aria-label="Edit profile"
                                >
                                    <i className="fas fa-pencil-alt text-xs"></i>
                                    <span>Edit</span>
                                </button>
                            </div>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Joined {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                            <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md font-mono">ID: #{user.id}</span>
                            <span 
                                onClick={handleCopyEarnId}
                                title="Click to copy Earn ID"
                                className="inline-flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-md font-mono font-medium cursor-pointer transition-all active:scale-95 shadow-sm"
                            >
                                <i className="fas fa-fingerprint text-[10px] text-emerald-500" />
                                <span>Earn ID: <strong className="font-bold tracking-wide">{earnIdValue}</strong></span>
                                <i className={`fas ${copiedEarnId ? 'fa-check text-emerald-500' : 'fa-copy text-[10px] opacity-70'} ml-1`} />
                            </span>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-500 dark:text-slate-400">{(user.xp || 0).toLocaleString()} XP</span>
                                <span className="text-slate-900 dark:text-white">{(user.xpToNextLevel || 0).toLocaleString()} XP to next level</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${xpPercentage}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [...Array(6)].map((_, i) => <StatCardSkeleton key={i} />)
                ) : (
                    <>
                        <StatCard title="Total Earned" value={`$${(user.totalEarned || 0).toFixed(2)}`} icon="fas fa-dollar-sign" />
                        <StatCard title="Last 30 Days Earned" value={`$${(user.last30DaysEarned || 0).toFixed(2)}`} icon="fas fa-calendar-alt" />
                        <StatCard title="Completed Tasks" value={(user.completedTasks || 0).toString()} icon="fas fa-check-circle" />
                        <StatCard title="Total Wagered" value={`$${(user.totalWagered || 0).toFixed(2)}`} icon="fas fa-dice" />
                        <StatCard title="Total Profit" value={`$${(user.totalProfit || 0).toFixed(2)}`} icon="fas fa-chart-line" />
                        <StatCard title="Total Withdrawn" value={`$${(user.totalWithdrawn || 0).toFixed(2)}`} icon="fas fa-university" />
                    </>
                )}
            </div>

            {/* Activity Tabs Section */}
            <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-2 overflow-x-auto">
                        {['Tasks', 'Surveys', 'Offers', 'Withdrawals', 'Openings', 'Battles'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-md ${activeTab === tab ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                {renderTabContent()}
            </div>
        </div>
    );
};


interface StatCardProps {
    title: string;
    value: string;
    icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
    return (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg flex items-center gap-4 border border-slate-200 dark:border-slate-800">
            <div className="bg-slate-100 dark:bg-slate-700 text-blue-500 dark:text-blue-400 w-12 h-12 rounded-full flex items-center justify-center">
                <i className={`${icon} text-xl`}></i>
            </div>
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{title}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
            </div>
        </div>
    )
}

const StatCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg flex items-center gap-4 border border-slate-200 dark:border-slate-800">
            <SkeletonLoader className="w-12 h-12 rounded-full" />
            <div className="flex-1">
                <SkeletonLoader className="h-4 w-24 mb-2" />
                <SkeletonLoader className="h-6 w-16" />
            </div>
        </div>
    )
}

export default DashboardPage;
