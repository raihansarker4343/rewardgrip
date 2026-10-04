import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../../App';
import { SURVEY_PROVIDERS } from '../../../constants';

const BITLABS_APP_TOKEN = import.meta.env.VITE_BITLABS_APP_TOKEN || 'a92e1069-7988-4db8-b570-5b651034fe27';

const BitLabsSurveysPage: React.FC = () => {
    const { user, isLoggedIn } = useContext(AppContext);
    const provider = SURVEY_PROVIDERS.find(p => p.name === 'BitLabs');

    const iframeSrc = useMemo(() => {
        if (!isLoggedIn || !user) return '';
        const extUserId = user.earnId || user.earn_id || String(user.id);
        return `https://web.bitlabs.ai/?token=${BITLABS_APP_TOKEN}&uid=${encodeURIComponent(String(extUserId))}`;
    }, [isLoggedIn, user]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {provider && provider.logo && <img src={provider.logo} alt={`${provider.name} logo`} className="h-10 object-contain bg-slate-200 dark:bg-slate-800 p-1 rounded-md" />}
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">BitLabs Surveys</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Complete surveys and get credited automatically</p>
                    </div>
                </div>
                {isLoggedIn && iframeSrc && (
                    <a
                        href={iframeSrc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                    >
                        <span>Open in New Tab</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                )}
            </div>

            <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center">
                {!isLoggedIn || !iframeSrc ? (
                    <div className="text-center py-16 space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Please Log In</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm">Sign in to start earning with BitLabs surveys.</p>
                    </div>
                ) : (
                    <iframe
                        title="BitLabs Surveys"
                        src={iframeSrc}
                        width="100%"
                        height="900"
                        scrolling="auto"
                        style={{ border: 0 }}
                        className="rounded-xl w-full min-h-[800px]"
                        allow="clipboard-read; clipboard-write; fullscreen"
                        sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin"
                    />
                )}
            </div>
        </div>
    );
};

export default BitLabsSurveysPage;
