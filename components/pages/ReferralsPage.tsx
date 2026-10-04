import React, { useContext, useState } from 'react';
import { AppContext } from '../../App';

const StatCard: React.FC<{ title: string; value: string; icon: string }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg flex items-center gap-4 border border-slate-200 dark:border-slate-800">
        <div className="bg-slate-100 dark:bg-slate-700 text-blue-500 dark:text-blue-400 w-12 h-12 rounded-full flex items-center justify-center">
            <i className={`${icon} text-xl`}></i>
        </div>
        <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{title}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const ReferralsPage: React.FC = () => {
    const { user } = useContext(AppContext);
    const [copyButtonText, setCopyButtonText] = useState('Copy Link');

    if (!user) {
        return <div>Loading...</div>;
    }
    
    const referralLink = `${window.location.origin}${window.location.pathname}#/?ref=${user.username}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy Link'), 2000);
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Referrals</h1>
                <p className="text-slate-500 dark:text-slate-400">Invite your friends and earn rewards when they sign up and complete tasks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Total Referrals" value={(user?.totalReferrals ?? 0).toString()} icon="fas fa-users" />
                <StatCard title="Referral Earnings" value={`$${(Number(user?.referralEarnings) || 0).toFixed(2)}`} icon="fas fa-dollar-sign" />
            </div>

            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Invite your friends</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Share your unique referral link with friends. You'll earn a <span className="font-bold text-green-500 dark:text-green-400">5% commission</span> on their earnings for life!</p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                        type="text"
                        readOnly
                        value={referralLink}
                        className="w-full bg-slate-100 dark:bg-[#141c2f] border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-700 dark:text-slate-300 focus:outline-none"
                    />
                    <button
                        onClick={handleCopyLink}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex-shrink-0"
                    >
                        {copyButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReferralsPage;