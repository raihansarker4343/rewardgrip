import React, { useContext } from 'react';
import { AppContext } from '../../App';

const SupportPage: React.FC = () => {
    const { setIsSupportChatModalOpen, isLoggedIn } = useContext(AppContext);

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#1e293b] p-8 rounded-xl border border-slate-200 dark:border-slate-800">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Contact Support</h1>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800/50">
                        <h3 className="font-bold text-lg text-blue-700 dark:text-blue-400 mb-2">
                            <i className="fas fa-comments mr-2"></i> Live Chat
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                            Get instant answers from our AI assistant or connect with a human agent.
                        </p>
                        <button 
                            onClick={() => setIsSupportChatModalOpen(true)}
                            disabled={!isLoggedIn}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            {isLoggedIn ? 'Start Chat' : 'Login to Chat'}
                        </button>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-lg text-slate-700 dark:text-slate-300 mb-2">
                            <i className="fas fa-envelope mr-2"></i> Email Support
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                            For complex inquiries, send us an email. We typically respond within 24 hours.
                        </p>
                        <a href="mailto:support@rewardgrip.com" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">support@rewardgrip.com</a>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="font-bold text-slate-900 dark:text-white">Support Hours</h3>
                    <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                            <span>Monday - Friday</span>
                            <span className="font-semibold">24 Hours</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                            <span>Saturday</span>
                            <span className="font-semibold">9:00 AM - 5:00 PM EST</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                            <span>Sunday</span>
                            <span className="font-semibold">Limited Support</span>
                        </li>
                    </ul>
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800/30 text-sm text-yellow-800 dark:text-yellow-200">
                        <i className="fas fa-info-circle mr-2"></i>
                        Please allow up to 48 hours for responses during holidays.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;