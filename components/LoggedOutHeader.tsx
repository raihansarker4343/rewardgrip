
import React, { useContext } from 'react';
import { AppContext } from '../App';
import { MenuIcon } from './icons/HeaderIcons';
import { MoonIcon, SunIcon } from './icons/FooterIcons';
import BrandLogo from './BrandLogo';

const LoggedOutHeader: React.FC = () => {
    const { isSidebarCollapsed, setIsSidebarCollapsed, setIsMobileSidebarOpen, theme, setTheme, setIsSigninModalOpen, openSignupModal, setCurrentPage, currentPage } = useContext(AppContext);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <header className="relative bg-[#141826]/95 backdrop-blur-2xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3 z-30 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
            {/* Top ambient highlight bar */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent pointer-events-none" />

            {/* Left section: Logo */}
            <div className="flex items-center gap-3 sm:gap-6">
                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={() => setIsMobileSidebarOpen(true)}
                        className="p-2 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-95 lg:hidden border border-white/10"
                        aria-label="Open menu"
                    >
                        <MenuIcon />
                    </button>
                    {isSidebarCollapsed && (
                        <button 
                            onClick={() => setIsSidebarCollapsed(false)} 
                            className="p-2 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white hidden lg:block transition-all active:scale-95 border border-white/10"
                            aria-label="Open sidebar"
                        >
                            <MenuIcon />
                        </button>
                    )}
                    <BrandLogo onClick={() => setCurrentPage('Home')} />
                </div>
            </div>

            {/* Right section: Theme & Auth Buttons */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-end">
                <button 
                    onClick={toggleTheme}
                    className="text-slate-400 hover:text-yellow-400 p-2 sm:p-2.5 rounded-xl hover:bg-white/10 transition-all active:scale-90 border border-white/5"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </button>

                <button 
                    onClick={() => setIsSigninModalOpen(true)} 
                    className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all active:scale-95 shadow-sm"
                >
                    Sign In
                </button>

                <button 
                    onClick={() => openSignupModal()} 
                    className="bg-gradient-to-r from-[#00D26A] via-emerald-500 to-teal-500 hover:from-[#00b85c] hover:to-teal-600 text-white font-extrabold py-2 sm:py-2.5 px-4 sm:px-5 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5 text-xs sm:text-sm"
                >
                    <span>Sign Up</span>
                    <i className="fas fa-arrow-right text-[10px]" />
                </button>
            </div>
        </header>
    );
};

export default LoggedOutHeader;
