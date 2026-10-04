import React, { useState, useEffect } from 'react';
import type { User } from '../../types';
import { API_URL } from '../../constants';
import SkeletonLoader from '../SkeletonLoader';

interface UsersPageProps {
    onViewUser: (user: { id: number; email: string }) => void;
}

const TableSkeleton: React.FC<{ rowCount?: number; colCount: number; }> = ({ rowCount = 10, colCount }) => (
    <table className="w-full text-sm">
        <thead>
            <tr className="text-left text-slate-500">
                {[...Array(colCount)].map((_, i) => (
                    <th key={i} className="p-3">
                        <SkeletonLoader className="h-4 w-3/4 rounded" />
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {[...Array(rowCount)].map((_, i) => (
                <tr key={i} className="border-t border-slate-200">
                    {[...Array(colCount)].map((_, j) => (
                        <td key={j} className="p-3">
                            <SkeletonLoader className="h-5 w-full rounded" />
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);

const UsersPage: React.FC<UsersPageProps> = ({ onViewUser }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async (page = 1, search = '') => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Authentication token not found.");
            setIsLoading(false);
            return;
        }

        try {
            const url = new URL(`${API_URL}/api/admin/users`);
            url.searchParams.append('page', page.toString());
            if (search) {
                url.searchParams.append('search', search);
            }

            const response = await fetch(url.toString(), {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to fetch users.");

            const data = await response.json();
            setUsers(data.users);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchData(currentPage, searchQuery);
        }, 300); // Debounce search input

        return () => clearTimeout(debounceTimer);
    }, [searchQuery, currentPage]);


    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                <p className="text-slate-500 mt-1">View, search, and manage all users.</p>
            </div>
            
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i className="fas fa-search text-slate-400"></i>
                </span>
                <input
                    type="text"
                    placeholder="Search by username or email..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1); // Reset to first page on new search
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                    aria-label="Search users"
                />
            </div>

            <div className="overflow-x-auto">
                {isLoading ? <TableSkeleton colCount={6} /> : error ? <p className="text-red-500">{error}</p> :
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr className="text-left text-slate-500">
                                <th className="p-3 font-semibold">User</th>
                                <th className="p-3 font-semibold">User ID</th>
                                <th className="p-3 font-semibold">Joined Date</th>
                                <th className="p-3 font-semibold">Balance</th>
                                <th className="p-3 font-semibold">Status</th>
                                <th className="p-3 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {users.length > 0 ? (
                                users.map(user => (
                                    <tr key={user.id} className="border-b border-slate-200 last:border-0">
                                        <td className="p-3">
                                            <button
                                                onClick={() => onViewUser({ id: Number(user.id), email: user.email || '' })}
                                                className="flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-slate-500 rounded"
                                                aria-label={`View details for ${user.username}`}
                                            >
                                                <img src={(user.avatarUrl && user.avatarUrl.trim() !== '') ? user.avatarUrl : `https://i.pravatar.cc/150?u=${user.id}`} alt={user.username} className="w-9 h-9 rounded-full object-cover" />
                                                <div>
                                                    <p className="font-bold text-slate-800 group-hover:text-blue-600 group-hover:underline">{user.username}</p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </button>
                                        </td>
                                        <td className="p-3 font-mono text-xs">{user.id}</td>
                                        <td className="p-3">{new Date(user.joinedDate || '').toLocaleDateString()}</td>
                                        <td className="p-3 font-semibold">${(Number(user.balance) || 0).toFixed(2)}</td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <button 
                                                onClick={() => onViewUser({ id: Number(user.id), email: user.email || '' })} 
                                                className="bg-slate-800 text-white px-3 py-1 rounded text-xs hover:bg-slate-700"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 text-slate-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                }
            </div>
            {!isLoading && totalPages > 1 && (
                <div className="mt-4 flex justify-between items-center text-sm">
                    <span className="text-slate-500">Page {currentPage} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || isLoading} className="px-3 py-1 border rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || isLoading} className="px-3 py-1 border rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;