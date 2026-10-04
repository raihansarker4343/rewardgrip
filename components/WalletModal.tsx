import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { API_URL } from '../constants';
import type { Transaction, PaymentMethod } from '../types';
import { dataService } from '../services/dataService';
import { safeResponseJson } from '../utils/safeFetch';
import { supabase } from '../lib/supabase';
import SkeletonLoader from './SkeletonLoader';
import StatusBadge from './StatusBadge';
import BlockedWithdrawModal from './BlockedWithdrawModal';

const WithdrawalConfirmation: React.FC<{
  details: { cryptoName: string; address: string; amount: string };
  onConfirm: () => void;
  onBack: () => void;
}> = ({ details, onConfirm, onBack }) => {
  const amount = parseFloat(details.amount) || 0;
  const fee = amount * 0;
  const totalDeducted = amount + fee;

  return (
    <div className="text-slate-700 dark:text-slate-300 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white text-center">
        Confirm Withdrawal
      </h2>
      <div className="bg-slate-50 dark:bg-[#0f1523] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-sm shadow-inner">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Withdrawal Amount</span>
          <span className="font-bold text-lg text-slate-900 dark:text-white">
            ${(Number(amount) || 0).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Network Fee
          </span>
          <span className="font-semibold text-green-500">
            {fee === 0 ? 'Free' : `$${(Number(fee) || 0).toFixed(2)}`}
          </span>
        </div>
        <div className="h-px bg-slate-200 dark:bg-slate-700/50 my-2"></div>
        <div className="flex justify-between items-center text-base">
          <span className="font-bold text-slate-900 dark:text-white">
            Total Deducted
          </span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            ${(Number(totalDeducted) || 0).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Destination Address ({details.cryptoName})
        </p>
        <div className="bg-slate-100 dark:bg-[#0f1523] p-4 rounded-xl border border-slate-200 dark:border-slate-800 break-all font-mono text-xs text-slate-600 dark:text-slate-300 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-wallet"></i>
            </div>
            {details.address}
        </div>
        <div className="flex items-start gap-2 bg-yellow-500/10 p-3 rounded-lg text-yellow-600 dark:text-yellow-500 text-xs">
            <i className="fas fa-exclamation-triangle mt-0.5"></i>
            <p>Please double-check the address. Blockchain transactions are irreversible and cannot be canceled once sent.</p>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 px-4 bg-transparent border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold transition-colors"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/25 transition-transform active:scale-95"
        >
          Confirm & Withdraw
        </button>
      </div>
    </div>
  );
};

const WithdrawalForm: React.FC<{
  cryptoName: string;
  onBack: () => void;
  onProceed: (address: string, amount: string) => void;
}> = ({ cryptoName, onBack, onProceed }) => {
  const { balance } = useContext(AppContext);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleCreateWithdrawal = () => {
    const withdrawalAmount = parseFloat(amount);
    if (!address.trim()) {
      alert('Please enter a wallet address.');
      return;
    }
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }
    if (withdrawalAmount > balance) {
      alert('Insufficient funds.');
      return;
    }
    onProceed(address, amount);
  };

  return (
    <div className="text-slate-700 dark:text-slate-300 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <i className="fas fa-arrow-left text-lg"></i>
        </button>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Withdraw {cryptoName}
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="wallet-address"
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1"
          >
            Wallet Address
          </label>
          <div className="relative group">
            <input
              type="text"
              id="wallet-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={`Enter your ${cryptoName} Address`}
              className="w-full bg-slate-50 dark:bg-[#0f1523] border border-slate-200 dark:border-slate-700/60 rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 group-focus-within:text-blue-500">
               <i className="fas fa-wallet"></i>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2 ml-1">
            <label
                htmlFor="amount"
                className="block text-sm font-bold text-slate-700 dark:text-slate-300"
            >
                Amount (USD)
            </label>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Available: <span className="text-green-500 font-bold">${(Number(balance) || 0).toFixed(2)}</span></span>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-slate-400 font-bold">$</span>
            </div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-50 dark:bg-[#0f1523] border border-slate-200 dark:border-slate-700/60 rounded-xl pl-8 pr-24 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-bold text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => setAmount((Number(balance) || 0).toFixed(2))}
              className="absolute right-2 top-2 bottom-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold px-4 rounded-lg text-xs uppercase tracking-wide transition-colors"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <button
          onClick={handleCreateWithdrawal}
          disabled={!address || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
        >
          Review Withdrawal
        </button>
      </div>
    </div>
  );
};

const TransactionHistory: React.FC = () => {
  const { transactions } = useContext(AppContext);

  return (
    <div className="overflow-x-auto -mx-6">
      {transactions.length > 0 ? (
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-[#0f1523] border-y border-slate-200 dark:border-slate-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 font-semibold tracking-wider">Method</th>
              <th scope="col" className="px-6 py-3 font-semibold tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 font-semibold tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 font-semibold tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="hover:bg-slate-50 dark:hover:bg-[#1a2333] transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm ${
                        tx.type === 'Withdrawal'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      }`}
                    >
                      <i
                        className={`fas ${
                          tx.type === 'Withdrawal'
                            ? 'fa-arrow-up'
                            : 'fa-arrow-down'
                        }`}
                      ></i>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {tx.type}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">{tx.method}</td>
                <td
                  className={`px-6 py-4 font-bold whitespace-nowrap ${
                    tx.type === 'Withdrawal'
                      ? 'text-slate-900 dark:text-white'
                      : 'text-green-500 dark:text-green-400'
                  }`}
                >
                  ${(Number(tx.amount) || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={tx.status} />
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-500 whitespace-nowrap">
                  {new Date(tx.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-[#1e293b] rounded-full flex items-center justify-center mb-4">
             <i className="fas fa-history text-2xl text-slate-400 dark:text-slate-500"></i>
          </div>
          <h3 className="text-slate-900 dark:text-white font-semibold mb-1">No transactions yet</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Your withdrawal history will appear here.</p>
        </div>
      )}
    </div>
  );
};

const WalletModal: React.FC = () => {
  const {
    isWalletModalOpen,
    setIsWalletModalOpen,
    balance,
    setBalance,
    setTransactions,
    setIsWithdrawSuccessModalOpen,
    user,
    setUser,
  } = useContext(AppContext);

  // banned কিনা চেক
  const isBanned =
    user && ((user as any).isBanned || (user as any).is_banned);

  const [activeTab, setActiveTab] = useState<'withdraw' | 'history'>(
    'withdraw'
  );
  const [withdrawalStep, setWithdrawalStep] = useState<
    'select' | 'form' | 'confirm'
  >('select');
  const [withdrawalDetails, setWithdrawalDetails] = useState({
    cryptoName: '',
    address: '',
    amount: '0',
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoadingMethods, setIsLoadingMethods] = useState(true);
  const [errorMethods, setErrorMethods] = useState<string | null>(null);

  const [showBlockedModal, setShowBlockedModal] = useState(false);

  useEffect(() => {
    if (isWalletModalOpen) {
      const fetchMethods = async () => {
        setIsLoadingMethods(true);
        setErrorMethods(null);
        try {
          const data = await dataService.getPaymentMethods();
          setPaymentMethods(data);
        } catch (error: any) {
          setErrorMethods(error.message);
        } finally {
          setIsLoadingMethods(false);
        }
      };
      fetchMethods();
    }
  }, [isWalletModalOpen]);

  const closeModal = () => {
    setIsWalletModalOpen(false);
    setTimeout(() => {
      setActiveTab('withdraw');
      setWithdrawalStep('select');
    }, 300);
  };

  const handleSelectCrypto = (cryptoName: string) => {
    if (isBanned) {
      setShowBlockedModal(true);
      return;
    }
    setWithdrawalDetails((prev) => ({ ...prev, cryptoName }));
    setWithdrawalStep('form');
  };

  const handleProceedToConfirm = (address: string, amount: string) => {
    setWithdrawalDetails((prev) => ({ ...prev, address, amount }));
    setWithdrawalStep('confirm');
  };

  const handleConfirmWithdrawal = async () => {
    if (isBanned) {
      setShowBlockedModal(true);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in.');
      return;
    }

    const withdrawalAmount = parseFloat(withdrawalDetails.amount);

    if (withdrawalAmount > balance) {
      alert('Insufficient funds.');
      return;
    }

    const txId = `WDR_${Date.now()}`;
    const newTransactionPayload = {
      id: txId,
      type: 'Withdrawal',
      method: withdrawalDetails.cryptoName,
      amount: withdrawalAmount,
      status: 'Pending',
    };

    try {
      let isProcessed = false;

      // 1. Try Backend API
      if (API_URL && API_URL.trim() !== '') {
        try {
          const response = await fetch(`${API_URL}/api/transactions/withdraw`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newTransactionPayload),
          });

          if (response.status === 403) {
            setShowBlockedModal(true);
            return;
          }

          if (response.ok) {
            isProcessed = true;
          }
        } catch (_) {}
      }

      // 2. Direct Supabase DB update
      if (!isProcessed && supabase && user?.id) {
        try {
          const newBal = Math.max(0, Number(((Number(balance) || 0) - withdrawalAmount).toFixed(2)));
          const newTotalWithdrawn = Number(((Number(user.totalWithdrawn) || 0) + withdrawalAmount).toFixed(2));

          await supabase
            .from('users')
            .update({
              balance: newBal,
              total_withdrawn: newTotalWithdrawn,
            })
            .eq('id', user.id);

          await supabase
            .from('transactions')
            .insert({
              id: txId,
              user_id: user.id,
              type: 'withdrawal',
              method: withdrawalDetails.cryptoName,
              amount: withdrawalAmount,
              status: 'pending',
              date: new Date().toISOString(),
              source: `Crypto Cashout (${withdrawalDetails.address.substring(0, 10)}...)`
            });

          isProcessed = true;
        } catch (sbErr) {
          console.error('[WalletModal] Supabase withdrawal notice:', sbErr);
        }
      }

      const parsedTransaction: Transaction = {
        id: txId,
        type: 'Withdrawal',
        amount: withdrawalAmount,
        description: `${newTransactionPayload.method} Withdrawal (${withdrawalDetails.address.substring(0, 10)}...)`,
        date: new Date().toISOString(),
        status: 'Pending',
      };

      setTransactions((prev) => [parsedTransaction, ...prev]);
      setBalance((prev) => Math.max(0, prev - withdrawalAmount));
      if (setUser) {
        setUser((prev: any) => prev ? {
          ...prev,
          balance: Math.max(0, (Number(prev.balance) || 0) - withdrawalAmount),
          totalWithdrawn: ((Number(prev.totalWithdrawn) || 0) + withdrawalAmount)
        } : prev);
      }

      closeModal();
      setIsWithdrawSuccessModalOpen(true);
    } catch (error: any) {
      console.error('Withdrawal failed:', error);
      alert(`Error: ${error.message}`);
    }
  };

  if (!isWalletModalOpen) return null;

  const renderWithdrawContent = () => {
    switch (withdrawalStep) {
      case 'confirm':
        return (
          <WithdrawalConfirmation
            details={withdrawalDetails}
            onConfirm={handleConfirmWithdrawal}
            onBack={() => setWithdrawalStep('form')}
          />
        );
      case 'form':
        return (
          <WithdrawalForm
            cryptoName={withdrawalDetails.cryptoName}
            onBack={() => setWithdrawalStep('select')}
            onProceed={handleProceedToConfirm}
          />
        );
      case 'select':
      default:
        if (isLoadingMethods) {
          return (
            <div className="space-y-6 p-2">
              <SkeletonLoader className="h-8 w-32 rounded-lg" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <SkeletonLoader className="h-20 w-full rounded-xl" />
                 <SkeletonLoader className="h-20 w-full rounded-xl" />
              </div>
              <SkeletonLoader className="h-8 w-32 rounded-lg mt-4" />
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <SkeletonLoader key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            </div>
          );
        }
        if (errorMethods) {
          return (
            <div className="text-center py-12">
                <i className="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                <p className="text-red-500 mb-4">{errorMethods}</p>
                <button onClick={closeModal} className="text-slate-500 hover:underline">Close</button>
            </div>
          );
        }

        const groupedMethods = paymentMethods.reduce((acc, method) => {
          acc[method.type] = [...(acc[method.type] || []), method];
          return acc;
        }, {} as { [key: string]: PaymentMethod[] });

        return (
          <div className="space-y-8 animate-fade-in">
            {groupedMethods.special && (
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 pl-1">
                  <i className="fas fa-star text-yellow-500"></i> Featured Methods
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groupedMethods.special.map((method) => (
                    <button
                        key={method.id}
                        className="group relative w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#263345] transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 hover:border-green-500/40 overflow-hidden"
                    >
                        {/* Gradient Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        
                        <div className="relative flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-[#0f1523] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                                {method.iconClass && method.iconClass.startsWith('http') ? (
                                <img
                                    src={method.iconClass}
                                    alt={method.name}
                                    className="w-7 h-7 object-contain"
                                />
                                ) : (
                                <i
                                    className={`${method.iconClass || 'fas fa-coins'} text-green-500 text-2xl`}
                                ></i>
                                )}
                            </div>
                            <span className="font-bold text-lg text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{method.name}</span>
                        </div>
                        {method.specialBonus && (
                            <span className="relative z-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md shadow-green-500/20">
                            {method.specialBonus}
                            </span>
                        )}
                    </button>
                    ))}
                </div>
              </div>
            )}
            
            {groupedMethods.cash && (
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 pl-1">
                  <i className="fas fa-money-bill-wave text-green-500"></i> Cash & Gift Cards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groupedMethods.cash.map((method) => (
                    <button
                        key={method.id}
                        className="group relative w-full flex items-center p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#263345] transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/40 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        
                        <div className="relative w-12 h-12 rounded-lg bg-slate-100 dark:bg-[#0f1523] flex items-center justify-center shadow-inner mr-4 group-hover:scale-105 transition-transform duration-300">
                            {method.iconClass && method.iconClass.startsWith('http') ? (
                            <img
                                src={method.iconClass}
                                alt={method.name}
                                className="w-7 h-7 object-contain"
                            />
                            ) : (
                            <i
                                className={`${method.iconClass || 'fas fa-money-bill'} text-blue-500 text-2xl`}
                            ></i>
                            )}
                        </div>
                        <span className="relative font-bold text-lg text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{method.name}</span>
                    </button>
                    ))}
                </div>
              </div>
            )}

            {groupedMethods.crypto && (
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 pl-1">
                  <i className="fab fa-bitcoin text-orange-500"></i> Crypto Withdrawals
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {groupedMethods.crypto.map((crypto) => (
                    <button
                      key={crypto.id}
                      onClick={() => handleSelectCrypto(crypto.name)}
                      className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#263345] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/40 overflow-hidden"
                    >
                      {/* Gradient Hover BG */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      
                      <div className="relative z-10 w-12 h-12 rounded-full bg-slate-100 dark:bg-[#0f1523] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                        {crypto.iconClass && crypto.iconClass.startsWith('http') ? (
                          <img
                            src={crypto.iconClass}
                            alt={crypto.name}
                            className="w-7 h-7 object-contain"
                          />
                        ) : (
                          <i
                            className={`${crypto.iconClass || 'fab fa-bitcoin'} text-2xl text-blue-500 dark:text-blue-400`}
                          ></i>
                        )}
                      </div>
                      <span className="relative z-10 block text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors uppercase tracking-wide text-center">
                        {crypto.name}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <button className="text-sm font-semibold text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2 mx-auto">
                    View all methods <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
      >
        <div
          className="relative w-full max-w-2xl bg-white dark:bg-[#141c2f] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800 m-4 sm:m-auto"
          onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141c2f] z-10">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab('withdraw')}
                  className={`pb-1 text-lg font-bold transition-colors border-b-2 ${
                    activeTab === 'withdraw'
                      ? 'text-slate-900 dark:text-white border-blue-500'
                      : 'text-slate-400 dark:text-slate-500 border-transparent hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  Withdraw
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`pb-1 text-lg font-bold transition-colors border-b-2 ${
                    activeTab === 'history'
                      ? 'text-slate-900 dark:text-white border-blue-500'
                      : 'text-slate-400 dark:text-slate-500 border-transparent hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  History
                </button>
              </div>
              <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-end mr-2">
                      <span className="text-xs text-slate-500 font-semibold uppercase">Balance</span>
                      <span className="text-green-500 font-bold">${(Number(balance) || 0).toFixed(2)}</span>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
                  >
                    <i className="fas fa-times"></i>
                  </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                {activeTab === 'withdraw'
                ? renderWithdrawContent()
                : <TransactionHistory />}
            </div>
        </div>
      </div>

      <BlockedWithdrawModal
        isOpen={showBlockedModal}
        onClose={() => setShowBlockedModal(false)}
      />
    </>
  );
};

export default WalletModal;