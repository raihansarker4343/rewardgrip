import React, { useState } from 'react';
import { FAQ_ITEMS } from '../../constants';

const FrequentlyAskedPage: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#1e293b] p-8 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Frequently Asked Questions</h1>
                <p className="text-slate-500 dark:text-slate-400">Find answers to common questions about RewardGrip.com.</p>
            </div>
            
            <div className="space-y-4">
                {FAQ_ITEMS.map((item, index) => (
                    <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full flex justify-between items-center p-4 text-left bg-slate-50 dark:bg-[#141c2f] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{item.question}</span>
                            <i className={`fas fa-chevron-down transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''} text-slate-500`}></i>
                        </button>
                        <div 
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="p-4 text-slate-600 dark:text-slate-400 bg-white dark:bg-[#1e293b] border-t border-slate-200 dark:border-slate-700">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FrequentlyAskedPage;