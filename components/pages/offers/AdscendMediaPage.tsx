import React from 'react';
import { OFFER_WALLS } from '../../../constants';

const AdscendMediaPage: React.FC = () => {
    const provider = OFFER_WALLS.find(p => p.name === 'Adscend Media');
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                {provider && provider.logo && <img src={provider.logo} alt={`${provider.name} logo`} className="h-10 object-contain bg-slate-200 dark:bg-slate-800 p-1 rounded-md" />}
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Adscend Media</h1>
            </div>
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg border border-slate-200 dark:border-slate-800 min-h-[calc(100vh-8rem)] flex items-center justify-center">
                <p className="text-slate-500 dark:text-slate-400">Adscend Media iframe/API content would be loaded here.</p>
            </div>
        </div>
    );
};

export default AdscendMediaPage;