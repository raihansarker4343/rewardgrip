import React, { useState, useEffect } from 'react';
import type { User, Transaction } from '../../types';
import { API_URL } from '../../constants';
import StatusBadge from '../StatusBadge';

interface UserDetailPageProps {
  user: { id: number; email?: string } | null;
  onBack: () => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: string }> = ({
  title,
  value,
  icon,
}) => (
  <div className="bg-white p-4 rounded-lg flex items-center gap-4 border border-slate-200">
    <div className="bg-slate-100 text-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
      <i className={`${icon} text-lg`}></i>
    </div>
    <div>
      <p className="text-slate-500 text-sm">{title}</p>
      <p className="text-lg font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const UserDetailPage: React.FC<UserDetailPageProps> = ({ user, onBack }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [banLoading, setBanLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mockActivity = [
    {
      icon: 'fas fa-sign-in-alt',
      text: 'Logged in from New York, USA',
      time: '2 hours ago',
    },
    {
      icon: 'fas fa-check-circle',
      text: 'Completed task #T58291 for $2.50',
      time: '5 hours ago',
    },
    {
      icon: 'fas fa-university',
      text: 'Requested withdrawal of $25.00',
      time: '1 day ago',
    },
    {
      icon: 'fas fa-user-edit',
      text: 'Updated profile username',
      time: '2 days ago',
    },
    {
      icon: 'fas fa-sign-in-alt',
      text: 'Logged in from London, UK',
      time: '2 days ago',
    },
  ];

  useEffect(() => {
    if (!user || !user.id) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found.');
        setIsLoading(false);
        return;
      }

      try {
        const [userRes, transactionsRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/users/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/admin/users/${user.id}/transactions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!userRes.ok) throw new Error('Failed to fetch user details.');
        const fetchedUser: User = await userRes.json();
        setUserData(fetchedUser);

        if (!transactionsRes.ok)
          throw new Error('Failed to fetch user transactions.');
        const fetchedTransactions: Transaction[] = await transactionsRes.json();
        setTransactions(
          fetchedTransactions.map((tx) => ({
            ...tx,
            amount: Number(tx.amount),
          }))
        );
      } catch (err: any) {
        console.error('Failed to load user details:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleBanUser = async () => {
    if (!userData) return;

    const isBanned = (userData as any).isBanned || (userData as any).is_banned;
    if (isBanned) return; // already banned

    const confirmBan = window.confirm(
      `Are you sure you want to BAN user "${userData.username}" (ID: ${userData.id})?`
    );
    if (!confirmBan) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found.');
      return;
    }

    try {
      setBanLoading(true);
      setError(null);

      const res = await fetch(
        `${API_URL}/api/admin/users/${userData.id}/ban`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to ban user');
      }

      // সফল হলে frontend state এ isBanned/is_banned true করে দেই
      setUserData((prev) =>
        prev ? ({ ...prev, isBanned: true } as User) : prev
      );
    } catch (err: any) {
      console.error('Ban user failed:', err);
      setError(err.message || 'Failed to ban user');
    } finally {
      setBanLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="text-sm text-blue-600 hover:underline"
        >
          &larr; Back to List
        </button>
        <div className="text-red-500">No user selected.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-slate-700">
        <button
          onClick={onBack}
          className="text-sm text-blue-600 hover:underline mb-2"
        >
          &larr; Back to List
        </button>
        Loading user details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <button
          onClick={onBack}
          className="text-sm text-blue-600 hover:underline mb-2"
        >
          &larr; Back to List
        </button>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-4">
        <button
          onClick={onBack}
          className="text-sm text-blue-600 hover:underline mb-2"
        >
          &larr; Back to List
        </button>
        <div>User not found.</div>
      </div>
    );
  }

  const joined =
    // @ts-ignore
    userData.joinedDate || (userData as any).createdAt;
  const isBanned = (userData as any).isBanned || (userData as any).is_banned;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <button
            onClick={onBack}
            className="text-sm text-blue-600 hover:underline mb-2"
          >
            &larr; Back to List
          </button>

          {error && (
            <div className="mb-3 rounded bg-red-100 text-red-700 text-sm px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex items-center gap-4">
            <img
              src={
                ((userData as any).avatarUrl && typeof (userData as any).avatarUrl === 'string' && (userData as any).avatarUrl.trim() !== '')
                  ? (userData as any).avatarUrl
                  : ((userData as any).avatar && typeof (userData as any).avatar === 'string' && (userData as any).avatar.trim() !== '')
                  ? (userData as any).avatar
                  : `https://i.pravatar.cc/150?u=${userData.id}`
              }
              alt={userData.username}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {userData.username}
              </h1>
              <p className="text-slate-500">
                {userData.email || user.email || 'No email provided'}
              </p>
              <p className="text-sm mt-1">
                Status:{' '}
                <span
                  className={`font-semibold ${
                    isBanned ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {isBanned ? 'Withdrawals Banned' : 'Active'}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-semibold text-white bg-slate-700 hover:bg-slate-800 rounded-md">
            Send Notification
          </button>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-md">
            Credit Balance
          </button>
          <button
            className={`px-4 py-2 text-sm font-semibold text-white rounded-md ${
              isBanned
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600'
            }`}
            onClick={handleBanUser}
            disabled={isBanned || banLoading}
          >
            {isBanned ? 'User Banned' : banLoading ? 'Banning...' : 'Ban User'}
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Earned"
          value={`$${Number(userData.totalEarned || 0).toFixed(2)}`}
          icon="fas fa-dollar-sign"
        />
        <StatCard
          title="Current Balance"
          value={`$${Number(userData.balance || 0).toFixed(2)}`}
          icon="fas fa-wallet"
        />
        <StatCard
          title="Total Withdrawn"
          value={`$${Number(userData.totalWithdrawn || 0).toFixed(2)}`}
          icon="fas fa-university"
        />
        <StatCard
          title="Completed Tasks"
          value={Number(userData.completedTasks || 0).toString()}
          icon="fas fa-check-circle"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User info + activity */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-lg shadow-md space-y-4">
            <h3 className="font-bold text-lg text-slate-800 border-b pb-2">
              User Information
            </h3>
            <div className="text-sm space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>User ID:</span>
                <span className="font-medium text-slate-800">
                  {userData.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Earn ID:</span>
                <span className="font-medium text-slate-800">
                  {
                    // @ts-ignore
                    (userData as any).earnId ||
                      (userData as any).earn_id ||
                      'N/A'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Rank:</span>
                <span className="font-medium text-slate-800">
                  {userData.rank}
                </span>
              </div>
              <div className="flex justify-between">
                <span>XP:</span>
                <span className="font-medium text-slate-800">
                  {(userData.xp || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Joined:</span>
                <span className="font-medium text-slate-800">
                  {joined ? new Date(joined).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="font-bold text-lg text-slate-800 mb-4">
              Recent Activity
            </h3>
            <ul className="relative border-l border-slate-200 ml-3">
              {mockActivity.map((activity, index) => (
                <li key={index} className="mb-6 ml-6 last:mb-0">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                    <i
                      className={`${activity.icon} text-blue-600 text-xs`}
                    ></i>
                  </span>
                  <p className="text-sm font-normal text-slate-700">
                    {activity.text}
                  </p>
                  <time className="block text-xs font-normal leading-none text-slate-400 mt-0.5">
                    {activity.time}
                  </time>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Transactions */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow-md">
          <h3 className="font-bold text-lg text-slate-800 mb-4">
            Transaction History
          </h3>
          <div className="overflow-auto max-h-[calc(24rem+4rem)]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-50">
                <tr className="text-left text-slate-500">
                  <th className="p-2">ID</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="border-t border-slate-200">
                      <td className="p-2 font-mono text-xs">{tx.id}</td>
                      <td className="p-2">{tx.type}</td>
                      <td
                        className={`p-2 font-bold ${
                          (tx.type || '').toLowerCase().includes('withdraw')
                            ? 'text-red-500'
                            : 'text-green-500'
                        }`}
                      >
                        ${(tx.amount || 0).toFixed(2)}
                      </td>
                      <td className="p-2">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="p-2">
                        {tx.date
                          ? new Date(tx.date).toLocaleString()
                          : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center p-4 text-slate-500"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
