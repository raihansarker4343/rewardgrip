import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { API_URL } from '../constants';
import { authService } from '../services/authService';

interface SigninModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToSignup: () => void;
    onForgotPassword: () => void;
    onRequireVerification: (email: string) => void;
}

const SigninModal: React.FC<SigninModalProps> = ({
    isOpen,
    onClose,
    onSwitchToSignup,
    onForgotPassword,
    onRequireVerification,
}) => {
    const { handleLogin } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isRendered, setIsRendered] = useState(false);
    const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | 'apple' | null>(null);

    const handleSocialAuth = async (provider: 'google' | 'facebook' | 'apple') => {
        try {
            setSocialLoading(provider);
            setError('');
            const result = await authService.signInWithSocial(provider);
            if (result.ok) {
                if (result.token) {
                    if (result.user) {
                        localStorage.setItem('user', JSON.stringify(result.user));
                    }
                    handleLogin(result.token);
                    onClose();
                }
            } else {
                setError(result.message || 'Failed to authenticate with social provider.');
            }
        } catch (err: any) {
            setError(err?.message || 'Social authentication error.');
        } finally {
            setSocialLoading(null);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            setError('');
        }
    }, [isOpen]);

    const handleTransitionEnd = () => {
        if (!isOpen) {
            setIsRendered(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const result = await authService.signIn(email, password);
            if (result.ok && result.token) {
                if (result.user) {
                    localStorage.setItem('user', JSON.stringify(result.user));
                }
                handleLogin(result.token);
            } else {
                if (result.requiresVerification) {
                    onRequireVerification(email);
                    setError(result.message || 'Please verify your email to continue.');
                    onClose();
                    return;
                }
                setError(result.message || 'Invalid email or password.');
            }
        } catch (err: any) {
            setError(err?.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isRendered) {
        return null;
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ease-out ${
                isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={onClose}
            onTransitionEnd={handleTransitionEnd}
            aria-modal="true"
            role="dialog"
        >
            {/* Backdrop with luxury frosted blur */}
            <div className="absolute inset-0 bg-[#070a13]/80 backdrop-blur-md transition-opacity duration-300" />

            {/* Modal Card */}
            <div
                className={`relative w-full max-w-md bg-gradient-to-b from-[#171e30] via-[#121726] to-[#0d121f] text-white rounded-3xl border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.85)] p-6 sm:p-8 transform transition-all duration-300 ease-out overflow-hidden ${
                    isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Glowing Top Ambient Accent Bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-[#00D26A] to-teal-400" />

                {/* Ambient Soft Glow Orbs */}
                <div className="absolute -top-20 -right-20 w-52 h-52 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 z-10"
                    aria-label="Close modal"
                >
                    <i className="fas fa-times text-xs" />
                </button>

                {/* Brand & Title Header */}
                <div className="text-center mb-6 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00D26A] to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 mx-auto mb-3">
                        <i className="fas fa-bolt text-lg" />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Welcome Back</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        Sign In to <span className="bg-gradient-to-r from-[#00D26A] via-emerald-400 to-teal-300 bg-clip-text text-transparent">RewardGrip</span>
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                        Access your earnings, survey tasks, and instant withdrawals.
                    </p>
                </div>

                {/* Modern Switcher Tabs */}
                <div className="grid grid-cols-2 p-1 rounded-xl bg-[#090d17]/80 border border-white/5 mb-6 text-xs font-bold">
                    <button
                        type="button"
                        className="py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={onSwitchToSignup}
                        className="py-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        Create Account
                    </button>
                </div>

                {/* Social Sign In with Google, Facebook, Apple */}
                <div className="space-y-2 mb-4 relative z-10">
                    <button
                        type="button"
                        disabled={socialLoading !== null}
                        onClick={() => handleSocialAuth('google')}
                        className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all text-xs shadow-sm active:scale-[0.99] cursor-pointer disabled:opacity-60"
                    >
                        {socialLoading === 'google' ? (
                            <i className="fas fa-circle-notch fa-spin text-slate-700 text-xs" />
                        ) : (
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                                alt="Google"
                                className="w-3.5 h-3.5"
                            />
                        )}
                        <span>Sign In with Google</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            disabled={socialLoading !== null}
                            onClick={() => handleSocialAuth('facebook')}
                            className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors text-xs active:scale-[0.99] cursor-pointer disabled:opacity-60"
                        >
                            {socialLoading === 'facebook' ? (
                                <i className="fas fa-circle-notch fa-spin text-white text-xs" />
                            ) : (
                                <i className="fab fa-facebook-f text-xs" />
                            )}
                            <span>Facebook</span>
                        </button>
                        <button
                            type="button"
                            disabled={socialLoading !== null}
                            onClick={() => handleSocialAuth('apple')}
                            className="w-full bg-[#16181f] hover:bg-black text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors text-xs border border-white/10 active:scale-[0.99] cursor-pointer disabled:opacity-60"
                        >
                            {socialLoading === 'apple' ? (
                                <i className="fas fa-circle-notch fa-spin text-white text-xs" />
                            ) : (
                                <i className="fab fa-apple text-sm" />
                            )}
                            <span>Apple</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center my-3.5 relative z-10">
                    <hr className="flex-grow border-slate-700/60" />
                    <span className="mx-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider">OR</span>
                    <hr className="flex-grow border-slate-700/60" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    {error && (
                        <div
                            className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-xl text-xs flex items-start gap-2.5 animate-fadeIn"
                            role="alert"
                        >
                            <i className="fas fa-exclamation-circle text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{error}</span>
                        </div>
                    )}

                    {/* Email Input */}
                    <div>
                        <label
                            htmlFor="modal-signin-email"
                            className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5"
                        >
                            Email Address
                        </label>
                        <div className="relative flex items-center bg-[#090d17]/90 border border-white/10 rounded-xl focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                            <div className="pl-3.5 text-slate-400">
                                <i className="fas fa-envelope text-xs" />
                            </div>
                            <input
                                type="email"
                                id="modal-signin-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                                className="w-full bg-transparent text-white px-3 py-3 text-sm placeholder:text-slate-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label
                                htmlFor="modal-signin-password"
                                className="block text-[11px] font-bold uppercase tracking-wider text-slate-400"
                            >
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={onForgotPassword}
                                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                            >
                                Forgot password?
                            </button>
                        </div>
                        <div className="relative flex items-center bg-[#090d17]/90 border border-white/10 rounded-xl focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                            <div className="pl-3.5 text-slate-400">
                                <i className="fas fa-lock text-xs" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="modal-signin-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full bg-transparent text-white px-3 py-3 text-sm placeholder:text-slate-500 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="pr-3.5 text-slate-400 hover:text-white transition-colors"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`} />
                            </button>
                        </div>
                    </div>

                    {/* Submit CTA Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00D26A] to-emerald-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <i className="fas fa-circle-notch fa-spin text-sm" />
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <i className="fas fa-arrow-right text-xs" />
                            </>
                        )}
                    </button>

                    {/* Bottom Switch Link */}
                    <p className="text-xs text-slate-400 text-center pt-2">
                        Don&apos;t have an account?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToSignup}
                            className="text-[#00D26A] hover:text-emerald-300 font-bold hover:underline"
                        >
                            Sign up for free
                        </button>
                    </p>

                    {/* Trust Security Footer */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-medium">
                        <i className="fas fa-shield-check text-emerald-400" />
                        <span>256-bit SSL Encrypted &bull; Instant Verified Payouts</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SigninModal;
