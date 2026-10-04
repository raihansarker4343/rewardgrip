import React from 'react';
import { SURVEY_PROVIDERS } from '../../../constants';

const PrimeSurveysPage: React.FC = () => {
    const provider = SURVEY_PROVIDERS.find(p => p.name === 'Prime Surveys');
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                {provider && provider.logo && <img src={provider.logo} alt={`${provider.name} logo`} className="h-10 object-contain bg-slate-200 dark:bg-slate-800 p-1 rounded-md" />}
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Prime Surveys</h1>
            </div>
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg border border-slate-200 dark:border-slate-800 min-h-[calc(100vh-8rem)] flex items-center justify-center">
                <p className="text-slate-500 dark:text-slate-400">Prime Surveys iframe/API content would be loaded here.</p>
            </div>
        </div>
    );
};

export default PrimeSurveysPage;