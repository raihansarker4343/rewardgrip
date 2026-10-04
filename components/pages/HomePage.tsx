import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../../App';
import { FAQ_ITEMS, REWARD_OPTIONS, TESTIMONIALS, FEATURED_OFFERS } from '../../constants';
import { API_URL } from '../../constants';
import { supabase } from '../../lib/supabase';
import { dataService } from '../../services/dataService';
import { authService } from '../../services/authService';
import type { FaqItem } from '../../types';
import LiveCashoutsSection from '../LiveCashoutsSection';
import RewardLogo from '../RewardLogo';
import HonestTruthSection from '../earn/HonestTruthSection';

interface HomeStats {
  signups24h: number;
  avgTimeToFirstCash: string;
  avgWithdrawYesterday: number;
  totalEarned: number;
}

const DEFAULT_HOME_STATS: HomeStats = {
  signups24h: 0,
  avgTimeToFirstCash: '14m 20s',
  avgWithdrawYesterday: 0,
  totalEarned: 0,
};

const formatTotalEarned = (n: number): string =>
  n >= 1000
    ? Math.floor(n).toLocaleString('en-US')
    : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const HeroOfferCard: React.FC<{
  logo: string;
  name: string;
  description: string;
  payout: number;
  rating: number;
}> = ({ logo, name, description, payout, rating }) => {
  const dollars = Math.floor(Number(payout) || 0);
  const cents = ((Number(payout) || 0) % 1).toFixed(2).slice(2);

  return (
    <div className="group relative bg-[#1a1f2e]/95 backdrop-blur-md rounded-2xl border border-white/10 p-3.5 text-left hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
      <div className="bg-black/40 rounded-xl mb-3 flex items-center justify-center aspect-square overflow-hidden border border-white/5 relative">
        {logo && logo.trim() !== '' ? (
          <img src={logo} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="text-xl font-bold text-emerald-400">{name.charAt(0)}</span>
        )}
        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
          HOT
        </div>
      </div>
      <h3 className="font-bold text-white truncate text-sm mb-0.5 group-hover:text-emerald-400 transition-colors">{name}</h3>
      <p className="text-slate-400 text-xs truncate mb-2.5">{description}</p>
      <div className="flex items-end justify-between gap-1 pt-1.5 border-t border-white/5">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">Earn up to</p>
          <div className="flex items-baseline text-white font-black leading-none">
            <span className="text-sm text-emerald-400 font-bold">$</span>
            <span className="text-xl text-white">{dollars}</span>
            <span className="text-xs text-slate-400 font-semibold">.{cents}</span>
          </div>
        </div>
        <p className="text-amber-400 text-xs font-bold flex items-center gap-1 shrink-0 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-md">
          <i className="fas fa-star text-[9px]" />
          {(Number(rating) || 5).toFixed(1)}
        </p>
      </div>
    </div>
  );
};

// Custom hook to detect when an element is in view
const useInView = (options?: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, isInView] as const;
};

