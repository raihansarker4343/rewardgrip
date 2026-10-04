import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import type { Transaction } from '../../types';
import { API_URL } from '../../constants';
import StatusBadge from '../StatusBadge';
import SkeletonLoader from '../SkeletonLoader';

interface AdminStats {
    totalUsers: number;
    newUsersLast30Days: number;
    tasksCompletedAllTime: number;
    tasksCompletedLast30Days: number;
    totalPaidOut: number;
    pendingWithdrawals: number;
}
interface RecentTask {
    transactionId: string;
    date: string;
    email: string;
    amount: number;
    userId: number;
}
interface RecentSignup {
    id: number;
    email: string;
    joinedDate: string;
}

interface AdminDashboardPageProps {
    onNavigate: (page: string) => void;
    onViewUser: (user: { id: number; email: string }) => void;
}

const StatCard: React.FC<{ title: string, value: string, icon: string, color: string, onClick?: () => void }> = ({ title, value, icon, color, onClick }) => (
    <div
        onClick={onClick}
        className={`p-5 rounded-lg text-white shadow-md ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
        style={{ background: color }}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={e => {
            if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onClick();
            }
        }}
    >
        <div className="flex justify-between items-center">
            <div>
                <p className="text-lg font-semibold">{title}</p>
                <p className="text-4xl font-bold">{value}</p>
            </div>
            <div className="text-5xl opacity-80">
                <i className={icon}></i>
            </div>
        </div>
        <div className="mt-4 text-right">
             <span className="text-sm hover:underline">{onClick ? 'View All' : ''}</span>
        </div>
    </div>
);

const CircleStat: React.FC<{ title: string, value: string, percentage: number, color: string }> = ({ title, value, percentage, color }) => (
    <div className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center text-center">
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                    className="text-slate-200"
                    strokeWidth="3"
                    fill="none"
                    stroke="currentColor"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                    className={color}
                    strokeWidth="3"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeDasharray={`${percentage}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-slate-700">{value}</div>
        </div>
        <p className="mt-3 font-semibold text-slate-600">{title}</p>
    </div>
);

const TableSkeleton: React.FC<{ rowCount?: number; colCount: number; }> = ({ rowCount = 5, colCount }) => (
    <table className="w-full text-sm">
        <thead>
            <tr className="text-left text-slate-500">
                {[...Array(colCount)].map((_, i) => (
                    <th key={i} className="p-2">
                        <SkeletonLoader className="h-4 w-3/4 rounded" />
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {[...Array(rowCount)].map((_, i) => (
                <tr key={i} className="border-t border-slate-200">
                    {[...Array(colCount)].map((_, j) => (
                        <td key={j} className="p-2">
                            <SkeletonLoader className="h-5 w-full rounded" />
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate, onViewUser }) => {
    const { setTransactions: setGlobalTransactions } = useContext(AppContext);
    const [withdrawalRequests, setWithdrawalRequests] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isStatsLoading, setIsStatsLoading] = useState(true);

    const [recentTasks, setRecentTasks] = useState<RecentTask[]>([]);
    const [recentSignups, setRecentSignups] = useState<RecentSignup[]>([]);
    const [isTablesLoading, setIsTablesLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Authentication token not found.");
            setIsLoading(false);
            setIsStatsLoading(false);
            setIsTablesLoading(false);
            return;
        }

        try {
            const [withdrawalsRes, statsRes, tasksRes, signupsRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/transactions?limit=5`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/api/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/api/admin/recent-tasks`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/api/admin/recent-signups`, { headers: { 'Authorization': `Bearer ${token}` } }),
            ]);

            if (!withdrawalsRes.ok) throw new Error("Failed to fetch withdrawal requests.");
            const withdrawalsData: Transaction[] = await withdrawalsRes.json();
            setWithdrawalRequests(withdrawalsData.map(tx => ({...tx, amount: Number(tx.amount)})));

            if (!statsRes.ok) throw new Error("Failed to fetch dashboard stats.");
            const statsData: AdminStats = await statsRes.json();
            setStats(statsData);
            
            if (!tasksRes.ok) throw new Error("Failed to fetch recent tasks.");
            const tasksData = await tasksRes.json();
            setRecentTasks(tasksData);

            if (!signupsRes.ok) throw new Error("Failed to fetch recent signups.");
            const signupsData = await signupsRes.json();
            setRecentSignups(signupsData);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
            setIsStatsLoading(false);
            setIsTablesLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateTransactionStatus = async (txId: string, status: 'Completed' | 'Rejected'): Promise<Transaction | null> => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Admin not authenticated.");
            return null;
        }
        try {
            const response = await fetch(`${API_URL}/api/admin/transactions/${txId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to update transaction.');
            }
            const updatedTx: Transaction = await response.json();
            const parsedUpdatedTx = { ...updatedTx, amount: Number(updatedTx.amount) };
            
            setWithdrawalRequests(prev => prev.map(t => t.id === txId ? parsedUpdatedTx : t));
            setGlobalTransactions(prev => prev.map(t => t.id === txId ? parsedUpdatedTx : t));
            
            // Re-fetch stats to show updated totals
            const statsRes = await fetch(`${API_URL}/api/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (statsRes.ok) setStats(await statsRes.json());
            
            return parsedUpdatedTx;
        } catch (error: any) {
            alert(`Error: ${error.message}`);
            return null;
        }
    };

    const handleApprove = async (txId: string) => {
        await updateTransactionStatus(txId, 'Completed');
    };

    const handleReject = async (txId: string) => {
        await updateTransactionStatus(txId, 'Rejected');
    };
    
    const lowercasedQuery = searchQuery.toLowerCase();

    const filteredWithdrawalRequests = withdrawalRequests.filter(tx => 
        tx.id.toLowerCase().includes(lowercasedQuery) ||
        (tx.email && tx.email.toLowerCase().includes(lowercasedQuery)) ||
        tx.method.toLowerCase().includes(lowercasedQuery) ||
        String(tx.amount).includes(lowercasedQuery)
    );

    const filteredRecentTasks = recentTasks.filter(task =>
        task.transactionId.toLowerCase().includes(lowercasedQuery) ||
        task.email.toLowerCase().includes(lowercasedQuery) ||
        String(task.amount).includes(lowercasedQuery)
    );

    const filteredRecentSignups = recentSignups.filter(signup =>
        signup.email.toLowerCase().includes(lowercasedQuery)
    );

    return (
        <div className="space-y-6">
             {/* Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <i className="fas fa-search text-slate-400"></i>
                    </span>
                    <input
                        type="text"
                        placeholder="Search tables by ID, email, method, or amount..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                        aria-label="Search dashboard tables"
                    />
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Pending Withdrawals!" value={isStatsLoading ? '...' : (stats?.pendingWithdrawals ?? 0).toString()} icon="fas fa-dollar-sign" color="linear-gradient(to right, #ef4444, #dc2626)" onClick={() => onNavigate('Withdrawals')} />
                <StatCard title="Active Offers!" value="414" icon="fas fa-dollar-sign" color="linear-gradient(to right, #f97316, #ea580c)" onClick={() => onNavigate('OfferControl')} />
                <StatCard title="Completed Tasks!" value={isStatsLoading ? '...' : (stats?.tasksCompletedAllTime ?? 0).toString()} icon="fas fa-check-circle" color="linear-gradient(to right, #22c55e, #16a34a)" />
                <StatCard title="Total Offer Walls!" value="6" icon="fas fa-shopping-cart" color="linear-gradient(to right, #8b5cf6, #7c3aed)" onClick={() => onNavigate('OfferControl')} />
                <StatCard title="Total Blog Posts!" value="15" icon="fas fa-newspaper" color="linear-gradient(to right, #14b8a6, #0d9488)" />
                <StatCard title="Total Paid Out!" value={isStatsLoading ? '...' : `$${(stats?.totalPaidOut ?? 0).toFixed(2)}`} icon="fas fa-receipt" color="linear-gradient(to right, #3b82f6, #2563eb)" onClick={() => onNavigate('Withdrawals')} />
            </div>

            {/* Circle Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <CircleStat title="New Users (Last 30 Days)" value={isStatsLoading ? '...' : (stats?.newUsersLast30Days ?? 0).toString()} percentage={isStatsLoading ? 0 : Math.min(100, ((stats?.newUsersLast30Days ?? 0) / 50) * 100)} color="text-yellow-500" />
                <CircleStat title="Total Users (All Time)" value={isStatsLoading ? '...' : (stats?.totalUsers ?? 0).toString()} percentage={100} color="text-cyan-500" />
                <CircleStat title="Tasks Completed (Last 30 days)" value={isStatsLoading ? '...' : (stats?.tasksCompletedLast30Days ?? 0).toString()} percentage={isStatsLoading ? 0 : Math.min(100, ((stats?.tasksCompletedLast30Days ?? 0) / 100) * 100)} color="text-indigo-500" />
                <CircleStat title="Tasks Completed (All Time)" value={isStatsLoading ? '...' : (stats?.tasksCompletedAllTime ?? 0).toString()} percentage={100} color="text-green-500" />
            </div>

            {/* Withdrawal Requests Table */}
            <div className="bg-white p-5 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-800">Withdrawal Requests</h3>
                    <button onClick={() => onNavigate('Withdrawals')} className="text-sm text-blue-600 hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    {isLoading ? <TableSkeleton colCount={7} /> : error ? <p className="text-red-500">{error}</p> :
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-slate-500">
                                <th className="p-2">Transaction ID</th>
                                <th className="p-2">Date</th>
                                <th className="p-2">User Email</th>
                                <th className="p-2">Method</th>
                                <th className="p-2">Amount</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {filteredWithdrawalRequests.length > 0 ? (
                                filteredWithdrawalRequests.map(tx => (
                                    <tr key={tx.id} className="border-t border-slate-200">
                                        <td className="p-2 font-medium">{tx.id}</td>
                                        <td className="p-2">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className="p-2">
                                            <button 
                                                onClick={() => tx.email && onViewUser({ id: tx.userId, email: tx.email })} 
                                                className="text-blue-600 hover:underline"
                                                disabled={!tx.email}
                                            >
                                                {tx.email}
                                            </button>
                                        </td>
                                        <td className="p-2">{tx.method}</td>
                                        <td className="p-2 font-bold">${(Number(tx.amount) || 0).toFixed(2)}</td>
                                        <td className="p-2">
                                            <StatusBadge status={tx.status} />
                                        </td>
                                        <td className="p-2">
                                            {tx.status === 'Pending' ? (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleApprove(tx.id)} className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600">Approve</button>
                                                    <button onClick={() => handleReject(tx.id)} className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600">Reject</button>
                                                </div>
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center p-4 text-slate-500">
                                        {searchQuery ? 'No matching requests found.' : 'No pending withdrawal requests.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    }
                </div>
            </div>

            {/* Data Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">Recent Task Completions</h3>
                    <div className="overflow-x-auto">
                        {isTablesLoading ? <TableSkeleton colCount={5} /> : 
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-slate-500">
                                    <th className="p-2">Transaction ID</th>
                                    <th className="p-2">Date</th>
                                    <th className="p-2">User</th>
                                    <th className="p-2">Amount</th>
                                    <th className="p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                {filteredRecentTasks.length > 0 ? (
                                    filteredRecentTasks.map(task => (
                                        <tr key={task.transactionId} className="border-t border-slate-200">
                                            <td className="p-2 font-medium">{task.transactionId}</td>
                                            <td className="p-2">{new Date(task.date).toLocaleDateString()}</td>
                                            <td className="p-2">{task.email}</td>
                                            <td className="p-2 font-bold">${(Number(task.amount) || 0).toFixed(2)}</td>
                                            <td className="p-2">
                                                <button onClick={() => onViewUser({ id: task.userId, email: task.email })} className="bg-slate-800 text-white px-3 py-1 rounded text-xs hover:bg-slate-700">Details</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center p-4 text-slate-500">
                                            {searchQuery ? 'No matching tasks found.' : 'No recent tasks.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        }
                    </div>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">Recent Signups</h3>
                     <div className="overflow-x-auto">
                        {isTablesLoading ? <TableSkeleton colCount={3} /> :
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-slate-500">
                                    <th className="p-2">Customer Email</th>
                                    <th className="p-2">Joined</th>
                                    <th className="p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                {filteredRecentSignups.length > 0 ? (
                                    filteredRecentSignups.map(signupUser => (
                                         <tr key={signupUser.email} className="border-t border-slate-200">
                                            <td className="p-2 font-medium">{signupUser.email}</td>
                                            <td className="p-2">{new Date(signupUser.joinedDate).toLocaleString()}</td>
                                            <td className="p-2">
                                                <button onClick={() => onViewUser({ id: signupUser.id, email: signupUser.email })} className="bg-slate-800 text-white px-3 py-1 rounded text-xs hover:bg-slate-700">Details</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="text-center p-4 text-slate-500">
                                            {searchQuery ? 'No matching signups found.' : 'No recent signups.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;