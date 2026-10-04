import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminDashboardPage from './AdminDashboardPage';
import WithdrawalsPage from './WithdrawalsPage';
import PaymentSettingsPage from './PaymentSettingsPage';
import SurveyControlPage from './SurveyControlPage';
import OfferControlPage from './OfferControlPage';
import UserDetailPage from './UserDetailPage';
import UsersPage from './UsersPage';

const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activePage, setActivePage] = useState('Dashboard');
    const [viewingUser, setViewingUser] = useState<{ id: number; email: string; } | null>(null);
    const [previousPage, setPreviousPage] = useState('Dashboard');
    
    useEffect(() => {
        // Admin panel has a fixed light theme for the content area
        document.documentElement.classList.remove('dark');
        document.body.className = 'bg-slate-100';
    }, []);

    const handleViewUser = (user: { id: number; email: string }) => {
        setPreviousPage(activePage);
        setViewingUser(user);
        setActivePage('UserDetail');
    };

    const handleBackFromUserDetail = () => {
        setViewingUser(null);
        setActivePage(previousPage);
    };

    const renderPage = () => {
        switch(activePage) {
            case 'Dashboard':
                return <AdminDashboardPage onNavigate={setActivePage} onViewUser={handleViewUser} />;
            case 'Users':
                return <UsersPage onViewUser={handleViewUser} />;
            case 'Withdrawals':
                return <WithdrawalsPage onViewUser={handleViewUser} />;
            case 'PaymentSettings':
                return <PaymentSettingsPage />;
            case 'SurveyControl':
                return <SurveyControlPage />;
            case 'OfferControl':
                return <OfferControlPage />;
            case 'UserDetail':
                 return viewingUser ? <UserDetailPage user={viewingUser} onBack={handleBackFromUserDetail} /> : <div>No user selected.</div>;
            default:
                return <AdminDashboardPage onNavigate={setActivePage} onViewUser={handleViewUser} />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
            <AdminSidebar 
                isOpen={isSidebarOpen} 
                setIsOpen={setIsSidebarOpen} 
                activePage={activePage}
                setActivePage={setActivePage}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 p-6 overflow-y-auto">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;