// Accordion item for the FAQ section with smooth transitions
const FaqAccordionItem: React.FC<{ item: FaqItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center p-6 hover:bg-white/5 focus:outline-none"
      >
        <span className="font-semibold text-lg text-white">{item.question}</span>
        <span
          className={`transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <i className="fas fa-chevron-down" />
        </span>
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px' }}
        className="overflow-hidden transition-all duration-500 ease-in-out"
      >
        <div className="px-6 pb-6 pt-0 text-slate-400">{item.answer}</div>
      </div>
    </div>
  );
};

const HighestPayoutsIcon = () => (
  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00D26A] to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 transition-transform duration-300 group-hover:scale-105">
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9v12" />
      <path d="M12 5v16" />
      <path d="M18 13v8" />
      <circle cx="12" cy="3" r="1" fill="currentColor" />
      <path d="M3 21h18" />
    </svg>
  </div>
);

const InstantCashoutsIcon = () => (
  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 transition-transform duration-300 group-hover:scale-105">
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.25" />
    </svg>
  </div>
);

const DailyBonusesIcon = () => (
  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 transition-transform duration-300 group-hover:scale-105">
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" rx="1" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  </div>
);

const siteBenefits = [
  {
    icon: <HighestPayoutsIcon />,
    badge: 'Up to +50% Rates',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    title: 'Highest Payouts',
    description:
      "Earn significantly more than on other reward sites. We partner directly with top game studios and advertisers to pass maximum earnings straight to you.",
    bullets: ['Guaranteed highest rates', 'Over $350 available per offer'],
    stat: '98.7% Satisfaction Rate',
    glow: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
  },
  {
    icon: <InstantCashoutsIcon />,
    badge: 'Under 2 Minutes',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25',
    title: 'Instant Cashouts',
    description:
      'No waiting days for approvals. Withdraw your money instantly starting at just $0.50 via PayPal, Crypto (BTC, LTC, USDT), or 100+ Gift Cards.',
    bullets: ['Automated fast processing', 'PayPal, Crypto & 100+ Gift Cards'],
    stat: '100,000+ Sent Cashouts',
    glow: 'hover:border-cyan-500/40 hover:shadow-cyan-500/10',
  },
  {
    icon: <DailyBonusesIcon />,
    badge: 'Free Daily Coins',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    title: 'Daily Bonuses & Streaks',
    description:
      'Boost your balance every single day. Climb the streak ladder, spin daily prize wheels, and compete in our weekly $5,000 leaderboard race.',
    bullets: ['Daily streak ladder rewards', 'Weekly $5,000 Leaderboard race'],
    stat: 'Daily Cash Prize Pool',
    glow: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
  },
];

const HomePageContent: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { openSignupModal, isLoggedIn, setIsWalletModalOpen, handleLogin } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | 'apple' | null>(null);
  const [socialError, setSocialError] = useState<string | null>(null);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [homeStats, setHomeStats] = useState<HomeStats>(DEFAULT_HOME_STATS);

  const handleSocialAuth = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      setSocialLoading(provider);
      setSocialError(null);
      const res = await authService.signInWithSocial(provider);
      if (res.ok) {
        if (res.token) {
          await handleLogin(res.token);
        }
      } else {
        setSocialError(res.message || `Failed to initiate real ${provider} authentication.`);
      }
    } catch (err: any) {
      console.error('Social login failed:', err);
      setSocialError(err?.message || `Failed to connect with ${provider}.`);
    } finally {
      setSocialLoading(null);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchHomeStats = async () => {
      try {
        const data = await dataService.getHomeStats();
        if (isMounted) {
          setHomeStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch home stats:', error);
      }
    };

    fetchHomeStats();

    // Supabase Realtime channel for live instant DB updates
    const channel = supabase
      ?.channel('public_db_home_stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        fetchHomeStats();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        fetchHomeStats();
      })
      .subscribe();

    const interval = setInterval(fetchHomeStats, 6000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (channel) {
        supabase?.removeChannel(channel);
      }
    };
  }, []);

  const handleStartEarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      openSignupModal(email);
    } else {
      alert('Please enter a valid email address.');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const [bestWaysRef, isBestWaysInView] = useInView({ threshold: 0.1 });
  const [whyUsRef, isWhyUsInView] = useInView({ threshold: 0.1 });
  const [rewardsRef, isRewardsInView] = useInView({ threshold: 0.15 });
  const [testimonialsRef, isTestimonialsInView] = useInView({ threshold: 0.15 });
  const [faqRef, isFaqInView] = useInView({ threshold: 0.15 });

  const handleNextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <div className="relative w-full bg-[#141826] text-slate-300 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-[#141826] text-white overflow-hidden">
        {/* Ambient Lighting Orbs */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 md:pt-10 md:pb-12 lg:pt-12 lg:pb-12 relative z-10">
            {/* Inline floating keyframes */}
            <style>{`
              @keyframes heroFloat1 {
                0%, 100% { transform: translateY(0px) rotate(22deg); }
                50% { transform: translateY(-9px) rotate(25deg); }
              }
              @keyframes heroFloatPaypal {
                0%, 100% { transform: translateY(0px) rotate(-12deg); }
                50% { transform: translateY(-8px) rotate(-9deg); }
              }
              @keyframes heroFloatAmazon {
                0%, 100% { transform: translateY(0px) rotate(12deg); }
                50% { transform: translateY(8px) rotate(15deg); }
              }
              @keyframes heroFloatCoin {
                0%, 100% { transform: translateY(0px) scale(1); }
                50% { transform: translateY(-6px) scale(1.05); }
              }
            `}</style>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
              {/* Left Column — Big Headline + Subtitle + Trustpilot (matching image.png) */}
              <div
                className={`lg:col-span-5 xl:col-span-5 transition-all duration-700 ease-out ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <h1 className="text-left font-black tracking-tight mb-5">
                  <span className="block text-xl sm:text-2xl lg:text-3xl font-bold text-slate-300/90 mb-1 tracking-normal">
                    Love what you do,
                  </span>
                  <span className="block text-3xl sm:text-5xl lg:text-[3.4rem] xl:text-[3.9rem] font-black text-white leading-[1.08] tracking-tight">
                    and we&apos;ll make it
                  </span>
                  <span className="block text-4xl sm:text-5xl lg:text-[4rem] xl:text-[4.6rem] font-black text-[#00D26A] leading-[1.02] tracking-tight drop-shadow-[0_0_35px_rgba(0,210,106,0.35)]">
                    worthwhile.
                  </span>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base lg:text-lg font-normal leading-relaxed mb-8 max-w-md">
                  Play games. Try new apps. Take surveys. Earn cashback. The app the internet loves.
                </p>

                {/* Trustpilot Review Strip (matching image.png) */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex items-center gap-2.5">
                    {/* 5 Green squares with white stars */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-5 h-5 bg-[#00b67a] flex items-center justify-center rounded-[2px] shadow-sm">
                          <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-white text-sm font-semibold">
                      <span className="text-[#00b67a] font-bold text-base flex items-center">★</span>
                      <span className="font-bold text-white tracking-tight">Trustpilot</span>
                      <span className="text-slate-400 font-normal text-xs ml-1">TrustScore <strong className="text-white font-bold">4.6</strong></span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 font-normal">Reviews are not verified by us</p>
                </div>
              </div>

              {/* Center Column — Seamless Cutout Woman with Phone + 3D Floating Rewards (matching user reference) */}
              <div
                className={`lg:col-span-3 xl:col-span-3 flex justify-center items-end relative py-4 lg:py-0 transition-all duration-700 ease-out delay-100 ${
                  mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                {/* Ambient glow behind woman */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/25 rounded-full blur-[90px] pointer-events-none" />
                <div className="absolute top-1/3 right-0 w-60 h-60 bg-blue-500/15 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px] flex justify-center items-end">
                  {/* Floating Flying Dollar Note (Top Right) */}
                  <div
                    className="absolute top-2 -right-2 sm:-right-4 z-20 pointer-events-none drop-shadow-[0_12px_24px_rgba(0,210,106,0.45)]"
                    style={{ animation: 'heroFloat1 4s ease-in-out infinite' }}
                  >
                    <div className="w-18 sm:w-22 h-10 sm:h-12 rounded-lg bg-gradient-to-r from-emerald-600 via-[#00D26A] to-teal-500 p-0.5 shadow-2xl border border-white/30 backdrop-blur-sm">
                      <div className="w-full h-full border border-dashed border-white/40 rounded flex items-center justify-around px-1.5 text-white">
                        <span className="text-[10px] font-bold opacity-80">$</span>
                        <div className="w-4.5 h-4.5 rounded-full bg-white/20 flex items-center justify-center font-black text-[11px]">$</div>
                        <span className="text-[10px] font-bold opacity-80">$</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating 3D PayPal Badge (Right side) */}
                  <div
                    className="absolute top-[46%] -right-5 sm:-right-8 z-30 drop-shadow-[0_15px_30px_rgba(0,112,186,0.55)] cursor-pointer"
                    style={{ animation: 'heroFloatPaypal 5s ease-in-out infinite' }}
                  >
                    <div className="px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-br from-[#0070BA] via-[#005ea6] to-[#003087] text-white font-extrabold shadow-2xl flex items-center gap-1.5 sm:gap-2 hover:scale-105 transition-transform duration-300 border border-white/25">
                      <i className="fab fa-paypal text-lg sm:text-xl text-white drop-shadow" />
                      <span className="text-sm sm:text-base font-black tracking-tight text-white">PayPal</span>
                    </div>
                  </div>

                  {/* Floating 3D Amazon Gift Card (Bottom Left) */}
                  <div
                    className="absolute bottom-16 -left-4 sm:-left-7 z-30 drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] cursor-pointer"
                    style={{ animation: 'heroFloatAmazon 6s ease-in-out infinite' }}
                  >
                    <div className="px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-2xl bg-[#141824] text-white shadow-2xl flex items-center gap-1.5 sm:gap-2 hover:scale-105 transition-transform duration-300 border border-white/20">
                      <i className="fab fa-amazon text-lg sm:text-xl text-white" />
                      <span className="text-sm sm:text-base font-bold tracking-tight text-white">amazon</span>
                    </div>
                  </div>

                  {/* Floating 3D Golden Coins */}
                  {/* Left Coin */}
                  <div
                    className="absolute top-[55%] -left-3 sm:-left-6 z-20 drop-shadow-[0_8px_16px_rgba(234,179,8,0.5)] pointer-events-none"
                    style={{ animation: 'heroFloatCoin 4.5s ease-in-out infinite' }}
                  >
                    <div className="w-9 sm:w-11 h-9 sm:h-11 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 p-0.5 shadow-xl flex items-center justify-center border border-yellow-200/50">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center font-black text-amber-950 text-xs sm:text-sm border border-amber-300/60 shadow-inner">
                        $
                      </div>
                    </div>
                  </div>

                  {/* Bottom Right Coin */}
                  <div
                    className="absolute bottom-12 right-2 sm:right-4 z-20 drop-shadow-[0_8px_16px_rgba(234,179,8,0.5)] pointer-events-none"
                    style={{ animation: 'heroFloatCoin 5.5s ease-in-out infinite 1s' }}
                  >
                    <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 p-0.5 shadow-xl flex items-center justify-center border border-yellow-200/50">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center font-black text-amber-950 text-[11px] sm:text-xs border border-amber-300/60 shadow-inner">
                        $
                      </div>
                    </div>
                  </div>

                  {/* Pure Cutout Woman — Blends 100% Seamlessly with Background */}
                  <div className="relative w-full overflow-visible flex justify-center items-end">
                    <img
                      src="/hero-woman-exact.webp"
                      alt="Excited user earning cash on phone"
                      className="w-full h-auto max-h-[460px] sm:max-h-[500px] lg:max-h-[520px] object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] filter brightness-105 contrast-105 hover:scale-[1.02] transition-transform duration-500 pointer-events-none select-none [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
                    />

                    {/* Bottom soft dissolve fade into hero background */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#141826] via-[#141826]/70 to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Right Column — Sign Up For Free Card (matching image.png) */}
              <div
                className={`lg:col-span-4 xl:col-span-4 relative bg-[#181d2c]/95 backdrop-blur-xl p-6 sm:p-7 md:p-8 rounded-3xl shadow-2xl border border-white/10 transition-all duration-1000 ease-out delay-200 hover:border-emerald-500/30 ${
                  mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
                }`}
              >
                {/* Glow bar at top */}
                <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Sign Up For <span className="text-[#00D26A]">Free</span>
                  </h2>
                </div>

                <form onSubmit={handleStartEarning}>
                  <div className="relative mb-3.5">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#242b3d] text-white p-3.5 pl-12 rounded-xl border border-slate-700/60 focus:border-[#00D26A] focus:outline-none focus:ring-1 focus:ring-[#00D26A] text-sm placeholder:text-slate-400 font-medium transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#00D26A] hover:bg-[#00ba5e] text-[#0d131f] font-extrabold py-3.5 rounded-xl mb-4 text-base transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Get started for free</span>
                  </button>
                </form>

                <div className="flex items-center my-4">
                  <hr className="flex-grow border-slate-700/60" />
                  <span className="mx-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider">OR</span>
                  <hr className="flex-grow border-slate-700/60" />
                </div>

                {socialError && (
                  <div className="mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5 animate-fadeIn">
                    <i className="fas fa-exclamation-triangle text-amber-400 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="leading-relaxed font-medium">{socialError}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSocialError(null)}
                      className="text-amber-400 hover:text-white text-xs shrink-0"
                    >
                      <i className="fas fa-times" />
                    </button>
                  </div>
                )}

                <div className="space-y-2.5">
                  <button
                    type="button"
                    disabled={socialLoading !== null}
                    onClick={() => handleSocialAuth('google')}
                    className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold py-3 rounded-xl flex items-center justify-center gap-2.5 transition-all text-sm shadow-sm active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {socialLoading === 'google' ? (
                      <>
                        <i className="fas fa-circle-notch fa-spin text-slate-700 text-sm" />
                        <span>Connecting Google...</span>
                      </>
                    ) : (
                      <>
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                          alt="Google"
                          className="w-4 h-4"
                        />
                        <span>Sign Up with Google</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={socialLoading !== null}
                    onClick={() => handleSocialAuth('facebook')}
                    className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {socialLoading === 'facebook' ? (
                      <>
                        <i className="fas fa-circle-notch fa-spin text-white text-sm" />
                        <span>Connecting Facebook...</span>
                      </>
                    ) : (
                      <>
                        <i className="fab fa-facebook-f text-sm" />
                        <span>Sign Up with Facebook</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={socialLoading !== null}
                    onClick={() => handleSocialAuth('apple')}
                    className="w-full bg-[#16181f] hover:bg-black text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm border border-white/10 active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {socialLoading === 'apple' ? (
                      <>
                        <i className="fas fa-circle-notch fa-spin text-white text-sm" />
                        <span>Connecting Apple...</span>
                      </>
                    ) : (
                      <>
                        <i className="fab fa-apple text-base" />
                        <span>Sign Up with Apple</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats row — FreeCash-style individual glass cards */}
            <div
              className={`mt-6 md:mt-8 pt-5 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 transition-all duration-700 delay-300 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="bg-[#1a1f2e]/60 backdrop-blur-sm rounded-2xl border border-white/10 p-5 hover:border-emerald-500/20 transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-2xl sm:text-3xl font-black text-white">
                    {homeStats.signups24h.toLocaleString()}
                  </p>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium">
                  Sign-ups in the past 24 hours
                </p>
              </div>

              <div className="bg-[#1a1f2e]/60 backdrop-blur-sm rounded-2xl border border-white/10 p-5 hover:border-emerald-500/20 transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <i className="fas fa-stopwatch text-emerald-400 text-sm" />
                  <p className="text-2xl sm:text-3xl font-black text-white">
                    {homeStats.avgTimeToFirstCash || '14m 20s'}
                  </p>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium">
                  Avg. time to earn first cash
                </p>
              </div>

              <div className="bg-[#1a1f2e]/60 backdrop-blur-sm rounded-2xl border border-white/10 p-5 hover:border-emerald-500/20 transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <i className="fas fa-wallet text-emerald-400 text-sm" />
                  <p className="text-2xl sm:text-3xl font-black text-white">
                    ${(Number(homeStats?.avgWithdrawYesterday) || 0).toFixed(2)}
                  </p>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium">
                  Avg. withdrawal sent yesterday
                </p>
              </div>

              <div className="bg-[#1a1f2e]/60 backdrop-blur-sm rounded-2xl border border-white/10 p-5 hover:border-emerald-500/20 transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <i className="fas fa-trophy text-yellow-400 text-sm" />
                  <p className="text-2xl sm:text-3xl font-black text-white">
                    ${formatTotalEarned(Number(homeStats?.totalEarned) || 0)}
                  </p>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium">
                  Total amount earned on RewardGrip
                </p>
              </div>
            </div>
          </div>
        </section>
        

        {/* Section 2: So what's the catch? (Matching image.png) */}
        <HonestTruthSection sectionRef={bestWaysRef} isInView={isBestWaysInView} />

        {/* Why Us Section — Carding Design matching 'So what's the catch?' */}
        <section
          ref={whyUsRef}
          className="relative py-10 sm:py-14 md:py-16 overflow-hidden bg-[#141826]"
        >
          {/* Subtle Ambient Glow Orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            {/* Header matching 'So what's the catch?' style */}
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 mb-4 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Why Choose RewardGrip
              </div>

              <h2
                className={`text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3 transition-opacity duration-700 ${
                  isWhyUsInView ? "opacity-100" : "opacity-0"
                }`}
              >
                We&apos;re the #1 site to make money.{' '}
                <span className="text-[#00D26A]">
                  Here&apos;s why.
                </span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal max-w-2xl mx-auto">
                Earning should feel fast, rewarding, and transparent. Our guaranteed payouts, instant processing,
                and daily streaks deliver a top-tier rewards experience.
              </p>
            </div>

            {/* Benefit Cards Grid — Carding Design matching 'So what's the catch?' */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {siteBenefits.map((benefit, i) => (
                <div
                  key={i}
                  className={`group relative h-full transition-all duration-500 ease-out ${
                    isWhyUsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="relative h-full rounded-2xl sm:rounded-3xl border border-white/[0.08] hover:border-emerald-500/30 bg-[#181d2c]/95 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 p-6 sm:p-7 md:p-8 flex flex-col justify-between overflow-hidden">
                    {/* Top ambient highlight line */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/20 group-hover:via-emerald-400/60 to-transparent transition-all duration-500" />

                    <div>
                      {/* Top row with Icon and Badge */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="relative group-hover:scale-105 transition-transform duration-300">
                          {benefit.icon}
                        </div>
                        <span className={`px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${benefit.badgeColor}`}>
                          {benefit.badge}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-2.5 leading-snug">
                        {benefit.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-5">
                        {benefit.description}
                      </p>

                      {/* Bullet Highlights */}
                      <div className="space-y-2.5 mb-6 pt-4 border-t border-white/[0.06]">
                        {benefit.bullets.map((bullet, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                            <i className="fas fa-check-circle text-[#00D26A] text-xs flex-shrink-0" />
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer trust badge */}
                    <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#00D26A] animate-pulse" />
                        <span className="text-slate-300 font-semibold">{benefit.stat}</span>
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-white/[0.04] group-hover:bg-emerald-500 group-hover:text-black flex items-center justify-center text-slate-400 transition-all duration-300">
                        <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

  {/* Rewards Section - Premium Marquee as in image.png */}
  <section
    ref={rewardsRef}
    className="relative py-10 sm:py-14 md:py-16 text-center overflow-hidden bg-[#141826]"
  >
    <style>{`
      @keyframes rewardMarqueeScrollLeft {
        0% { transform: translate3d(0, 0, 0); }
        100% { transform: translate3d(-50%, 0, 0); }
      }
      @keyframes rewardMarqueeScrollRight {
        0% { transform: translate3d(-50%, 0, 0); }
        100% { transform: translate3d(0, 0, 0); }
      }
      .reward-track-left {
        display: flex;
        width: max-content;
        animation: rewardMarqueeScrollLeft 30s linear infinite;
        will-change: transform;
      }
      .reward-track-right {
        display: flex;
        width: max-content;
        animation: rewardMarqueeScrollRight 32s linear infinite;
        will-change: transform;
      }
      .reward-track-left:hover,
      .reward-track-right:hover {
        animation-play-state: paused;
      }
    `}</style>

    {/* Header exactly matching image.png */}
    <div className="max-w-4xl mx-auto px-6 mb-6 sm:mb-8 md:mb-10 text-center">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
        Rewards, your way.
      </h2>
      <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00D26A] tracking-tight mt-1 sm:mt-2">
        Pick from many options.
      </p>
    </div>

    {/* Dual-row animated cards ribbon */}
    <div className="relative w-full overflow-hidden space-y-3.5 sm:space-y-4 md:space-y-5">
      {/* Left gradient fade mask */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 md:w-56 z-20 bg-gradient-to-r from-[#141826] via-[#141826]/80 to-transparent" />
      {/* Right gradient fade mask */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 md:w-56 z-20 bg-gradient-to-l from-[#141826] via-[#141826]/80 to-transparent" />

      {/* Row 1: Scrolling Left */}
      <div className="overflow-hidden w-full flex">
        <div className="reward-track-left gap-3 sm:gap-4 md:gap-5 pr-3 sm:pr-4 md:pr-5">
          {[
            // Set 1
            { id: 'r1-1', type: 'visa', label: 'Visa' },
            { id: 'r1-2', type: 'doge', label: 'Dogecoin' },
            { id: 'r1-3', type: 'paypal', label: 'PayPal' },
            { id: 'r1-4', type: 'bitcoin', label: 'Bitcoin' },
            { id: 'r1-5', type: 'litecoin', label: 'Litecoin' },
            { id: 'r1-6', type: 'visa', label: 'Visa' },
            { id: 'r1-7', type: 'doge', label: 'Dogecoin' },
            { id: 'r1-8', type: 'paypal', label: 'PayPal' },
            { id: 'r1-9', type: 'bitcoin', label: 'Bitcoin' },
            { id: 'r1-10', type: 'litecoin', label: 'Litecoin' },
            { id: 'r1-11', type: 'visa', label: 'Visa' },
            // Set 2 for seamless loop
            { id: 'r1-dup-1', type: 'visa', label: 'Visa' },
            { id: 'r1-dup-2', type: 'doge', label: 'Dogecoin' },
            { id: 'r1-dup-3', type: 'paypal', label: 'PayPal' },
            { id: 'r1-dup-4', type: 'bitcoin', label: 'Bitcoin' },
            { id: 'r1-dup-5', type: 'litecoin', label: 'Litecoin' },
            { id: 'r1-dup-6', type: 'visa', label: 'Visa' },
            { id: 'r1-dup-7', type: 'doge', label: 'Dogecoin' },
            { id: 'r1-dup-8', type: 'paypal', label: 'PayPal' },
            { id: 'r1-dup-9', type: 'bitcoin', label: 'Bitcoin' },
            { id: 'r1-dup-10', type: 'litecoin', label: 'Litecoin' },
            { id: 'r1-dup-11', type: 'visa', label: 'Visa' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => (isLoggedIn ? setIsWalletModalOpen(true) : openSignupModal())}
              aria-label={`Redeem with ${item.label}`}
              className="group relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl md:rounded-[22px] shrink-0 p-0 cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-1.5 active:scale-95 focus:outline-none border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_10px_25px_rgba(0,0,0,0.35)]"
            >
              {item.type === 'doge' && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#d5aa2c] to-[#af871b]">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full border-2 sm:border-[2.5px] border-white flex items-center justify-center shadow-sm">
                    <span className="text-white font-serif font-black text-xl sm:text-2xl md:text-3xl leading-none select-none -mt-0.5">
                      Ð
                    </span>
                  </div>
                </div>
              )}

              {item.type === 'paypal' && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#0062c9] to-[#003c8c]">
                  <svg className="w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13" viewBox="0 0 32 32" fill="none">
                    <path
                      d="M10.5 27H5.2c-.7 0-1.2-.5-1.1-1.2L7.3 5.4c.1-.8.8-1.4 1.6-1.4h9.1c3.9 0 7 1.1 8 4 1 2.9-.1 5.9-2.5 7.6-1.5 1-3.6 1.4-6.3 1.4h-3.4c-.6 0-1.1.4-1.2 1l-2.1 9z"
                      fill="#FFFFFF"
                      fillOpacity="0.75"
                    />
                    <path
                      d="M14.2 27h-4.3c-.7 0-1.2-.5-1.1-1.2L11 8.2c.1-.8.8-1.4 1.6-1.4h7.5c3.5 0 6.2 1 7.1 3.6.8 2.6-.1 5.2-2.2 6.7-1.3.9-3.2 1.3-5.6 1.3h-3c-.6 0-1.1.4-1.2 1l-1 7.6z"
                      fill="#FFFFFF"
                    />
                  </svg>
                </div>
              )}

              {item.type === 'bitcoin' && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#fa961c] to-[#d67705]">
                  <svg className="w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.73 10.02c.45-.64.69-1.46.69-2.36 0-2.3-1.63-3.66-4.34-3.66H7.5V1.5h-2v2.5H4v2h1.5v12H4v2h1.5v2.5h2V20h4.29c3.27 0 5.21-1.69 5.21-4.24 0-1.62-.75-2.91-2.27-3.74zM9.5 6h1.58c1.61 0 2.54.76 2.54 2.01s-.93 2.01-2.54 2.01H9.5V6zm2.08 12H9.5v-4.32h2.08c1.88 0 2.92.83 2.92 2.16 0 1.34-1.04 2.16-2.92 2.16z" />
                  </svg>
                </div>
              )}

              {item.type === 'litecoin' && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#8f98a2] to-[#6a737f]">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full border-2 sm:border-[2.5px] border-white flex items-center justify-center shadow-sm">
                    <span className="text-white font-sans italic font-black text-xl sm:text-2xl md:text-3xl leading-none select-none -ml-0.5">
                      Ł
                    </span>
                  </div>
                </div>
              )}

              {item.type === 'visa' && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#1436cc] to-[#0a238f]">
                  <span className="text-white font-sans font-black italic tracking-wider text-lg sm:text-xl md:text-2xl select-none scale-y-95">
                    VISA
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: Scrolling Right / Offset */}
      <div className="overflow-hidden w-full flex">
        <div className="reward-track-right gap-3 sm:gap-4 md:gap-5 pr-3 sm:pr-4 md:pr-5">
          {[
            // Set 1 (offset sequence from image.png)
            { id: 'r2-1', type: 'paypal', label: 'PayPal' },
            { id: 'r2-2', type: 'doge', label: 'Dogecoin' },
            { id: 'r2-3', type: 'visa', label: 'Visa' },
            { id: 'r2-4', type: 'litecoin', label: 'Litecoin' },
            { id: 'r2-5', type: 'bitcoin', label: 'Bitcoin' },
            { id: 'r2-6', type: 'paypal', label: 'PayPal' },
            { id: 'r2-7', type: 'doge', label: 'Dogecoin' },
            { id: 'r2-8', type: 'visa', label: 'Visa' },
            { id: 'r2-9', type: 'litecoin', label: 'Litecoin' },
            { id: 'r2-10', type: 'bitcoin', label: 'Bitcoin' },
            { id: 'r2-11', type: 'paypal', label: 'PayPal' },
            // Set 2 for seamless loop
            { id: 'r2-dup-1', type: 'paypal', label: 'PayPal' },
            { id: 'r2-dup-2', type: 'doge', label: 'Dogecoin' },
            { id: 'r2-dup-3', type: 'visa', label: 'Visa' },
            { id: 'r2-dup-4', type: 'litecoin', label: 'Litecoin' },
            { id: 'r2-dup-5', type: 'bitcoin', label: 'Bitcoin' },
            { id: 'r2-dup-6', type: 'paypal', label: 'PayPal' },
            { id: 'r2-dup-7', type: 'doge', label: 'Dogecoin' },
            { id: 'r2-dup-8', type: 'visa', label: 'Visa' },
            { id: 'r2-dup-9', type: 'litecoin', label: 'Litecoin' },
            { id: 'r2-dup-10', type: 'bitcoin', label: 'Bitcoin' },
            { id: 'r2-dup-11', type: 'paypal', label: 'PayPal' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => (isLoggedIn ? setIsWalletModalOpen(true) : openSignupModal())}
              aria-label={`Redeem with ${item.label}`}
              className="group relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl md:rounded-[22px] shrink-0 p-0 cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-1.5 active:scale-95 focus:outline-none border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_10px_25px_rgba(0,0,0,0.35)]"
            >
              {item.type === 'doge' && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#d5aa2c] to-[#af871b]">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full border-2 sm:border-[2.5px] border-white flex items-center justify-center shadow-sm">
                    <span className="text-white font-serif font-black text-xl sm:text-2xl md:text-3xl leading-none select-none -mt-0.5">
                      Ð
                    </span>
                  </div>
                </div>
              )}

              {item.type === 'paypal' && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#0062c9] to-[#003c8c]">
                  <svg className="w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13" viewBox="0 0 32 32" fill="none">
                    <path
                      d="M10.5 27H5.2c-.7 0-1.2-.5-1.1-1.2L7.3 5.4c.1-.8.8-1.4 1.6-1.4h9.1c3.9 0 7 1.1 8 4 1 2.9-.1 5.9-2.5 7.6-1.5 1-3.6 1.4-6.3 1.4h-3.4c-.6 0-1.1.4-1.2 1l-2.1 9z"
                      fill="#FFFFFF"
                      fillOpacity="0.75"
                    />
                    <path
                      d="M14.2 27h-4.3c-.7 0-1.2-.5-1.1-1.2L11 8.2c.1-.8.8-1.4 1.6-1.4h7.5c3.5 0 6.2 1 7.1 3.6.8 2.6-.1 5.2-2.2 6.7-1.3.9-3.2 1.3-5.6 1.3h-3c-.6 0-1.1.4-1.2 1l-1 7.6z"
                      fill="#FFFFFF"
                    />
                  </svg>
                </div>
              )}

              {item.type === 'bitcoin' && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#fa961c] to-[#d67705]">
                  <svg className="w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.73 10.02c.45-.64.69-1.46.69-2.36 0-2.3-1.63-3.66-4.34-3.66H7.5V1.5h-2v2.5H4v2h1.5v12H4v2h1.5v2.5h2V20h4.29c3.27 0 5.21-1.69 5.21-4.24 0-1.62-.75-2.91-2.27-3.74zM9.5 6h1.58c1.61 0 2.54.76 2.54 2.01s-.93 2.01-2.54 2.01H9.5V6zm2.08 12H9.5v-4.32h2.08c1.88 0 2.92.83 2.92 2.16 0 1.34-1.04 2.16-2.92 2.16z" />
                  </svg>
                </div>
              )}

              {item.type === 'litecoin' && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#8f98a2] to-[#6a737f]">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full border-2 sm:border-[2.5px] border-white flex items-center justify-center shadow-sm">
                    <span className="text-white font-sans italic font-black text-xl sm:text-2xl md:text-3xl leading-none select-none -ml-0.5">
                      Ł
                    </span>
                  </div>
                </div>
              )}

              {item.type === 'visa' && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#1436cc] to-[#0a238f]">
                  <span className="text-white font-sans font-black italic tracking-wider text-lg sm:text-xl md:text-2xl select-none scale-y-95">
                    VISA
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  </section>


  {/* Testimonials Section */}
<section
  ref={testimonialsRef}
  className="relative py-10 sm:py-14 md:py-16 bg-[#141826] overflow-hidden"
>
  <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <style>{`
      @keyframes reviewScrollUp {
        0% { transform: translate3d(0, 0, 0); }
        100% { transform: translate3d(0, -50%, 0); }
      }
      @keyframes reviewScrollDown {
        0% { transform: translate3d(0, -50%, 0); }
        100% { transform: translate3d(0, 0, 0); }
      }
      .review-track-up {
        display: flex;
        flex-direction: column;
        animation: reviewScrollUp 42s linear infinite;
        will-change: transform;
      }
      .review-track-down {
        display: flex;
        flex-direction: column;
        animation: reviewScrollDown 46s linear infinite;
        will-change: transform;
      }
      .review-track-up:hover,
      .review-track-down:hover {
        animation-play-state: paused;
      }
    `}</style>

    {/* Header directly matching image.png */}
    <div className="max-w-3xl mx-auto mb-8 md:mb-10 text-center">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
        Real reviews from real
      </h2>
      <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#00D26A] tracking-tight mt-1 sm:mt-2">
        people like you.
      </p>
      <p className="text-slate-400 text-xs sm:text-sm mt-3 font-normal">
        Reviews are not verified by us
      </p>
    </div>

    {/* Reviews Vertical Showcase matching image.png */}
    <div className="relative h-[580px] sm:h-[660px] overflow-hidden">
      {/* Top and Bottom gradient fades */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 sm:h-32 z-20 bg-gradient-to-b from-[#141826] via-[#141826]/85 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 sm:h-32 z-20 bg-gradient-to-t from-[#141826] via-[#141826]/85 to-transparent" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 h-full">
        {/* Column 1 */}
        <div className="overflow-hidden">
          <div className="review-track-up space-y-4 sm:space-y-5 pb-5">
            {[
              // Set 1
              {
                id: 'c1-1',
                name: 'Marcus Thorne',
                platform: 'Google Play',
                date: 'July 18, 2026',
                avatarImg: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80',
                title: 'Congrats developers!',
                text: 'Finally a legitimate reward app that actually pays out without jumping through endless hoops. Clean experience so far!',
              },
              {
                id: 'c1-2',
                name: 'Donna Fairhurst Gardner',
                platform: 'Google Play',
                date: 'July 21, 2026',
                avatarImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80',
                text: 'I play games on my phone anyway so why not get paid to do so. I usually cash out for gift cards to buy something special not in my budget.',
              },
              {
                id: 'c1-3',
                name: 'Michael Fox',
                platform: 'Google Play',
                date: 'July 9, 2026',
                avatarImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
                text: 'honest, easy to use, check your email when getting a payout, as long as your patient you can get a few bucks. perhaps more if your lucky',
              },
              {
                id: 'c1-4',
                name: 'Bri How',
                platform: 'App Store',
                date: 'July 28, 2026',
                initial: 'B',
                text: 'Super easy cashouts and great customer support whenever I had a question. Very smooth process!',
              },
              // Set 2 (for infinite loop)
              {
                id: 'c1-dup-1',
                name: 'Marcus Thorne',
                platform: 'Google Play',
                date: 'July 18, 2026',
                avatarImg: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80',
                title: 'Congrats developers!',
                text: 'Finally a legitimate reward app that actually pays out without jumping through endless hoops. Clean experience so far!',
              },
              {
                id: 'c1-dup-2',
                name: 'Donna Fairhurst Gardner',
                platform: 'Google Play',
                date: 'July 21, 2026',
                avatarImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80',
                text: 'I play games on my phone anyway so why not get paid to do so. I usually cash out for gift cards to buy something special not in my budget.',
              },
              {
                id: 'c1-dup-3',
                name: 'Michael Fox',
                platform: 'Google Play',
                date: 'July 9, 2026',
                avatarImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
                text: 'honest, easy to use, check your email when getting a payout, as long as your patient you can get a few bucks. perhaps more if your lucky',
              },
              {
                id: 'c1-dup-4',
                name: 'Bri How',
                platform: 'App Store',
                date: 'July 28, 2026',
                initial: 'B',
                text: 'Super easy cashouts and great customer support whenever I had a question. Very smooth process!',
              },
            ].map((review) => (
              <div
                key={review.id}
                className="bg-[#171c2b] border border-white/[0.08] hover:border-emerald-500/30 rounded-2xl p-5 sm:p-6 text-left transition-all duration-300 shadow-xl shadow-black/20 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {review.avatarImg && review.avatarImg.trim() !== '' ? (
                      <img
                        src={review.avatarImg}
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#0b3323] text-[#00D26A] font-bold text-sm flex items-center justify-center border border-emerald-500/30 shrink-0">
                        {review.initial}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white leading-snug truncate">{review.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{review.platform} · {review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-emerald-400 shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star text-[11px]" />
                    ))}
                  </div>
                </div>
                {review.title && (
                  <h5 className="text-sm font-bold text-white mb-1.5">{review.title}</h5>
                )}
                <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-normal">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 */}
        <div className="overflow-hidden hidden md:block">
          <div className="review-track-down space-y-4 sm:space-y-5 pb-5">
            {[
              // Set 1
              {
                id: 'c2-1',
                name: 'Jonathan Vance',
                platform: 'Google Play',
                date: 'July 15, 2026',
                initial: 'J',
                text: "it won't make you a millionaire but builds small amounts nicely. Pays out promptly. I save up to get things I want from Amazon while enjoying a few games in my spare time.",
              },
              {
                id: 'c2-2',
                name: 'Stephanie Hodges',
                platform: 'Google Play',
                date: 'July 22, 2026',
                avatarImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80',
                text: 'fun games that you play anyway. might as well make a little change',
              },
              {
                id: 'c2-3',
                name: 'Exciting716',
                platform: 'App Store',
                date: 'July 28, 2026',
                initial: 'E',
                title: 'Awesome',
                text: "I've been using this app for about 4 months. While it's not making me a millionaire, but it does help with the little expenses throughout the month. If your one to unwind and play games, why not",
              },
              {
                id: 'c2-4',
                name: 'Sarah Jenkins',
                platform: 'Google Play',
                date: 'August 2, 2026',
                avatarImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
                text: 'Hands down the cleanest interface out of any GPT platform. Instant crypto cashouts right to my wallet with no delay!',
              },
              // Set 2 (for infinite loop)
              {
                id: 'c2-dup-1',
                name: 'Jonathan Vance',
                platform: 'Google Play',
                date: 'July 15, 2026',
                initial: 'J',
                text: "it won't make you a millionaire but builds small amounts nicely. Pays out promptly. I save up to get things I want from Amazon while enjoying a few games in my spare time.",
              },
              {
                id: 'c2-dup-2',
                name: 'Stephanie Hodges',
                platform: 'Google Play',
                date: 'July 22, 2026',
                avatarImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80',
                text: 'fun games that you play anyway. might as well make a little change',
              },
              {
                id: 'c2-dup-3',
                name: 'Exciting716',
                platform: 'App Store',
                date: 'July 28, 2026',
                initial: 'E',
                title: 'Awesome',
                text: "I've been using this app for about 4 months. While it's not making me a millionaire, but it does help with the little expenses throughout the month. If your one to unwind and play games, why not",
              },
              {
                id: 'c2-dup-4',
                name: 'Sarah Jenkins',
                platform: 'Google Play',
                date: 'August 2, 2026',
                avatarImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
                text: 'Hands down the cleanest interface out of any GPT platform. Instant crypto cashouts right to my wallet with no delay!',
              },
            ].map((review) => (
              <div
                key={review.id}
                className="bg-[#171c2b] border border-white/[0.08] hover:border-emerald-500/30 rounded-2xl p-5 sm:p-6 text-left transition-all duration-300 shadow-xl shadow-black/20 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {review.avatarImg && review.avatarImg.trim() !== '' ? (
                      <img
                        src={review.avatarImg}
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#0b3323] text-[#00D26A] font-bold text-sm flex items-center justify-center border border-emerald-500/30 shrink-0">
                        {review.initial}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white leading-snug truncate">{review.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{review.platform} · {review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-emerald-400 shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star text-[11px]" />
                    ))}
                  </div>
                </div>
                {review.title && (
                  <h5 className="text-sm font-bold text-white mb-1.5">{review.title}</h5>
                )}
                <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-normal">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3 */}
        <div className="overflow-hidden hidden lg:block">
          <div className="review-track-up space-y-4 sm:space-y-5 pb-5">
            {[
              // Set 1
              {
                id: 'c3-1',
                name: 'Tyler Vance',
                platform: 'App Store',
                date: 'July 12, 2026',
                initial: 'T',
                text: 'Fastest payouts in the industry. Tried almost every platform out there and this one is the real deal. Check it out!',
              },
              {
                id: 'c3-2',
                name: 'Dunes Chick',
                platform: 'Google Play',
                date: 'July 24, 2026',
                initial: 'D',
                text: 'love this app, payouts, rewards and the games are much better than the other reward apps I’ve tried. highly recommended! 5 stars',
              },
              {
                id: 'c3-3',
                name: "Benny's Stuff",
                platform: 'App Store',
                date: 'July 29, 2026',
                initial: 'B',
                title: 'Awesome',
                text: 'Love how it keeps track of your daily quests and win actual money!! The games they promote are awesome also!!',
              },
              {
                id: 'c3-4',
                name: 'Elena Rostova',
                platform: 'Google Play',
                date: 'July 30, 2026',
                avatarImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100&q=80',
                text: 'Earned $45 in my first week playing puzzle games during commute. PayPal withdrawal was verified in minutes!',
              },
              // Set 2 (for infinite loop)
              {
                id: 'c3-dup-1',
                name: 'Tyler Vance',
                platform: 'App Store',
                date: 'July 12, 2026',
                initial: 'T',
                text: 'Fastest payouts in the industry. Tried almost every platform out there and this one is the real deal. Check it out!',
              },
              {
                id: 'c3-dup-2',
                name: 'Dunes Chick',
                platform: 'Google Play',
                date: 'July 24, 2026',
                initial: 'D',
                text: 'love this app, payouts, rewards and the games are much better than the other reward apps I’ve tried. highly recommended! 5 stars',
              },
              {
                id: 'c3-dup-3',
                name: "Benny's Stuff",
                platform: 'App Store',
                date: 'July 29, 2026',
                initial: 'B',
                title: 'Awesome',
                text: 'Love how it keeps track of your daily quests and win actual money!! The games they promote are awesome also!!',
              },
              {
                id: 'c3-dup-4',
                name: 'Elena Rostova',
                platform: 'Google Play',
                date: 'July 30, 2026',
                avatarImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100&q=80',
                text: 'Earned $45 in my first week playing puzzle games during commute. PayPal withdrawal was verified in minutes!',
              },
            ].map((review) => (
              <div
                key={review.id}
                className="bg-[#171c2b] border border-white/[0.08] hover:border-emerald-500/30 rounded-2xl p-5 sm:p-6 text-left transition-all duration-300 shadow-xl shadow-black/20 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {review.avatarImg && review.avatarImg.trim() !== '' ? (
                      <img
                        src={review.avatarImg}
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#0b3323] text-[#00D26A] font-bold text-sm flex items-center justify-center border border-emerald-500/30 shrink-0">
                        {review.initial}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white leading-snug truncate">{review.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{review.platform} · {review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-emerald-400 shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star text-[11px]" />
                    ))}
                  </div>
                </div>
                {review.title && (
                  <h5 className="text-sm font-bold text-white mb-1.5">{review.title}</h5>
                )}
                <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-normal">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


        {/* FAQ Section */}
<section
  ref={faqRef}
  className={`relative py-8 sm:py-10 md:py-12 bg-[#141826] overflow-hidden transition-opacity duration-1000 ${
    isFaqInView ? "opacity-100" : "opacity-0"
  }`}
>
  <div className="container relative mx-auto px-8 max-w-4xl">
    {/* header */}
    <div className="text-center mb-6 sm:mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Support
          </span>
        </div>
      </div>

      <h2 className="text-4xl font-bold text-white mb-3">
        Your RewardGrip Questions Answered
      </h2>

      <p className="text-center text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
        Quick answers about getting started, payouts, and staying secure. Our team keeps
        this list fresh so you can focus on earning.
      </p>
    </div>

    {/* accordion */}
    <div className="rounded-2xl border border-white/10 bg-[#1a1f2e] shadow-lg divide-y divide-white/10">
      {FAQ_ITEMS.map((item, i) => (
        <FaqAccordionItem key={i} item={item} />
      ))}
    </div>
  </div>
</section>

        <LiveCashoutsSection />
    </div>
  );
};

export default HomePageContent;
