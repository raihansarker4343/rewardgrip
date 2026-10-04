
import React, { useContext } from 'react';
import { AppContext } from '../App';
import BrandLogo from './BrandLogo';

const Footer: React.FC = () => {
    const { setCurrentPage, isLoggedIn, currentPage } = useContext(AppContext);
    const isPublicHomepage = !isLoggedIn && currentPage === 'Home';

    const handleNavClick = (e: React.MouseEvent, pageName: string) => {
        e.preventDefault();
        setCurrentPage(pageName);
    };

    return (
        <footer className={`relative py-12 ${
            isPublicHomepage
                ? 'bg-[#141826] border-t border-white/10 text-slate-400'
                : 'bg-white/70 dark:bg-[#0f1729]/80 backdrop-blur-2xl border-t border-white/20 dark:border-white/5 text-slate-600 dark:text-slate-400 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.05)]'
        }`}>
            <div className="container mx-auto px-8 relative z-10">
                <div className="flex flex-wrap justify-between items-start gap-8">
                    <div className="space-y-4">
                        <BrandLogo onClick={() => setCurrentPage('Home')} />
                         <div className="flex items-center space-x-2">
                            <button className="px-3 py-2 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-300 flex items-center space-x-2 hover:bg-white/80 dark:hover:bg-white/10 transition-all backdrop-blur-sm">
                                <span className="font-serif text-lg">A</span>
                                <span>English</span>
                            </button>
                        </div>
                        <div className="p-3 bg-slate-100/50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-xl flex items-center justify-between text-sm w-full max-w-xs backdrop-blur-sm">
                            <span className="text-slate-700 dark:text-slate-300 font-medium">Excellent</span>
                            <div className="flex items-center ml-2 gap-0.5">
                                {[...Array(4)].map((_, i) => <i key={i} className="fas fa-star text-amber-400 text-xs"></i>)}
                                <i className="fas fa-star-half-alt text-amber-400 text-xs"></i>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
                        <div>
                            <h4 className={`font-bold mb-4 ${isPublicHomepage ? 'text-white' : 'text-slate-900 dark:text-white'}`}>Menu</h4>
                            <ul className="space-y-2">
                                <li><a href="/Home" onClick={(e) => handleNavClick(e, 'Home')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</a></li>
                                <li><a href="/Offer" onClick={(e) => handleNavClick(e, 'Offer')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Offer</a></li>
                                <li><a href="/Tasks" onClick={(e) => handleNavClick(e, 'Tasks')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Tasks</a></li>
                                <li><a href="/Surveys" onClick={(e) => handleNavClick(e, 'Surveys')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Surveys</a></li>
                                <li><a href="/Referrals" onClick={(e) => handleNavClick(e, 'Referrals')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Affiliates</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className={`font-bold mb-4 ${isPublicHomepage ? 'text-white' : 'text-slate-900 dark:text-white'}`}>Games</h4>
                            <ul className="space-y-2">
                                <li><a href="/Boxes" onClick={(e) => handleNavClick(e, 'Boxes')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Boxes</a></li>
                                <li><a href="/Battles" onClick={(e) => handleNavClick(e, 'Battles')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Battles</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className={`font-bold mb-4 ${isPublicHomepage ? 'text-white' : 'text-slate-900 dark:text-white'}`}>About</h4>
                            <ul className="space-y-2">
                                <li><a href="/Blog" onClick={(e) => handleNavClick(e, 'Blog')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Blog</a></li>
                                <li><a href="/Guides" onClick={(e) => handleNavClick(e, 'Guides')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Guides</a></li>
                                <li><a href="/TermsofService" onClick={(e) => handleNavClick(e, 'Terms of Service')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                                <li><a href="/PrivacyPolicy" onClick={(e) => handleNavClick(e, 'Privacy Policy')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="/CookiePolicy" onClick={(e) => handleNavClick(e, 'Cookie Policy')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Cookie Policy</a></li>
                                <li><a href="/AMLKYCPolicy" onClick={(e) => handleNavClick(e, 'AML & KYC Policy')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">AML & KYC Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className={`font-bold mb-4 ${isPublicHomepage ? 'text-white' : 'text-slate-900 dark:text-white'}`}>Help</h4>
                            <ul className="space-y-2">
                                <li><a href="/FrequentlyAsked" onClick={(e) => handleNavClick(e, 'Frequently Asked')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Frequently Asked</a></li>
                                <li><a href="/HelpDesk" onClick={(e) => handleNavClick(e, 'Help Desk')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Help Desk</a></li>
                                <li><a href="/Support" onClick={(e) => handleNavClick(e, 'Support')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Support</a></li>
                                <li><a href="/Fairness" onClick={(e) => handleNavClick(e, 'Fairness')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Fairness</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center text-slate-500 dark:text-slate-400 text-sm">
                    <p className="mb-4 sm:mb-0">&copy; {new Date().getFullYear()} RewardGrip.com &bull; All rights reserved</p>
                    <div className="flex space-x-6 text-lg">
                        <a href="#" aria-label="Discord" className="text-slate-400 hover:text-[#5865F2] transition-colors hover:scale-110 transform duration-200"><i className="fab fa-discord"></i></a>
                        <a href="#" aria-label="Twitter" className="text-slate-400 hover:text-[#1DA1F2] transition-colors hover:scale-110 transform duration-200"><i className="fab fa-twitter"></i></a>
                        <a href="#" aria-label="TikTok" className="text-slate-400 hover:text-[#000000] dark:hover:text-white transition-colors hover:scale-110 transform duration-200"><i className="fab fa-tiktok"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
