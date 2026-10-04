import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import type { Transaction } from '../../types';
import { API_URL } from '../../constants';
import StatusBadge from '../StatusBadge';

interface WithdrawalsPageProps {
    onViewUser: (user: { id: number; email: string }) => void;
}

const WithdrawalsPage: React.FC<WithdrawalsPageProps> = ({ onViewUser }) => {
    const { setTransactions: setGlobalTransactions } = useContext(AppContext);
    const [withdrawalRequests, setWithdrawalRequests] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchData = async (page = 1) => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Authentication token not found.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/admin/transactions?page=${page}`, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });

            if (!response.ok) throw new Error("Failed to fetch withdrawal requests.");
            
            const data = await response.json();
            const transactions: Transaction[] = data.transactions;
            
            setWithdrawalRequests(transactions.map(tx => ({...tx, amount: Number(tx.amount)})));
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

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
            
            return parsedUpdatedTx;
        } catch (error: any) {
            alert(`Error: ${error.message}`);
            return null;
        }
    };
    
    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleApprove = async (txId: string) => {
        await updateTransactionStatus(txId, 'Completed');
    };

    const handleReject = async (txId: string) => {
        await updateTransactionStatus(txId, 'Rejected');
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-4 text-slate-800">All Withdrawal Requests</h3>
            <div className="overflow-x-auto">
                {isLoading ? <p>Loading requests...</p> : error ? <p className="text-red-500">{error}</p> :
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-slate-500">
                            <th className="p-2">Transaction ID</th>
                            <th className="p-2">User Email</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Method</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700">
                        {withdrawalRequests.length > 0 ? (
                            withdrawalRequests.map(tx => (
                                <tr key={tx.id} className="border-t border-slate-200">
                                    <td className="p-2 font-medium">{tx.id}</td>
                                    <td className="p-2">
                                        <button 
                                            onClick={() => tx.email && onViewUser({ id: tx.userId, email: tx.email })} 
                                            className="text-blue-600 hover:underline"
                                            disabled={!tx.email}
                                        >
                                            {tx.email}
                                        </button>
                                    </td>
                                    <td className="p-2">{new Date(tx.date).toLocaleDateString()}</td>
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
                                    No withdrawal requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                }
            </div>
            <div className="mt-4 flex justify-between items-center text-sm">
                <span className="text-slate-500">Page {currentPage} of {totalPages}</span>
                <div className="flex gap-2">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || isLoading} className="px-3 py-1 border rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || isLoading} className="px-3 py-1 border rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                </div>
            </div>
        </div>
    );
};

export default WithdrawalsPage;