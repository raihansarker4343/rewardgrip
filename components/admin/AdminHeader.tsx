import React, { useState, useContext } from 'react';
import { AppContext } from '../../App';

interface HeaderProps {
    onMenuClick: () => void;
}

const AdminHeader: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { setIsAdmin } = useContext(AppContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAdmin(false);
    };

    return (
        <header className="bg-white p-4 flex items-center justify-between border-b border-slate-200 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuClick}
                    className="p-2 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
                    aria-label="Toggle menu"
                >
                    <i className="fas fa-bars text-xl"></i>
                </button>
            </div>
            <div className="flex items-center gap-4">
                <button className="text-slate-500 hover:text-slate-800 p-2" aria-label="Notifications">
                     <i className="far fa-bell text-xl"></i>
                </button>
                <button className="text-slate-500 hover:text-slate-800 p-2" aria-label="Messages">
                    <i className="far fa-comment text-xl"></i>
                </button>
                <button className="text-slate-500 hover:text-slate-800 p-2" aria-label="Email">
                     <i className="far fa-envelope text-xl"></i>
                </button>

                <div className="relative">
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2">
                        <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-9 h-9 rounded-full" />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-slate-200">
                            <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Profile</a>
                            <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Settings</a>
                            <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-slate-100">
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;