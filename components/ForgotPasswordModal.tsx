import React, { useEffect, useState } from 'react';
import { API_URL } from '../constants';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToSignin: () => void;
    onSwitchToReset: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, onSwitchToSignin, onSwitchToReset }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            setError('');
            setSuccessMessage('');
        }
    }, [isOpen]);

    const handleTransitionEnd = () => {
        if (!isOpen) {
            setIsRendered(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const contentType = response.headers.get('content-type') || '';
            const data = (contentType.includes('application/json')) ? await response.json().catch(() => ({})) : {};
            if (response.ok) {
                setSuccessMessage(data.message || 'If an account exists for this email, a reset link has been sent.');
            } else {
                setError(data.message || 'If an account exists for this email, a reset link has been sent.');
            }
        } catch (err) {
            setSuccessMessage('If an account exists for this email, a reset link has been sent.');
        } finally {
            setIsLoading(false);
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
                className={`bg-gradient-to-br from-[#052e25] via-[#102a3a] to-[#1e293b] text-white p-8 rounded-xl shadow-2xl border border-slate-700 max-w-sm w-full m-4 transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="relative text-center mb-6">
                    <h2 className="text-3xl font-bold">Forgot Password</h2>
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
                    {successMessage && (
                        <div className="bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-200 p-4 text-sm flex items-start gap-3" role="status">
                            <i className="fas fa-check-circle flex-shrink-0 text-emerald-400 mt-0.5"></i>
                            <span className="text-left">{successMessage}</span>
                        </div>
                    )}
                    <div>
                        <label htmlFor="modal-forgot-email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <div className="relative">
                            <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input
                                type="email"
                                id="modal-forgot-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Type here..."
                                required
                                className="w-full bg-[#334155] text-white p-3 pl-12 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#22c55e] hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors !mt-6 disabled:bg-slate-500 disabled:cursor-wait"
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-slate-400 gap-2 !mt-4">
                        <button type="button" onClick={onSwitchToSignin} className="text-green-400 hover:underline font-semibold">Back to sign in</button>
                        <button type="button" onClick={onSwitchToReset} className="text-slate-300 hover:underline">Have a reset code already?</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
