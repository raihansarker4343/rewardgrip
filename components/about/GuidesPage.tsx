import React from 'react';

const GuidesPage: React.FC = () => {
    const guides = [
        {
            title: "Getting Started",
            icon: "fas fa-rocket",
            description: "Learn the basics of setting up your account and completing your first task.",
            color: "from-blue-500 to-indigo-500"
        },
        {
            title: "Survey Success",
            icon: "fas fa-poll-h",
            description: "Tips and tricks to qualify for more surveys and avoid screen-outs.",
            color: "from-emerald-500 to-teal-500"
        },
        {
            title: "Offer Wall Mastery",
            icon: "fas fa-th-large",
            description: "How to efficiently complete game offers and app downloads for maximum XP.",
            color: "from-orange-500 to-amber-500"
        },
        {
            title: "Referral Program",
            icon: "fas fa-users",
            description: "Maximize your passive income by inviting friends and building your network.",
            color: "from-purple-500 to-pink-500"
        }
    ];

    return (
        <div className="space-y-12 max-w-5xl mx-auto px-4">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                    Guides & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Tutorials</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Everything you need to know to become a top earner on RewardGrip.com.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {guides.map((guide, idx) => (
                    <div 
                        key={idx} 
                        className="group relative bg-white dark:bg-[#1e293b] p-1 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${guide.color} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 blur-xl`}></div>
                        
                        <div className="relative h-full bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-800 group-hover:border-transparent transition-colors flex items-start gap-5">
                            <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${guide.color} text-white flex items-center justify-center text-2xl shadow-lg`}>
                                <i className={guide.icon}></i>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                                    {guide.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    {guide.description}
                                </p>
                                <div className="mt-4 flex items-center text-sm font-semibold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                                    Read Guide <i className="fas fa-arrow-right ml-2 transform transition-transform group-hover:translate-x-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GuidesPage;