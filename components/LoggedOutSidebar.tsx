import React, { useContext } from 'react';
import { AppContext } from '../App';
import type { SidebarMenuItem } from '../types';
import { HomeIcon, BlogIcon, GuideIcon, SupportIcon, ChatIcon } from './icons/SidebarIcons';
import BrandLogo from './BrandLogo';

const SIDEBAR_MENU_ITEMS: SidebarMenuItem[] = [
  { name: 'Home', icon: <HomeIcon /> },
  { name: 'Blog', icon: <BlogIcon /> },
  { name: 'Guides', icon: <GuideIcon /> },
  { name: 'Live Chat', icon: <ChatIcon />, action: 'openLiveChat' },
];

const LoggedOutSidebar: React.FC = () => {
    const {
      currentPage,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      isMobileSidebarOpen,
      setIsMobileSidebarOpen,
      setCurrentPage,
      setIsSupportChatModalOpen,
      setIsLiveChatModalOpen,
      openSignupModal,
    } = useContext(AppContext);

    const handleClose = () => {
        setIsSidebarCollapsed(true);
        setIsMobileSidebarOpen(false);
    };

    const handleLinkClick = (pageName?: string, action?: string) => {
        if (action === 'openLiveChat' || action === 'openSupportChat') {
            if (typeof setIsLiveChatModalOpen === 'function') {
                setIsLiveChatModalOpen(true);
            } else if (typeof setIsSupportChatModalOpen === 'function') {
                setIsSupportChatModalOpen(true);
            }
        } else if (pageName) {
            if (typeof setCurrentPage === 'function') {
                setCurrentPage(pageName);
            } else {
                const path = pageName === 'Home' ? '/' : `/${pageName.replace(/[^a-zA-Z0-9]/g, '')}`;
                if (window.location.pathname !== path) {
                    const { search } = window.location;
                    window.history.pushState({}, '', path + search);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                }
            }
        }
        setIsMobileSidebarOpen(false);
    };

  const isPublicHomepage = currentPage === 'Home';
  
  const renderMenuItem = (item: SidebarMenuItem) => {
        const isActive = currentPage === item.name;
        
        // Base container styles
        const baseClasses = `group relative w-full flex items-center justify-between text-left px-3.5 py-3 rounded-xl transition-all duration-300 font-medium border overflow-hidden`;
        
        // Active vs Inactive state styles (Premium Dark / Emerald Theme)
        const stateClasses = isActive
            ? 'bg-gradient-to-r from-emerald-500/15 via-[#1a1f2e] to-[#1a1f2e] text-white border-emerald-500/30 shadow-lg shadow-emerald-500/10 font-semibold'
            : 'text-slate-400 border-transparent hover:bg-white/[0.04] hover:text-white hover:border-white/10 hover:translate-x-1';

        // Icon container styles
        const iconBase = `relative grid place-items-center w-9 h-9 rounded-lg transition-all duration-300`;
        const iconActive = `bg-gradient-to-br from-[#00D26A] to-emerald-600 text-white shadow-md shadow-emerald-500/30 scale-105`;
        const iconInactive = `bg-white/[0.04] text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 border border-white/5 group-hover:scale-105`;

        return (
            <li key={item.name}>
                <button
                    onClick={() => handleLinkClick(item.name, item.action)}
                    className={`${baseClasses} ${stateClasses}`}
                >
                    {/* Active Left Indicator Bar */}
                    {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-[#00D26A] to-emerald-400 rounded-r-full shadow-[0_0_10px_#00D26A]" />
                    )}

                    <div className="flex items-center space-x-3 relative z-10">
                        <span className={`${iconBase} ${isActive ? iconActive : iconInactive}`}>
                            {item.icon}
                        </span>
                        <span className="relative z-10 text-sm font-semibold tracking-wide">
                            {item.name}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 relative z-10">
                        {(item.action === 'openLiveChat' || item.action === 'openSupportChat') && (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                Live
                            </span>
                        )}
                        <i className={`fas fa-chevron-right text-[10px] transition-all duration-200 ${isActive ? 'text-emerald-400' : 'text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 opacity-0 group-hover:opacity-100'}`} />
                    </div>
                </button>
            </li>
        );
    };

  return (
    <>
        {/* Mobile Overlay */}
        <div 
            className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-500 ease-out ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${isPublicHomepage ? 'bg-black/60' : 'bg-slate-900/30 backdrop-blur-md'}`}
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
        ></div>

        <aside className={`
  fixed top-0 left-0 inset-y-0 z-50
  lg:sticky lg:top-0
  h-[100dvh] lg:h-screen

  flex flex-col overflow-hidden transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)

  lg:w-72 ${isSidebarCollapsed ? 'lg:w-0 lg:p-0' : ''}
  ${isMobileSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 lg:translate-x-0'}

  ${isPublicHomepage
    ? 'bg-[#141826] border-r border-white/10'
    : 'bg-white/70 dark:bg-[#0f1729]/80 backdrop-blur-2xl border-r border-white/20 dark:border-white/5 shadow-[10px_0_40px_-10px_rgba(0,0,0,0.05)]'}
`}>

            <div className="p-6 flex flex-col flex-1 min-w-[18rem] h-full overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-slate-200/50 dark:scrollbar-thumb-slate-700/50">
                
                {/* Sidebar Header */}
                <div className="flex items-center justify-end mb-6">
                    <button 
                        onClick={handleClose} 
                        className="p-2 rounded-xl bg-white/40 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/10 transition-all border border-white/40 dark:border-white/5 backdrop-blur-sm shadow-sm"
                        aria-label="Close sidebar"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                

                {/* Navigation Menu */}
                <nav className="flex-1 flex flex-col space-y-6">
                    <div>
                        <div className="flex items-center justify-between px-3 mb-3">
                            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#00D26A]" />
                                Navigation
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-slate-500 border border-white/5">
                                Main
                            </span>
                        </div>
                        <ul className="space-y-1.5">
                            {SIDEBAR_MENU_ITEMS.map(renderMenuItem)}
                        </ul>
                    </div>

                    {/* Premium Earn Teaser Card */}
                    <div className="relative rounded-2xl p-4 border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 via-[#1a1f2e] to-[#141826] overflow-hidden group shadow-xl shadow-black/20">
                        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
                                <i className="fas fa-bolt text-[9px]" /> Instant Payouts
                            </div>
                            <h4 className="text-sm font-extrabold text-white mb-1">
                                Start Earning Today
                            </h4>
                            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                                Complete offers, play games & cash out within minutes.
                            </p>
                            <button
                                onClick={() => openSignupModal()}
                                className="w-full py-2.5 px-3 bg-gradient-to-r from-[#00D26A] to-emerald-600 hover:from-[#00b85c] hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-1.5 group-hover:scale-[1.02] active:scale-95"
                            >
                                <span>Sign Up Free</span>
                                <i className="fas fa-arrow-right text-[10px] transition-transform group-hover:translate-x-0.5" />
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Footer */}
                <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-white/5">
                    <div className="flex items-center justify-center gap-4 opacity-50 hover:opacity-100 transition-opacity duration-300">
                        <i className="fab fa-discord text-slate-600 dark:text-slate-400 hover:text-indigo-500 cursor-pointer text-lg"></i>
                        <i className="fab fa-twitter text-slate-600 dark:text-slate-400 hover:text-sky-500 cursor-pointer text-lg"></i>
                        <i className="fab fa-instagram text-slate-600 dark:text-slate-400 hover:text-pink-500 cursor-pointer text-lg"></i>
                    </div>
                    <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 font-medium mt-3">
                        © 2026 RewardGrip Inc.
                    </p>
                </div>
            </div>
        </aside>
    </>
  );
};

export default LoggedOutSidebar;
