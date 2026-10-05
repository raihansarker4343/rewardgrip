import React from 'react';
import type { OfferWall } from '../types';
import { LockIcon } from './icons/SurveyIcons';
import StarRating from './StarRating';

const OfferWallCard: React.FC<{ wall: OfferWall }> = ({ wall }) => {
    const gradients: { [key: string]: string } = {
        'Torox': 'from-orange-900/40 to-slate-900/10',
        'Adscend Media': 'from-sky-900/40 to-slate-900/10',
        'AdToWall': 'from-emerald-900/40 to-slate-900/10',
        'RevU': 'from-rose-900/40 to-slate-900/10',
        'AdGate Media': 'from-blue-900/40 to-slate-900/10',
        'MyChips': 'from-yellow-900/40 to-slate-900/10',
        'MM Wall': 'from-purple-900/40 to-slate-900/10',
        'Aye-T Studios': 'from-teal-900/40 to-slate-900/10',
        'Monlix': 'from-fuchsia-900/40 to-slate-900/10',
        'Hang My Ads': 'from-lime-900/40 to-slate-900/10',
        'Lootably': 'from-cyan-900/40 to-slate-900/10',
        'Time Wall': 'from-indigo-900/40 to-slate-900/10',
        'AdGem': 'from-violet-900/40 to-slate-900/10',
        'Pixylab': 'from-blue-900/40 to-purple-900/20',
        'Skylup': 'from-blue-900/40 to-purple-900/20',
    };
    const gradient = gradients[wall.name] || 'from-slate-800/40 to-slate-900/10';

    //const href = `/#/${wall.name}`;
    // Clean and pretty URL → /CPXResearch
    const slug = wall.name.replace(/[^a-zA-Z0-9]/g, '');
    const href = `/${slug}`;

    const cardContent = (
        <>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>
            {wall.isLocked && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10"></div>}
            {wall.bonus && (
                <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full z-20 ${wall.isLocked ? 'bg-gray-500/30 text-gray-300' : 'bg-green-500/20 text-green-300'}`}>
                    {wall.bonus}
                </div>
            )}
            
            <div className={`relative z-10 flex flex-col items-center justify-center flex-grow w-full ${wall.isLocked ? 'opacity-50' : ''}`}>
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* Default State (Logo) */}
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                        {wall.logo && wall.logo.trim() !== '' ? (
                            <img src={wall.logo} alt={wall.name} className="h-10 max-w-[80%] object-contain" />
                        ) : (
                            <span className="font-bold text-sm text-white">{wall.name}</span>
                        )}
                    </div>
                    {/* Hover State (Play Button) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                         <div className="w-12 h-12 rounded-full bg-green-500/80 flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 3.75a.75.75 0 011.08-.625l8.5 5.25a.75.75 0 010 1.25l-8.5 5.25a.75.75 0 01-1.08-.625V3.75z" />
                            </svg>
                        </div>
                        <p className="font-semibold text-sm text-white">View offers</p>
                    </div>
                </div>
            </div>

            <div className={`relative z-10 w-full ${wall.isLocked ? 'opacity-50' : ''}`}>
                <p className="font-bold text-white mt-auto">{wall.name}</p>
                {wall.rating !== undefined && wall.rating > 0 && (
                    <div className="mt-2 flex justify-center">
                        <StarRating rating={wall.rating} />
                    </div>
                )}
            </div>

            {wall.isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-sm text-center z-20 p-2 text-white">
                    <LockIcon />
                    {wall.unlockRequirement && <p className="mt-2 font-semibold">{wall.unlockRequirement}</p>}
                </div>
            )}
        </>
    );

    const className = `bg-[#2a3044] rounded-2xl p-4 w-full flex flex-col items-center justify-between text-center h-48 relative overflow-hidden transition-all duration-300 border border-slate-700/50 group hover:-translate-y-1`;

    if (wall.isLocked) {
        return (
            <div className={`${className} cursor-not-allowed`}>
                {cardContent}
            </div>
        );
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

export default OfferWallCard;