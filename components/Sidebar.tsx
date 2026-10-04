import React, { useContext } from 'react';
import { AppContext } from '../App';
import type { SidebarMenuItem } from '../types';
import { HomeIcon, EarnIcon, SurveyIcon, AffiliateIcon, BlogIcon, GuideIcon, SupportIcon, LeaderboardIcon, DailyBonusIcon, ChatIcon } from './icons/SidebarIcons';

const SIDEBAR_MENU_ITEMS_TOP: SidebarMenuItem[] = [
  { name: 'Home', icon: <HomeIcon /> },
  { name: 'Offer', icon: <EarnIcon /> },
  { name: 'Surveys', icon: <SurveyIcon /> },
];

const SIDEBAR_MENU_ITEMS_COMMUNITY: SidebarMenuItem[] = [
  { name: 'Leaderboard', icon: <LeaderboardIcon /> },
  { name: 'Daily Bonus', icon: <DailyBonusIcon />, isSpecial: true },
  { name: 'Live Chat', icon: <ChatIcon />, action: 'openLiveChat' },
];

const SIDEBAR_MENU_ITEMS_BOTTOM: SidebarMenuItem[] = [
  { name: 'Referrals', icon: <AffiliateIcon /> },
  { name: 'Blog', icon: <BlogIcon /> },
  { name: 'Guides', icon: <GuideIcon /> },
  { name: 'Live Support', icon: <SupportIcon />, action: 'openSupportChat' },
];

const Sidebar: React.FC = () => {
    const { currentPage, setCurrentPage, isSidebarCollapsed, setIsSidebarCollapsed, isMobileSidebarOpen, setIsMobileSidebarOpen, setIsSupportChatModalOpen, setIsLiveChatModalOpen } = useContext(AppContext);

    const handleClose = () => {
        setIsSidebarCollapsed(true);
        setIsMobileSidebarOpen(false);
    };
    
    const handleLinkClick = (pageName: string, action?: string) => {
        if (action === 'openLiveChat') {
            if (typeof setIsLiveChatModalOpen === 'function') {
                setIsLiveChatModalOpen(true);
            }
        } else if (action === 'openSupportChat') {
            setIsSupportChatModalOpen(true);
        } else {
            setCurrentPage(pageName);
        }
        setIsMobileSidebarOpen(false);
    };


    const renderMenuItem = (item: SidebarMenuItem) => {
    const isActive = currentPage === item.name;
    const baseClasses = `w-full group flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl transition-all duration-300 font-medium border relative overflow-hidden`;

    let stateClasses = '';
    let iconClasses = '';

    if (item.isSpecial) {
        // Special Gold/Amber Glass
        stateClasses = 'text-amber-400 bg-amber-500/10 border-amber-500/25 hover:bg-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] backdrop-blur-sm';
        iconClasses = 'text-amber-400 bg-amber-500/20 border border-amber-500/30';
    } else if (isActive) {
        // Active Emerald Theme
        stateClasses = 'text-white bg-gradient-to-r from-emerald-500/15 via-[#1a1f2e] to-[#1a1f2e] border-emerald-500/30 shadow-md shadow-emerald-500/10 font-semibold';
        iconClasses = 'bg-gradient-to-br from-[#00D26A] to-emerald-600 text-white shadow-md shadow-emerald-500/30 scale-105';
    } else {
        // Default Inactive
        stateClasses = 'text-slate-400 border-transparent hover:text-white hover:bg-white/[0.04] hover:border-white/10 hover:translate-x-1';
        iconClasses = 'text-slate-400 group-hover:text-emerald-400 bg-white/[0.04] group-hover:bg-emerald-500/10 border border-white/5 group-hover:border-emerald-500/20 group-hover:scale-105';
    }

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
                    <span className={`relative flex h-8.5 w-8.5 items-center justify-center rounded-lg transition-all duration-300 ${iconClasses}`}>
                        {item.icon}
                    </span>
                    <span className="tracking-tight text-sm">{item.name}</span>
                </div>

                <div className="flex items-center gap-1.5 relative z-10">
                    {item.isHot && (
                        <span className="text-[10px] uppercase font-extrabold bg-gradient-to-r from-rose-500 to-pink-600 text-white px-2 py-0.5 rounded-full shadow-md shadow-rose-500/25">
                            Hot
                        </span>
                    )}
                    {(item.action === 'openSupportChat' || item.action === 'openLiveChat') && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full shadow-sm">
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
          className={`fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300 ease-out ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
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

  bg-white/70 dark:bg-[#0f1729]/80
  backdrop-blur-2xl
  border-r border-white/20 dark:border-white/5
  shadow-[10px_0_40px_-10px_rgba(0,0,0,0.05)]
`}>



        
        {/* Ambient Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] right-[-30%] w-[80%] h-[40%] bg-blue-500/10 rounded-full blur-[80px] opacity-70"></div>
            <div className="absolute bottom-[10%] left-[-20%] w-[70%] h-[50%] bg-purple-500/10 rounded-full blur-[90px] opacity-60"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200/50 dark:scrollbar-thumb-slate-700/50">
            {/* Header */}
            <div className="flex items-center justify-end mb-6">
                <button 
                    onClick={handleClose} 
                    className="p-2 rounded-xl bg-white/40 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10 transition-all border border-transparent hover:border-white/20 dark:hover:border-white/5 backdrop-blur-sm"
                    aria-label="Close sidebar"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            {/* Menu Sections */}
            <nav className="flex-1 flex flex-col space-y-6">
                <div>
                    <div className="flex items-center gap-2 px-3 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#00D26A]" />
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-[0.18em]">Explore</p>
                    </div>
                    <ul className="space-y-1.5">
                        {SIDEBAR_MENU_ITEMS_TOP.map(renderMenuItem)}
                    </ul>
                </div>
                
                <div>
                    <div className="flex items-center gap-2 px-3 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#A855F7]" />
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-[0.18em]">Community</p>
                    </div>
                    <ul className="space-y-1.5">
                        {SIDEBAR_MENU_ITEMS_COMMUNITY.map(renderMenuItem)}
                    </ul>
                </div>

                <div>
                    <div className="flex items-center gap-2 px-3 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38BDF8]" />
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-[0.18em]">Support & More</p>
                    </div>
                    <ul className="space-y-1.5">
                        {SIDEBAR_MENU_ITEMS_BOTTOM.map(renderMenuItem)}
                    </ul>
                </div>
            </nav>

            {/* Footer / Copyright */}
            <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-white/5 text-center">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    © 2026 RewardGrip
                </p>
            </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
