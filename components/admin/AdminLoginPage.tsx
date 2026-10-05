import React, { useState } from 'react';
import { API_URL } from '../../constants';

interface AdminLoginPageProps {
    onLoginSuccess: () => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            let succeeded = false;
            let token = '';

            // 1. Try backend API if configured
            if (API_URL && API_URL.trim() !== '') {
                try {
                    const response = await fetch(`${API_URL}/api/auth/admin-login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email.trim(), password }),
                    });
                    const contentType = response.headers.get('content-type') || '';
                    if (response.ok && contentType.includes('application/json')) {
                        const data = await response.json();
                        if (data.token) {
                            token = data.token;
                            succeeded = true;
                        }
                    }
                } catch (apiErr) {
                    console.warn('[AdminLogin] Backend API unavailable, trying local check:', apiErr);
                }
            }

            // 2. Direct fallback (standard admin credentials)
            if (!succeeded) {
                const normalizedEmail = email.trim().toLowerCase();
                if (normalizedEmail === 'raihansarker270@gmail.com' && password === 'Wh1@Wh1@') {
                    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
                    const payload = btoa(JSON.stringify({
                        id: 1,
                        email: normalizedEmail,
                        role: 'admin',
                        exp: Math.floor(Date.now() / 1000) + 86400 * 7
                    }));
                    token = `${header}.${payload}.admin_verified_session`;
                    succeeded = true;
                }
            }

            if (succeeded && token) {
                localStorage.setItem('token', token);
                onLoginSuccess();
            } else {
                setError('Invalid email or password.');
            }
        } catch (err: any) {
            setError(err?.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
                <div>
                    <h2 className="text-3xl font-bold text-center text-slate-900">Admin Panel</h2>
                    <p className="text-center text-slate-500 mt-2">Sign in to your account</p>
                </div>
                <div className="text-center text-sm bg-blue-50 p-3 rounded-md text-slate-600 border border-blue-200">
                    <p className="font-semibold text-blue-800">Demo Credentials</p>
                    <p>Email: <strong className="font-mono text-slate-800">raihansarker270@gmail.com</strong></p>
                    <p>Password: <strong className="font-mono text-slate-800">Wh1@Wh1@</strong></p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-slate-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                            placeholder="••••••••"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 disabled:bg-slate-500 disabled:cursor-wait"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
            <p className="mt-6 text-center text-sm text-slate-500">
                &copy; {new Date().getFullYear()} RewardGrip.com. All rights reserved.
            </p>
        </div>
    );
};

export default AdminLoginPage;