import React, { useContext } from 'react';
import { AppContext } from '../../App';

const HelpDeskPage: React.FC = () => {
    const { setCurrentPage } = useContext(AppContext);

    const categories = [
        { title: 'Account Issues', icon: 'fas fa-user-shield', desc: 'Login problems, verification, and settings.', link: 'Frequently Asked' },
        { title: 'Payments & Rewards', icon: 'fas fa-wallet', desc: 'Withdrawals, missing coins, and reward status.', link: 'Frequently Asked' },
        { title: 'Surveys & Offers', icon: 'fas fa-tasks', desc: 'Troubleshooting completed tasks and chargebacks.', link: 'Frequently Asked' },
        { title: 'Technical Support', icon: 'fas fa-bug', desc: 'Report bugs or site performance issues.', link: 'Support' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center py-10 bg-blue-600 rounded-xl text-white">
                <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
                <div className="max-w-md mx-auto relative">
                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input 
                        type="text" 
                        placeholder="Search for answers..." 
                        className="w-full pl-12 pr-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {categories.map((cat, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentPage(cat.link)}>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center text-xl mb-4">
                            <i className={cat.icon}></i>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{cat.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400">{cat.desc}</p>
                    </div>
                ))}
            </div>

            <div className="bg-slate-100 dark:bg-[#141c2f] p-8 rounded-xl text-center">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Still need help?</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Our support team is available 24/7 to assist you.</p>
                <button 
                    onClick={() => setCurrentPage('Support')}
                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
                >
                    Contact Support
                </button>
            </div>
        </div>
    );
};

export default HelpDeskPage;