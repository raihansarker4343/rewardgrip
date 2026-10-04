import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import type { User } from '../types';
import { API_URL } from '../constants';
import { authService } from '../services/authService';

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
    return user;
};

const ProfileEditModal: React.FC = () => {
    const { user, setUser, isProfileEditModalOpen, setIsProfileEditModalOpen } = useContext(AppContext);
    
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    // --- নতুন স্টেটসমূহ ---
    const [gender, setGender] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [dob, setDob] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    useEffect(() => {
        if (user && isProfileEditModalOpen) {
            setUsername(user.username);
            setAvatarUrl(user.avatarUrl || '');
            // ইউজার ডাটা থেকে মানগুলো লোড করা
            // @ts-ignore
            setGender(user.gender || '');
            // @ts-ignore
            setZipCode(user.zip_code || '');
            // @ts-ignore
            setDob(user.dob ? new Date(user.dob).toISOString().split('T')[0] : '');
        }
    }, [user, isProfileEditModalOpen]);

    const closeModal = () => {
        setIsProfileEditModalOpen(false);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!token && !user?.id) {
            setError('Authentication error. Please log in again.');
            setIsLoading(false);
            return;
        }

        try {
            // 1. Save directly into Supabase database
            let dbUpdatedUser: User | undefined;
            if (user?.id) {
                const res = await authService.updateProfile(user.id, {
                    username: username.trim(),
                    avatarUrl: avatarUrl.trim(),
                    gender: gender.trim(),
                    zip_code: zipCode.trim(),
                    dob: dob.trim(),
                });
                if (res.user) {
                    dbUpdatedUser = res.user;
                }
            }

            // 2. Also try backend API route if configured
            let apiData: any = null;
            if (API_URL && API_URL.trim() !== '') {
                try {
                    const response = await fetch(`${API_URL}/api/user/profile`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ 
                            username: username.trim(), 
                            avatarUrl: avatarUrl.trim(), 
                            gender: gender.trim(), 
                            zip_code: zipCode.trim(), 
                            dob: dob.trim() 
                        })
                    });
                    const contentType = response.headers.get('content-type') || '';
                    if (contentType.includes('application/json')) {
                        apiData = await response.json().catch(() => null);
                    }
                } catch (_) {}
            }
            
            const updatedUser: User = {
                ...user!,
                ...(dbUpdatedUser || {}),
                username: username.trim(),
                avatar: avatarUrl.trim() || user!.avatar,
                avatarUrl: avatarUrl.trim() || user!.avatarUrl,
                gender: gender.trim(),
                zipCode: zipCode.trim(),
                zip_code: zipCode.trim(),
                dob: dob.trim(),
                ...(apiData && typeof apiData === 'object' ? apiData : {})
            };
            
            const sanitizedData = sanitizeUser(updatedUser);
            setUser(sanitizedData); 
            localStorage.setItem('user', JSON.stringify(sanitizedData));
            closeModal();

        } catch (err: any) {
            console.error('Profile update error:', err);
            // Fallback: apply local update so user experience is smooth
            const updatedUser: User = {
                ...user!,
                username: username.trim(),
                avatar: avatarUrl.trim() || user!.avatar,
                avatarUrl: avatarUrl.trim() || user!.avatarUrl,
                gender: gender.trim(),
                zipCode: zipCode.trim(),
                zip_code: zipCode.trim(),
                dob: dob.trim()
            };
            const sanitizedData = sanitizeUser(updatedUser);
            setUser(sanitizedData); 
            localStorage.setItem('user', JSON.stringify(sanitizedData));
            closeModal();
        } finally {
            setIsLoading(false);
        }
    };

    if (!isProfileEditModalOpen) return null;

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out bg-[#0F172A]/80 backdrop-blur-sm"
            onClick={closeModal}
        >
            <div 
                className="bg-white dark:bg-[#141c2f] text-slate-800 dark:text-slate-200 p-8 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full m-4 overflow-y-auto max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="relative text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Profile</h2>
                    <button onClick={closeModal} className="absolute -top-4 -right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center">
                        &times;
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 bg-red-500/10 p-3 rounded-lg text-sm text-center">{error}</p>}
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full bg-slate-100 dark:bg-[#1e293b] p-3 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Gender Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Gender</label>
                        <select 
                            value={gender} 
                            onChange={(e) => setGender(e.target.value)} 
                            className="w-full bg-slate-100 dark:bg-[#1e293b] p-3 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Gender</option>
                            <option value="m">Male</option>
                            <option value="f">Female</option>
                        </select>
                    </div>

                    {/* Zip Code */}
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Zip Code</label>
                        <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="e.g. 1200" className="w-full bg-slate-100 dark:bg-[#1e293b] p-3 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Date of Birth</label>
                        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full bg-slate-100 dark:bg-[#1e293b] p-3 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Avatar URL</label>
                        <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://example.com/image.png" className="w-full bg-slate-100 dark:bg-[#1e293b] p-3 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    
                    <div className="flex items-center gap-4 pt-4">
                        <button type="button" onClick={closeModal} className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-3 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-slate-500 disabled:cursor-wait">
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditModal;
