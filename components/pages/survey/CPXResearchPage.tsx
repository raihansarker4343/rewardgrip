import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../../App';
import { SURVEY_PROVIDERS } from '../../../constants';

const CPX_APP_ID = import.meta.env.VITE_CPX_APP_ID || '32220';

const CPXResearchPage: React.FC = () => {
  const { user, isLoggedIn } = useContext(AppContext);
  const provider = SURVEY_PROVIDERS.find((p) => p.name === 'CPX Research');

  const iframeSrc = useMemo(() => {
    if (!isLoggedIn || !user?.id) return '';
    const extUserId = user.earnId || user.earn_id || String(user.id);
    return `https://offers.cpx-research.com/index.php?app_id=${CPX_APP_ID}&ext_user_id=${encodeURIComponent(
      String(extUserId)
    )}`;
  }, [isLoggedIn, user]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {provider && provider.logo && (
            <img
              src={provider.logo}
              alt={`${provider.name} logo`}
              className="h-10 object-contain bg-slate-200 dark:bg-slate-800 p-1 rounded-md"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              CPX Research
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Complete surveys and get credited with Coins automatically
            </p>
          </div>
        </div>

        {isLoggedIn && iframeSrc && (
          <a
            href={iframeSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <span>Open in New Tab</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </div>

      <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center">
        {!isLoggedIn || !iframeSrc ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Please Log In
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
              Sign in or create an account to start earning with CPX Research surveys.
            </p>
          </div>
        ) : (
          <iframe
            title="CPX Research Surveys"
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

export default CPXResearchPage;
