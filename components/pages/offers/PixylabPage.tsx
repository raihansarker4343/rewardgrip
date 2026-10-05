import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../../App';
import { OFFER_WALLS } from '../../../constants';

const PIXYLAB_PUB_ID = '574';

const PixylabPage: React.FC = () => {
  const { user, isLoggedIn, openSigninModal } = useContext(AppContext);
  const provider = OFFER_WALLS.find((p) => p.name === 'Pixylab') || {
    name: 'Pixylab',
    bonus: '+30%',
    rating: 5,
    logo: 'https://creatives.skylup.swaarm-clients.com/objects/146/e03421e0-9d27-4f57-9e73-a5b9649fcfec.png',
  };

  const iframeSrc = useMemo(() => {
    const trackingUserId = user?.earnId || (user?.id ? String(user.id) : 'guest');
    return `https://offerwall.pixylabs.co?pid=${PIXYLAB_PUB_ID}&uid=${encodeURIComponent(trackingUserId)}`;
  }, [user]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Top Action Bar (Fullscreen Button) */}
      {iframeSrc && (
        <div className="flex justify-end">
          <a
            href={iframeSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>Fullscreen</span>
            <i className="fas fa-external-link-alt text-[10px]"></i>
          </a>
        </div>
      )}

      {/* Main Official Pixylab Hosted Offerwall Iframe */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {!isLoggedIn || !user ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 mx-auto flex items-center justify-center text-2xl">
              <i className="fas fa-lock"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sign In to Access Pixylab</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Please log in to your account so completed offers and surveys can be automatically credited to your balance.
            </p>
            <button
              onClick={() => openSigninModal && openSigninModal()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
            >
              Sign In Now
            </button>
          </div>
        ) : (
          <div className="w-full relative min-h-[900px] bg-slate-50 dark:bg-slate-950">
            <iframe
              title="Pixylab Offerwall"
              src={iframeSrc}
              width="100%"
              height="950"
              style={{ border: 0, minHeight: '900px' }}
              className="w-full rounded-2xl"
              allow="clipboard-read; clipboard-write; fullscreen"
              sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PixylabPage;
