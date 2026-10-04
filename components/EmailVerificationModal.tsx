import React, { useEffect, useState } from 'react';
import { API_URL } from '../constants';

interface EmailVerificationModalProps {
    isOpen: boolean;
    email: string;
    onClose: () => void;
    onVerified: (token: string) => Promise<void>;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({ isOpen, email, onClose, onVerified }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            setError('');
            setInfo('');
            setOtp('');
        }
    }, [isOpen]);

    const handleTransitionEnd = () => {
        if (!isOpen) {
            setIsRendered(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setInfo('');
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });
            const contentType = response.headers.get('content-type') || '';
            const data = (contentType.includes('application/json')) ? await response.json().catch(() => ({})) : {};

            if (response.ok) {
                setInfo('Verification successful! Redirecting...');
                await onVerified(data.token);
            } else {
                setError(data.message || 'Invalid or expired verification code.');
            }
        } catch (err) {
            setError('Could not verify right now. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setInfo('');
        setIsResending(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const contentType = response.headers.get('content-type') || '';
            const data = (contentType.includes('application/json')) ? await response.json().catch(() => ({})) : {};

            if (response.ok) {
                setInfo(data.message || 'Verification code resent.');
            } else {
                setError(data.message || 'Could not resend the verification code.');
            }
        } catch (err) {
            setError('Could not resend right now. Please try again later.');
        } finally {
            setIsResending(false);
        }
    };

    if (!isRendered) {
        return null;
    }

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
            onTransitionEnd={handleTransitionEnd}
            aria-modal="true"
            role="dialog"
        >
            <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm"></div>
            <div
                className={`bg-gradient-to-br from-[#052e25] via-[#102a3a] to-[#1e293b] text-white p-8 rounded-xl shadow-2xl border border-slate-700 max-w-md w-full m-4 transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="relative text-center mb-6">
                    <h2 className="text-3xl font-bold">Verify your email</h2>
                    <p className="text-slate-300 mt-2 text-sm">We emailed a 6-digit code to <span className="font-semibold">{email}</span>.</p>
                    <button
                        onClick={onClose}
                        className="absolute -top-4 -right-4 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border-l-4 border-red-500 text-red-200 p-4 text-sm flex items-start gap-3" role="alert">
                            <i className="fas fa-exclamation-circle flex-shrink-0 text-red-400 mt-0.5"></i>
                            <span className="text-left">{error}</span>
                        </div>
                    )}
                    {info && !error && (
                        <div className="bg-green-500/10 border-l-4 border-green-500 text-green-200 p-4 text-sm flex items-start gap-3" role="status">
                            <i className="fas fa-check-circle flex-shrink-0 text-green-400 mt-0.5"></i>
                            <span className="text-left">{info}</span>
                        </div>
                    )}

                    <div>
                        <label htmlFor="verification-code" className="block text-sm font-medium text-slate-300 mb-2">Verification code</label>
                        <div className="relative">
                            <i className="fas fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input
                                type="text"
                                id="verification-code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Enter 6-digit code"
                                required
                                inputMode="numeric"
                                className="w-full bg-[#334155] text-white p-3 pl-12 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-slate-400 tracking-widest"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || otp.length < 6}
                        className="w-full bg-[#22c55e] hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-slate-500 disabled:cursor-wait"
                    >
                        {isSubmitting ? 'Verifying...' : 'Verify and continue'}
                    </button>

                    <button
                        type="button"
                        disabled={isResending}
                        onClick={handleResend}
                        className="w-full text-sm text-green-400 hover:underline font-semibold"
                    >
                        {isResending ? 'Sending new code...' : 'Resend code'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmailVerificationModal;
