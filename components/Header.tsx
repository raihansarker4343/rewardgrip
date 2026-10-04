
import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../App';
import { BellIcon, ChevronDownIcon, WalletIcon, LogoutIcon, MenuIcon } from './icons/HeaderIcons';
import { MoonIcon, SunIcon } from './icons/FooterIcons';
import { API_URL } from '../constants';
import BrandLogo from './BrandLogo';

interface HeaderProps {
    onLogout: () => void;
}

function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
        const years = Math.floor(interval);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        const months = Math.floor(interval);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 86400;
    if (interval > 1) {
        const days = Math.floor(interval);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 3600;
    if (interval > 1) {
        const hours = Math.floor(interval);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 60;
    if (interval > 1) {
        const minutes = Math.floor(interval);
        return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    }
    return `${Math.max(0, Math.floor(seconds))} sec ago`;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    const { user, balance, setIsWalletModalOpen, isSidebarCollapsed, setIsSidebarCollapsed, setCurrentPage, setIsMobileSidebarOpen, theme, setTheme, notifications, setNotifications } = useContext(AppContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationsRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleOpenNotifications = async () => {
        const nextState = !isNotificationsOpen;
        setIsNotificationsOpen(nextState);

        if (nextState && unreadCount > 0) {
            const currentNotifications = [...notifications];
            const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
            setNotifications(updatedNotifications);

            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL}/api/notifications/read`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to mark notifications as read');
            } catch (error) {
                console.error("Failed to mark notifications as read", error);
                setNotifications(currentNotifications); // Revert on failure
            }
        }
    };

    if (!user) return null;

  return (
    <header className="bg-white/80 dark:bg-[#141c2f]/80 backdrop-blur-2xl p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 dark:border-white/5 relative z-30 transition-all duration-300">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white lg:hidden transition-all active:scale-95 border border-transparent hover:border-slate-200/50 dark:hover:border-white/10"
                aria-label="Open menu"
            >
                <MenuIcon />
            </button>
            {isSidebarCollapsed && (
                <button 
                    onClick={() => setIsSidebarCollapsed(false)} 
                    className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white hidden lg:block transition-all active:scale-95 border border-transparent hover:border-slate-200/50 dark:hover:border-white/10"
                    aria-label="Open sidebar"
                >
                    <MenuIcon />
                </button>
            )}
            
            <BrandLogo onClick={() => setCurrentPage('Home')} />
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end w-full lg:w-auto">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20 shadow-sm">
                <span>${(Number(balance) || 0).toFixed(2)}</span>
            </div>
            <button onClick={() => setIsWalletModalOpen(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 text-sm sm:text-base transition-all active:scale-95 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
                <WalletIcon />
                <span className="hidden sm:inline">Wallet</span>
            </button>
            <button 
                onClick={toggleTheme}
                className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-yellow-400 p-2.5 rounded-xl hover:bg-slate-100/50 dark:hover:bg-white/10 transition-all active:scale-90 active:rotate-12 border border-transparent hover:border-slate-200/50 dark:hover:border-white/10"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>

            <div className="relative" ref={notificationsRef}>
                <button 
                    onClick={handleOpenNotifications}
                    className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white p-2.5 rounded-xl hover:bg-slate-100/50 dark:hover:bg-white/10 transition-all active:scale-95 relative border border-transparent hover:border-slate-200/50 dark:hover:border-white/10"
                    aria-label="Notifications"
                >
                    <BellIcon />
                    {unreadCount > 0 && (
                         <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#141c2f]">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                         </span>
                    )}
                </button>
                {isNotificationsOpen && (
                    <div className="absolute right-0 mt-4 w-80 bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-xl rounded-2xl shadow-2xl z-50 border border-white/20 dark:border-white/5 flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-slate-200/50 dark:border-white/10">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                        </div>
                        <div className="overflow-y-auto custom-scrollbar">
                            {notifications.length > 0 ? (
                                notifications.map(notification => (
                                    <div 
                                        key={notification.id} 
                                        onClick={() => {
                                            if (notification.linkTo) {
                                                setCurrentPage('Profile');
                                            }
                                            setIsNotificationsOpen(false);
                                        }}
                                        className={`p-4 border-b border-slate-200/50 dark:border-white/5 last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-white/5 cursor-pointer transition-colors`}
                                    >
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{notification.message}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{timeAgo(notification.createdAt)}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                    <i className="fas fa-bell-slash text-3xl mb-3 opacity-50"></i>
                                    <p>You have no new notifications.</p>
                                </div>
                            )}
                        </div>
                         <div className="p-2 border-t border-slate-200/50 dark:border-white/10 text-center">
                            <button onClick={() => setIsNotificationsOpen(false)} className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Close</button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 transition-transform active:scale-95 p-1 rounded-xl hover:bg-slate-100/50 dark:hover:bg-white/5 border border-transparent hover:border-slate-200/50 dark:hover:border-white/10">
                    <img 
                      src={user.avatarUrl && user.avatarUrl.trim() !== '' ? user.avatarUrl : `https://i.pravatar.cc/100?u=${encodeURIComponent(user.username || 'user')}`} 
                      alt={user.username} 
                      className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-700 shadow-sm object-cover" 
                    />
                    <span className="font-semibold text-slate-700 dark:text-slate-200 hidden sm:block text-sm">{user.username}</span>
                    <div className="text-slate-400 scale-75">
                        <ChevronDownIcon />
                    </div>
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-4 w-56 bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-50 border border-white/20 dark:border-white/5 animate-in fade-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => {
                                setCurrentPage('Profile');
                                setIsDropdownOpen(false);
                            }} 
                            className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-white/10 transition-colors">
                            <i className="fas fa-user text-slate-400 w-4 text-center"></i>
                            Profile
                        </button>
                        <a href="#" className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-white/10 transition-colors">
                            <i className="fas fa-cog text-slate-400 w-4 text-center"></i>
                            Settings
                        </a>
                        <div className="my-1 border-t border-slate-200/50 dark:border-white/5"></div>
                        <button onClick={onLogout} className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors">
                            <LogoutIcon />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    </header>
  );
};

export default Header;
