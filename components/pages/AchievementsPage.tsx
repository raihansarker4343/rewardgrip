import React, { useState } from 'react';
import { ACHIEVEMENTS_DATA } from '../../constants';
import type { Achievement } from '../../types';

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const [isClaimed, setIsClaimed] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    
    const isCompleted = achievement.progress >= achievement.goal;
    const percentage = isCompleted ? 100 : Math.round((achievement.progress / achievement.goal) * 100);

    const handleClaim = () => {
        setIsClaimed(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000); // Hide confetti after animation
    };

    return (
        <div className={`relative bg-white dark:bg-[#1e293b] p-6 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-start gap-4 transition-all ${isCompleted && !isClaimed ? 'hover:-translate-y-1' : ''} ${(isCompleted && isClaimed) ? 'opacity-50' : ''}`}>
            {showConfetti && (
                <div className="confetti">
                    {[...Array(13)].map((_, i) => <div key={i} className="confetti-piece"></div>)}
                </div>
            )}
            <div className={`text-3xl ${isCompleted ? 'text-green-500' : 'text-blue-500 dark:text-blue-400'}`}>
                <i className={achievement.icon}></i>
            </div>
            <div className="flex-1 w-full">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{achievement.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{achievement.description}</p>
                <div className="mt-4">
                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress.toLocaleString()} / {achievement.goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all duration-500 ease-out ${isCompleted ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${percentage}%` }}></div>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-between items-center mt-2">
                <span className="text-sm font-semibold text-yellow-500 dark:text-yellow-400">+{achievement.xp} XP</span>
                 {isCompleted && !isClaimed && (
                    <button onClick={handleClaim} className="bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-green-600 transition-transform active:scale-95">
                        Claim Reward
                    </button>
                )}
                {isCompleted && isClaimed && (
                    <span className="text-sm font-semibold bg-slate-500/20 text-slate-500 px-2 py-1 rounded-md">Claimed</span>
                )}
            </div>
        </div>
    );
};


const AchievementsPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Achievements</h1>
                <p className="text-slate-500 dark:text-slate-400">Complete achievements to earn XP and level up your account.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ACHIEVEMENTS_DATA.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
            </div>
        </div>
    );
};

export default AchievementsPage;