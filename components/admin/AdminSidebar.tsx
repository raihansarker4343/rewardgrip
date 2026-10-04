import React, { useState } from 'react';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    activePage: string;
    setActivePage: (page: string) => void;
}

interface MenuItemProps {
    icon: string;
    text: string;
    hasSubMenu?: boolean;
    active?: boolean;
    children?: React.ReactNode;
    onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, text, hasSubMenu, active, children, onClick }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    
    const handleClick = () => {
        if (hasSubMenu) {
            setIsSubMenuOpen(!isSubMenuOpen);
        } else if (onClick) {
            onClick();
        }
    }

    return (
        <li>
            <button
                onClick={handleClick}
                className={`w-full flex justify-between items-center px-4 py-3 text-left hover:bg-slate-700 rounded-md transition-colors ${active ? 'bg-slate-700' : ''}`}
            >
                <div className="flex items-center gap-3">
                    <i className={`${icon} w-5 text-center`}></i>
                    <span>{text}</span>
                </div>
                {hasSubMenu && <i className={`fas fa-chevron-right transition-transform ${isSubMenuOpen ? 'rotate-90' : ''}`}></i>}
            </button>
            {hasSubMenu && isSubMenuOpen && (
                <ul className="pl-8 pt-1 space-y-1">
                    {children}
                </ul>
            )}
        </li>
    );
};

const SubMenuItem: React.FC<{ text: string }> = ({ text }) => {
    return (
         <li>
            <a href="#" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors">{text}</a>
        </li>
    );
}

const AdminSidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, activePage, setActivePage }) => {
    return (
        <aside className={`bg-[#0f172a] text-white flex flex-col transition-all duration-300 ease-in-out h-full shadow-lg ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
            <div className="flex-1 overflow-y-auto p-4 min-w-[16rem]">
                <div className="flex items-center justify-between h-12 border-b border-slate-700">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                </div>
                <nav className="mt-6">
                    <ul className="space-y-2">
                        <MenuItem icon="fas fa-tachometer-alt" text="Dashboard" active={activePage === 'Dashboard'} onClick={() => setActivePage('Dashboard')} />
                        <MenuItem icon="fas fa-exchange-alt" text="Transactions" active={activePage === 'Withdrawals'} onClick={() => setActivePage('Withdrawals')} />
                        <MenuItem icon="fas fa-users" text="User Info" active={activePage === 'Users'} onClick={() => setActivePage('Users')} />
                        <MenuItem icon="fas fa-life-ring" text="Support Tickets" />
                        <MenuItem icon="fas fa-cog" text="General Settings" />
                        <MenuItem icon="fas fa-poll" text="Survey Control" active={activePage === 'SurveyControl'} onClick={() => setActivePage('SurveyControl')} />
                        <MenuItem icon="fas fa-scroll" text="Offer Control" active={activePage === 'OfferControl'} onClick={() => setActivePage('OfferControl')} />
                        <MenuItem icon="fas fa-desktop" text="Home Page Settings" hasSubMenu />
                        <MenuItem icon="fas fa-bars" text="Menu Page Settings" hasSubMenu />
                        <MenuItem icon="fas fa-envelope-open-text" text="Email Settings" hasSubMenu />
                        <MenuItem icon="fas fa-credit-card" text="Payment Settings" active={activePage === 'PaymentSettings'} onClick={() => setActivePage('PaymentSettings')} />
                        <MenuItem icon="fas fa-share-alt" text="Social Settings" />
                        <MenuItem icon="fas fa-language" text="Language Settings" />
                        <MenuItem icon="fas fa-wrench" text="SEO Tools" hasSubMenu />
                        <MenuItem icon="fas fa-user-tie" text="Manage Staffs" />
                        <MenuItem icon="fas fa-user-check" text="Subscribers" />
                        <MenuItem icon="fas fa-cogs" text="System Settings" hasSubMenu />
                    </ul>
                </nav>
            </div>
            <div className="mt-auto p-4 text-center text-xs text-slate-500 min-w-[16rem]">
                Version: 2.1
            </div>
        </aside>
    );
};

export default AdminSidebar;