import React from 'react';

const BlogPage: React.FC = () => {
    const posts = [
        {
            id: 1,
            title: "Top 5 Ways to Maximize Your Earnings",
            excerpt: "Discover the strategies top earners use to get the most out of surveys and offers. Efficiency is key when looking to earn daily.",
            date: "Oct 12, 2023",
            category: "Tips & Tricks",
            readTime: "5 min read",
            image: "https://i.imgur.com/kP4dmA8.png"
        },
        {
            id: 2,
            title: "Understanding Crypto Withdrawals",
            excerpt: "A comprehensive guide on how to withdraw your earnings using cryptocurrency safely to your preferred wallet.",
            date: "Nov 05, 2023",
            category: "Guides",
            readTime: "8 min read",
            image: "https://i.imgur.com/uN83F9y.png"
        },
        {
            id: 3,
            title: "New Offer Walls Added!",
            excerpt: "We have integrated three new high-paying offer walls. Check out what's new and how you can boost your daily income.",
            date: "Dec 01, 2023",
            category: "Announcements",
            readTime: "3 min read",
            image: "https://i.imgur.com/s6n5s7H.png"
        }
    ];

    return (
        <div className="space-y-12 max-w-6xl mx-auto px-4">
            {/* Header Section with Gradient Glows */}
            <div className="relative text-center py-12">
                {/* Background Glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        RewardGrip News
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
                        Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">Updates & Guides</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Stay ahead of the curve with expert tips, platform updates, and comprehensive guides to maximize your earnings.
                    </p>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <div 
                        key={post.id} 
                        className="group relative flex flex-col h-full"
                    >
                        {/* Card Background & Border Effect */}
                        <div className="absolute inset-0 bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-emerald-500/30 dark:group-hover:border-emerald-500/30 overflow-hidden"></div>
                        
                        {/* Hover Gradient Glow */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                        </div>

                        {/* Content Container */}
                        <div className="relative z-10 flex flex-col h-full p-5">
                            {/* Image Wrapper */}
                            <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-5 shadow-sm">
                                {post.image && post.image.trim() !== '' ? (
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                                        {post.title.charAt(0)}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 shadow-sm">
                                    {post.category}
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <i className="far fa-calendar text-emerald-500"></i>
                                        {post.date}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                    <span className="flex items-center gap-1.5">
                                        <i className="far fa-clock text-emerald-500"></i>
                                        {post.readTime}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    {post.title}
                                </h3>
                                
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50">
                                    <button className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        Read Article
                                        <i className="fas fa-arrow-right transform transition-transform duration-300 group-hover:translate-x-1 text-xs"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogPage;