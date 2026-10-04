import React, { useState, useCallback, useEffect, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoggedOutHeader from './components/LoggedOutHeader';
import WalletModal from './components/WalletModal';
import LiveEarningFeed from './components/LiveEarningFeed';
import Footer from './components/Footer';
import type { User, Transaction, Notification } from './types';
import LoggedOutSidebar from './components/LoggedOutSidebar';
import SigninModal from './components/SigninModal';
import SignupModal from './components/SignupModal';
import SupportChatModal from './components/SupportChatModal';
import LiveChatModal from './components/LiveChatModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import ResetPasswordModal from './components/ResetPasswordModal';
import EmailVerificationModal from './components/EmailVerificationModal';
import { API_URL } from './constants';
import WithdrawalSuccessModal from './components/WithdrawalSuccessModal';
import ProfileEditModal from './components/ProfileEditModal';
import { authService } from './services/authService';

// Lazy load page components
const HomePageContent = React.lazy(() => import('./components/pages/HomePage'));
const LoggedInHomePage = React.lazy(() => import('./components/pages/LoggedInHomePage'));
const DashboardPage = React.lazy(() => import('./components/pages/DashboardPage'));
const OfferPage = React.lazy(() => import('./components/pages/OfferPage'));
const TasksPage = React.lazy(() => import('./components/pages/TasksPage'));
const SurveysPage = React.lazy(() => import('./components/pages/SurveysPage'));
const ReferralsPage = React.lazy(() => import('./components/pages/ReferralsPage'));
const LeaderboardPage = React.lazy(() => import('./components/pages/LeaderboardPage'));
const DailyBonusPage = React.lazy(() => import('./components/pages/DailyBonusPage'));
const AchievementsPage = React.lazy(() => import('./components/pages/AchievementsPage'));
const ChatPage = React.lazy(() => import('./components/pages/ChatPage'));

// Lazy load survey provider pages
const PrimeSurveysPage = React.lazy(() => import('./components/pages/survey/PrimeSurveysPage'));
const CPXResearchPage = React.lazy(() => import('./components/pages/survey/CPXResearchPage'));
const AdscendMediaSurveysPage = React.lazy(() => import('./components/pages/survey/AdscendMediaSurveysPage'));
const BitLabsSurveysPage = React.lazy(() => import('./components/pages/survey/BitLabsSurveysPage'));
const InBrainPage = React.lazy(() => import('./components/pages/survey/InBrainPage'));
const TheoremReachPage = React.lazy(() => import('./components/pages/survey/TheoremReachPage'));
const PollfishSurveysPage = React.lazy(() => import('./components/pages/survey/PollfishSurveysPage'));
const YourSurveysPage = React.lazy(() => import('./components/pages/survey/YourSurveysPage'));

// Lazy load offer provider pages
const ToroxPage = React.lazy(() => import('./components/pages/offers/ToroxPage'));
const AdscendMediaPage = React.lazy(() => import('./components/pages/offers/AdscendMediaPage'));
const AdToWallPage = React.lazy(() => import('./components/pages/offers/AdToWallPage'));
const RevUPage = React.lazy(() => import('./components/pages/offers/RevUPage'));
const AdGateMediaPage = React.lazy(() => import('./components/pages/offers/AdGateMediaPage'));
const MyChipsPage = React.lazy(() => import('./components/pages/offers/MyChipsPage'));
const MMWallPage = React.lazy(() => import('./components/pages/offers/MMWallPage'));
const AyeTStudiosPage = React.lazy(() => import('./components/pages/offers/AyeTStudiosPage'));
const MonlixPage = React.lazy(() => import('./components/pages/offers/MonlixPage'));
const HangMyAdsPage = React.lazy(() => import('./components/pages/offers/HangMyAdsPage'));
const LootablyPage = React.lazy(() => import('./components/pages/offers/LootablyPage'));
const TimeWallPage = React.lazy(() => import('./components/pages/offers/TimeWallPage'));
const AdGemPage = React.lazy(() => import('./components/pages/offers/AdGemPage'));

// Lazy load "About" pages
const BlogPage = React.lazy(() => import('./components/about/BlogPage'));
const GuidesPage = React.lazy(() => import('./components/about/GuidesPage'));
const TermsOfServicePage = React.lazy(() => import('./components/about/TermsOfServicePage'));
const PrivacyPolicyPage = React.lazy(() => import('./components/about/PrivacyPolicyPage'));
const CookiePolicyPage = React.lazy(() => import('./components/about/CookiePolicyPage'));
const AmlKycPolicyPage = React.lazy(() => import('./components/about/AmlKycPolicyPage'));

// Lazy load "Help" pages
const FrequentlyAskedPage = React.lazy(() => import('./components/help/FrequentlyAskedPage'));
const HelpDeskPage = React.lazy(() => import('./components/help/HelpDeskPage'));
const SupportPage = React.lazy(() => import('./components/help/SupportPage'));
const FairnessPage = React.lazy(() => import('./components/help/FairnessPage'));

// Lazy load admin panel
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout'));
const AdminLoginPage = React.lazy(() => import('./components/admin/AdminLoginPage'));

export const AppContext = React.createContext<{
  isLoggedIn: boolean;
  user: any | null;
  setUser: React.Dispatch<React.SetStateAction<any | null>>;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  handleLogin: (token: string) => Promise<void>;
  handleLogout: () => void;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSigninModalOpen: boolean;
  setIsSigninModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSignupModalOpen: boolean;
  openSignupModal: (email?: string) => void;
  currentPage: string;
  setCurrentPage: (pageName: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  theme: 'light' | 'dark';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
  isSupportChatModalOpen: boolean;
  setIsSupportChatModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLiveChatModalOpen: boolean;
  setIsLiveChatModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isWithdrawSuccessModalOpen: boolean;
  setIsWithdrawSuccessModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isProfileEditModalOpen: boolean;
  setIsProfileEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isLoggedIn: false,
  user: null,
  setUser: () => {},
  balance: 0,
  setBalance: () => {},
  transactions: [],
  setTransactions: () => {},
  notifications: [],
  setNotifications: () => {},
  handleLogin: async () => {},
  handleLogout: () => {},
  isWalletModalOpen: false,
  setIsWalletModalOpen: () => {},
  isSigninModalOpen: false,
  setIsSigninModalOpen: () => {},
  isSignupModalOpen: false,
  openSignupModal: () => {},
  currentPage: 'Home',
  setCurrentPage: () => {},
  isSidebarCollapsed: false,
  setIsSidebarCollapsed: () => {},
  isMobileSidebarOpen: false,
  setIsMobileSidebarOpen: () => {},
  theme: 'dark',
  setTheme: () => {},
  isSupportChatModalOpen: false,
  setIsSupportChatModalOpen: () => {},
  isLiveChatModalOpen: false,
  setIsLiveChatModalOpen: () => {},
  isWithdrawSuccessModalOpen: false,
  setIsWithdrawSuccessModalOpen: () => {},
  isProfileEditModalOpen: false,
  setIsProfileEditModalOpen: () => {},
  isAdmin: false,
  setIsAdmin: () => {},
});

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center h-full w-full p-8">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Storing the static page components outside the App component prevents them from being recreated on every render.
const pageComponentsMap: { [key: string]: React.ReactNode } = {
  'Profile': <DashboardPage />,
  'Offer': <OfferPage />,
  'Tasks': <TasksPage />,
  'Surveys': <SurveysPage />,
  'Prime Surveys': <PrimeSurveysPage />,
  'CPX Research': <CPXResearchPage />,
  'Adscend Media Surveys': <AdscendMediaSurveysPage />,
  'BitLabs': <BitLabsSurveysPage />,
  'inBrain': <InBrainPage />,
  'Pollfish': <PollfishSurveysPage />,
  'TheoremReach': <TheoremReachPage />,
  'Your-Surveys': <YourSurveysPage />,
  'Torox': <ToroxPage />,
  'Adscend Media': <AdscendMediaPage />,
  'AdToWall': <AdToWallPage />,
  'RevU': <RevUPage />,
  'AdGate Media': <AdGateMediaPage />,
  'MyChips': <MyChipsPage />,
  'MM Wall': <MMWallPage />,
  'Aye-T Studios': <AyeTStudiosPage />,
  'Monlix': <MonlixPage />,
  'Hang My Ads': <HangMyAdsPage />,
  'Lootably': <LootablyPage />,
  'Time Wall': <TimeWallPage />,
  'AdGem': <AdGemPage />,
  'Referrals': <ReferralsPage />,
  'Leaderboard': <LeaderboardPage />,
  'Daily Bonus': <DailyBonusPage />,
  'Achievements': <AchievementsPage />,
  'Chat': <ChatPage />,
  'Blog': <BlogPage />,
  'Guides': <GuidesPage />,
  'Terms of Service': <TermsOfServicePage />,
  'Privacy Policy': <PrivacyPolicyPage />,
  'Cookie Policy': <CookiePolicyPage />,
  'AML & KYC Policy': <AmlKycPolicyPage />,
  'Frequently Asked': <FrequentlyAskedPage />,
  'Help Desk': <HelpDeskPage />,
  'Support': <SupportPage />,
  'Fairness': <FairnessPage />,
  'Boxes': <div className="text-slate-900 dark:text-white text-3xl font-bold">Boxes Page</div>,
  'Battles': <div className="text-slate-900 dark:text-white text-3xl font-bold">Battles Page</div>,
};

// Helper function to ensure numeric fields from the API/localStorage are numbers
const sanitizeUser = (rawUser: User): User => {
  const user = { ...rawUser };
  const numericKeys: (keyof User)[] = [
    'xp', 'xpToNextLevel', 'totalEarned', 'balance', 'last30DaysEarned',
    'completedTasks', 'totalWagered', 'totalProfit', 'totalWithdrawn',
    'totalReferrals', 'referralEarnings'
  ];

  for (const key of numericKeys) {
    if (user[key] !== undefined && user[key] !== null) {
      // @ts-ignore
      user[key] = Number(user[key]);
    }
  }

  if (!user.avatarUrl || user.avatarUrl.trim() === '') {
    user.avatarUrl = user.avatar && user.avatar.trim() !== ''
      ? user.avatar
      : `https://i.pravatar.cc/100?u=${encodeURIComponent(user.username || 'user')}`;
  }

  return user;
};

const getPageFromPath = (pathname: string): string => {
  if (!pathname || pathname === '/' || pathname === '') return 'Home';

  const segments = pathname.split('/').filter(Boolean);
  const pageSegment = segments[0];

  const cleanPageKeyWithCase = pageSegment;
  const cleanPageKeyLower = cleanPageKeyWithCase
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();

  if (cleanPageKeyLower.startsWith('admin')) {
    return cleanPageKeyWithCase;
  }

  const pageNames = Object.keys(pageComponentsMap);
  const foundPageName = pageNames.find(
    (name) =>
      name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === cleanPageKeyLower
  );

  return foundPageName || 'Home';
};

const PENDING_VERIFICATION_KEY = 'pendingVerificationEmail';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? sanitizeUser(JSON.parse(stored)) : null;
    } catch {
      return null;
    }
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem('token') && !!localStorage.getItem('user');
  });
  const [balance, setBalance] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        return Number(u.balance) || 0;
      }
    } catch {}
    return 0;
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isSupportChatModalOpen, setIsSupportChatModalOpen] = useState(false);
  const [isLiveChatModalOpen, setIsLiveChatModalOpen] = useState(false);
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [signupInitialEmail, setSignupInitialEmail] = useState('');
  const [resetTokenFromUrl, setResetTokenFromUrl] = useState('');
  const [page, setPage] = useState('Home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isWithdrawSuccessModalOpen, setIsWithdrawSuccessModalOpen] = useState(false);
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const storedTheme = localStorage.getItem('theme');
    return (storedTheme === 'light' || storedTheme === 'dark') ? storedTheme : 'dark';
  });
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // If a user was asked to verify email, keep modal open after refresh.
  useEffect(() => {
    const pendingEmail = localStorage.getItem(PENDING_VERIFICATION_KEY);
    if (pendingEmail && !isLoggedIn) {
      setVerificationEmail(pendingEmail);
      setIsVerificationModalOpen(true);
    }
  }, [isLoggedIn]);

  const navigate = useCallback((pageName: string) => {
    const path =
      pageName === 'Home'
        ? '/'
        : `/${pageName.replace(/[^a-zA-Z0-9]/g, '')}`;

    if (window.location.pathname !== path) {
      const { search } = window.location;
      window.history.pushState({}, '', path + search);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem(PENDING_VERIFICATION_KEY);
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setBalance(0);
    setRedirectAfterLogin(null);
    setTransactions([]);
    setNotifications([]);
    navigate('Home');
  }, [navigate]);

  const fetchAndSetUserData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      let userData: User | null = null;
      let userTransactions: Transaction[] = [];
      let notificationsData: Notification[] = [];

      // 1. Try backend API if configured
      if (API_URL && API_URL.trim() !== '') {
        try {
          const [userRes, transactionsRes, notificationsRes] = await Promise.all([
            fetch(`${API_URL}/api/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(`${API_URL}/api/transactions`, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(`${API_URL}/api/notifications`, { headers: { 'Authorization': `Bearer ${token}` } })
          ]);

          if (userRes.ok && userRes.headers.get('content-type')?.includes('application/json')) {
            userData = await userRes.json();
          }
          if (transactionsRes.ok && transactionsRes.headers.get('content-type')?.includes('application/json')) {
            userTransactions = await transactionsRes.json();
          }
          if (notificationsRes.ok && notificationsRes.headers.get('content-type')?.includes('application/json')) {
            notificationsData = await notificationsRes.json();
          }
        } catch (apiErr) {
          console.warn('[App] Backend API unreachable, falling back to authService:', apiErr);
        }
      }

      // 2. Fallback to authService (Supabase direct / cached)
      if (!userData) {
        userData = await authService.getMe(token);
      }
      if (!userTransactions || !userTransactions.length) {
        userTransactions = await authService.getTransactions(token);
      }
      if (!notificationsData || !notificationsData.length) {
        notificationsData = await authService.getNotifications(token);
      }

      // 3. Fallback to localStorage cached user if network returned nothing
      if (!userData) {
        const cached = localStorage.getItem('user');
        if (cached) {
          try {
            userData = JSON.parse(cached);
          } catch {}
        }
      }

      if (userData) {
        const sanitizedUser = sanitizeUser(userData);
        localStorage.setItem('user', JSON.stringify(sanitizedUser));

        const parsedTransactions = (userTransactions || []).map(tx => ({
          ...tx,
          amount: Number(tx.amount) || 0
        }));

        setUser(sanitizedUser);
        setBalance(sanitizedUser.balance || 0);
        setTransactions(parsedTransactions);
        setNotifications(notificationsData || []);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  }, []);

  const handleLogin = useCallback(async (token: string) => {
    localStorage.setItem('token', token);
    await fetchAndSetUserData();

    if (redirectAfterLogin) {
      navigate(redirectAfterLogin);
      setRedirectAfterLogin(null);
    }

    setIsSigninModalOpen(false);
    setIsSignupModalOpen(false);
    setIsForgotPasswordOpen(false);
    setIsResetPasswordOpen(false);
    setIsVerificationModalOpen(false);
    setVerificationEmail('');
    localStorage.removeItem(PENDING_VERIFICATION_KEY);
  }, [fetchAndSetUserData, redirectAfterLogin, navigate]);

  // Effect for initial auth check from localStorage.
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoadingAuth(true);
      const token = localStorage.getItem('token');
      if (token) {
        try {
          let role: string | null = null;

          // Safely check if token is a standard 3-part JWT
          const parts = token.split('.');
          if (parts.length === 3) {
            try {
              const base64Url = parts[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split('')
                  .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              );
              const payload = JSON.parse(jsonPayload);
              role = payload.role;

              // Check if token has an expiration claim ('exp')
              if (payload.exp && typeof payload.exp === 'number') {
                const nowSec = Math.floor(Date.now() / 1000);
                if (payload.exp < nowSec) {
                  console.warn('[App] Token has expired, logging out.');
                  handleLogout();
                  setIsLoadingAuth(false);
                  return;
                }
              }
            } catch (err) {
              console.warn('[App] Error parsing token payload:', err);
            }
          }

          if (role === 'admin') {
            setIsAdmin(true);
          }

          // Fetch fresh user data or maintain cached session
          await fetchAndSetUserData();
        } catch (e) {
          console.error("Token verification check error:", e);
          const cachedUser = localStorage.getItem('user');
          if (!cachedUser) {
            handleLogout();
          }
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setIsLoadingAuth(false);
    };
    checkAuth();
  }, [fetchAndSetUserData, handleLogout]);

  // Effect to handle routing via path changes (no hash)
  useEffect(() => {
    if (isLoadingAuth) return;

    const handleLocationChange = () => {
      const { pathname, search } = window.location;
      const params = new URLSearchParams(search);

      // referral code (?ref=...)
      const ref = params.get('ref');
      if (ref) {
        localStorage.setItem('referralCode', ref);
      }

      // reset token (?resetToken=...)
      const resetTokenParam = params.get('resetToken');
      if (resetTokenParam) {
        setResetTokenFromUrl(resetTokenParam);
        setIsResetPasswordOpen(true);
        setIsSigninModalOpen(false);
        setIsSignupModalOpen(false);
        setIsForgotPasswordOpen(false);

        params.delete('resetToken');
        const newSearch = params.toString();
        const newUrl = `${pathname}${newSearch ? `?${newSearch}` : ''}`;
        window.history.replaceState({}, '', newUrl);
      }

      const pageFromPath = getPageFromPath(pathname);

      // Admin routes
      if (pageFromPath.toLowerCase().startsWith('admin')) {
        setPage(pageFromPath);
        return;
      }

      const token = localStorage.getItem('token');
      const publicPages = [
        'Blog', 'Guides', 'Terms of Service', 'Privacy Policy', 'Cookie Policy', 'AML & KYC Policy',
        'Frequently Asked', 'Help Desk', 'Support', 'Fairness'
      ];
      const isProtectedRoute = pageFromPath !== 'Home' && !publicPages.includes(pageFromPath);

      if (isProtectedRoute && !token) {
        setRedirectAfterLogin(pageFromPath);
        navigate('Home');
        setIsSigninModalOpen(true);
      } else {
        setPage(pageFromPath);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [isLoadingAuth, navigate]);

  // Effect to refetch data when tab becomes visible/focused
  useEffect(() => {
    const handleFocus = () => {
      if (localStorage.getItem('token')) {
        fetchAndSetUserData();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchAndSetUserData]);

  // =======================
  // AUTH MODAL HANDLERS (CLEAN)
  // =======================
  const closeAuthModals = useCallback(() => {
    setIsSigninModalOpen(false);
    setIsSignupModalOpen(false);
    setIsForgotPasswordOpen(false);
    setIsResetPasswordOpen(false);
    setIsVerificationModalOpen(false);
  }, []);

  const openSignupModal = useCallback((email = '') => {
    setSignupInitialEmail(email);
    closeAuthModals();
    setIsSignupModalOpen(true);
  }, [closeAuthModals]);

  const openForgotPassword = useCallback(() => {
    closeAuthModals();
    setIsForgotPasswordOpen(true);
  }, [closeAuthModals]);

  const openResetPassword = useCallback((token = '') => {
    if (token) {
      setResetTokenFromUrl(token);
    }
    closeAuthModals();
    setIsResetPasswordOpen(true);
  }, [closeAuthModals]);

  const handleResetSuccess = useCallback(() => {
    setIsResetPasswordOpen(false);
    setIsSigninModalOpen(true);
  }, []);

  const openVerificationModal = useCallback((email = '') => {
    setVerificationEmail(email);
    if (email) {
      localStorage.setItem(PENDING_VERIFICATION_KEY, email);
    }
    closeAuthModals();
    setIsVerificationModalOpen(true);
  }, [closeAuthModals]);

  const handleVerificationSuccess = useCallback(async (token: string) => {
    await handleLogin(token);
    setIsVerificationModalOpen(false);
    setVerificationEmail('');
    localStorage.removeItem(PENDING_VERIFICATION_KEY);
  }, [handleLogin]);

  const appContextValue = {
    isLoggedIn, user, setUser, balance, setBalance, transactions, setTransactions,
    notifications, setNotifications,
    handleLogin, handleLogout,
    isWalletModalOpen, setIsWalletModalOpen, isSigninModalOpen,
    setIsSigninModalOpen, isSignupModalOpen, openSignupModal,
    currentPage: page,
    setCurrentPage: navigate,
    isSidebarCollapsed, setIsSidebarCollapsed, isMobileSidebarOpen,
    setIsMobileSidebarOpen, theme, setTheme, isSupportChatModalOpen,
    setIsSupportChatModalOpen, isLiveChatModalOpen, setIsLiveChatModalOpen,
    isWithdrawSuccessModalOpen, setIsWithdrawSuccessModalOpen,
    isProfileEditModalOpen, setIsProfileEditModalOpen,
    isAdmin, setIsAdmin
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  if (isLoadingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-100 dark:bg-[#0f172a]">
        <PageLoader />
      </div>
    );
  }

  // Admin panel routing
  if (page.toLowerCase().startsWith('admin')) {
    if (!isAdmin) {
      return (
        <Suspense fallback={<PageLoader />}>
          <AdminLoginPage onLoginSuccess={() => setIsAdmin(true)} />
        </Suspense>
      );
    }
    return (
      <AppContext.Provider value={appContextValue}>
        <Suspense fallback={<PageLoader />}>
          <AdminLayout />
        </Suspense>
      </AppContext.Provider>
    );
  }

  const dedicatedPageNames = new Set([
    'Prime Surveys', 'CPX Research', 'Adscend Media Surveys', 'BitLabs', 'inBrain', 'Pollfish', 'TheoremReach', 'Your-Surveys',
    'Torox', 'Adscend Media', 'AdToWall', 'RevU', 'AdGate Media', 'MyChips', 'MM Wall', 'Aye-T Studios',
    'Monlix', 'Hang My Ads', 'Lootably', 'Time Wall', 'AdGem'
  ]);

  const isDedicatedView = dedicatedPageNames.has(page);

  const switchToSignup = () => {
    closeAuthModals();
    setIsSignupModalOpen(true);
  };

  const switchToSignin = () => {
    closeAuthModals();
    setIsSigninModalOpen(true);
  };

  if (isDedicatedView) {
    const ComponentToRender = pageComponentsMap[page];
    if (!ComponentToRender) {
      return (
        <div className="bg-slate-100 dark:bg-[#0f172a] text-slate-800 dark:text-slate-300 min-h-screen flex items-center justify-center">
          <h1 className="text-3xl font-bold">Page Not Found</h1>
        </div>
      );
    }

    return (
      <AppContext.Provider value={appContextValue}>
        <div className="bg-slate-100 dark:bg-[#0f172a] text-slate-800 dark:text-slate-300 min-h-screen">
          <Suspense fallback={<PageLoader />}>
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
              {ComponentToRender}
            </div>
          </Suspense>
        </div>
      </AppContext.Provider>
    );
  }

  const isPublicHomepage = !isLoggedIn && page === 'Home';
  
  const renderPage = () => {
    const pagePadding = "p-4 sm:p-6 lg:p-8";
    let componentToRender;

    if (page === 'Home') {
      componentToRender = isLoggedIn ? <LoggedInHomePage /> : <HomePageContent />;
    } else {
      componentToRender = pageComponentsMap[page];
    }

    if (!componentToRender) {
      componentToRender = isLoggedIn ? <LoggedInHomePage /> : <HomePageContent />;
    }

    if (isPublicHomepage) {
      return componentToRender;
    }

    return <div className={`max-w-7xl mx-auto w-full ${pagePadding}`}>{componentToRender}</div>;
  };

  const headerContent = isLoggedIn ? <Header onLogout={handleLogout} /> : <LoggedOutHeader />;
  const mainContent = renderPage();

  return (
    <AppContext.Provider value={appContextValue}>
      <div className={`min-h-screen lg:flex ${isPublicHomepage ? 'bg-[#141826] text-slate-300' : 'bg-slate-100 dark:bg-[#0f172a] text-slate-800 dark:text-slate-300'}`}>
        {isLoggedIn ? <Sidebar /> : <LoggedOutSidebar />}

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full">
          <header className="sticky top-0 z-20 shrink-0">
            {headerContent}
            <LiveEarningFeed />
          </header>

          <div className="flex-1 flex flex-col">
            <main className="flex-1 w-full">
              <Suspense fallback={<PageLoader />}>
                {mainContent}
              </Suspense>
            </main>
            <Footer />
          </div>
        </div>

        {isLoggedIn && <WalletModal />}
        {isLoggedIn && (
          <SupportChatModal
            isOpen={isSupportChatModalOpen}
            onClose={() => setIsSupportChatModalOpen(false)}
          />
        )}
        {isLoggedIn && <ProfileEditModal />}

        <WithdrawalSuccessModal
          isOpen={isWithdrawSuccessModalOpen}
          onClose={() => setIsWithdrawSuccessModalOpen(false)}
        />

        <LiveChatModal
          isOpen={isLiveChatModalOpen}
          onClose={() => setIsLiveChatModalOpen(false)}
        />

        {!isLoggedIn && (
          <>
            <SigninModal
              isOpen={isSigninModalOpen}
              onClose={() => setIsSigninModalOpen(false)}
              onSwitchToSignup={switchToSignup}
              onForgotPassword={openForgotPassword}
              onRequireVerification={openVerificationModal}
            />

            <SignupModal
              isOpen={isSignupModalOpen}
              onClose={() => setIsSignupModalOpen(false)}
              initialEmail={signupInitialEmail}
              onSwitchToSignin={switchToSignin}
              onRequireVerification={openVerificationModal}
            />

            <ForgotPasswordModal
              isOpen={isForgotPasswordOpen}
              onClose={() => setIsForgotPasswordOpen(false)}
              onSwitchToSignin={switchToSignin}
              onSwitchToReset={() => openResetPassword(resetTokenFromUrl)}
            />

            <ResetPasswordModal
              isOpen={isResetPasswordOpen}
              initialToken={resetTokenFromUrl}
              onClose={() => {
                setIsResetPasswordOpen(false);
                setResetTokenFromUrl('');
              }}
              onSuccess={handleResetSuccess}
              onSwitchToSignin={switchToSignin}
            />

            <EmailVerificationModal
              isOpen={isVerificationModalOpen}
              email={verificationEmail}
              onClose={() => setIsVerificationModalOpen(false)}
              onVerified={handleVerificationSuccess}
            />
          </>
        )}
      </div>
    </AppContext.Provider>
  );
};

export default App;
