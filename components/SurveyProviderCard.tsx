import React from 'react';
import type { SurveyProvider } from '../types';
import { LockIcon } from './icons/SurveyIcons';
import StarRating from './StarRating';

const SurveyProviderCard: React.FC<{ provider: SurveyProvider }> = ({ provider }) => {
    
    const gradients: { [key: string]: string } = {
        'BitLabs': 'from-blue-900/40 to-slate-900/10',
        'CPX Research': 'from-cyan-900/40 to-slate-900/10',
        'Your-Surveys': 'from-green-900/40 to-slate-900/10',
        'Pollfish': 'from-red-900/40 to-slate-900/10',
        'Prime Surveys': 'from-indigo-900/40 to-slate-900/10',
        'Adscend Media Surveys': 'from-sky-900/40 to-slate-900/10',
        'BitLabs Surveys': 'from-blue-900/40 to-slate-900/10',
        'inBrain': 'from-purple-900/40 to-slate-900/10',
        'TheoremReach': 'from-pink-900/40 to-slate-900/10',
    };
    const gradient = gradients[provider.name] || 'from-slate-800/40 to-slate-900/10';

    // Clean and pretty URL → /CPXResearch
    const slug = provider.name.replace(/[^a-zA-Z0-9]/g, '');
    const href = `/${slug}`;

    const cardContent = (
        <>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>
            {provider.isLocked && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10"></div>}

            <div className={`relative z-10 flex flex-col items-center justify-center flex-grow w-full ${provider.isLocked ? 'opacity-50' : ''}`}>
                <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                        {provider.logo && provider.logo.trim() !== '' ? (
                            <img src={provider.logo} alt={provider.name} className="h-8 max-w-[80%] object-contain" />
                        ) : (
                            <span className="font-bold text-sm text-white">{provider.name}</span>
                        )}
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                        <div className="w-12 h-12 rounded-full bg-green-500/80 flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 3.75a.75.75 0 011.08-.625l8.5 5.25a.75.75 0 010 1.25l-8.5 5.25a.75.75 0 01-1.08-.625V3.75z" />
                            </svg>
                        </div>
                        <p className="font-semibold text-sm text-white">View surveys</p>
                    </div>
                </div>
            </div>

            <div className={`relative z-10 w-full ${provider.isLocked ? 'opacity-50' : ''}`}>
                <p className="font-bold text-white mt-auto">{provider.name}</p>
                {provider.rating !== undefined && provider.rating > 0 && (
                    <div className="mt-2 flex justify-center">
                        <StarRating rating={provider.rating} />
                    </div>
                )}
            </div>

            {provider.isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-sm text-center z-20 p-2 text-white">
                    <LockIcon />
                    {provider.unlockRequirement && <p className="mt-2 font-semibold">{provider.unlockRequirement}</p>}
                    {provider.unlocksAt && <p className="mt-1">{provider.unlocksAt}</p>}
                </div>
            )}
        </>
    );

    const className =
        'bg-[#2a3044] rounded-2xl p-4 w-full flex flex-col items-center justify-between text-center h-48 relative overflow-hidden transition-all duration-300 border border-slate-700/50 group hover:-translate-y-1';

    if (provider.isLocked) {
        return <div className={`${className} cursor-not-allowed`}>{cardContent}</div>;
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${className} cursor-pointer`}
        >
            {cardContent}
        </a>
    );
};

export default SurveyProviderCard;
