import React from 'react';

const CookiePolicyPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                    Cookie{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-500">
                        Policy
                    </span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    This Cookie Policy explains how RewardGrip uses cookies and similar
                    technologies to recognize you when you visit our website.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    Last updated: <span className="font-semibold">February 28, 2025</span>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-[#0b1220] p-8 rounded-2xl shadow-xl border border-slate-200/70 dark:border-slate-800 relative overflow-hidden">
                <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 -left-24 h-64 w-64 rounded-full bg-lime-400/5 blur-3xl" />

                <div className="relative z-10 space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {/* 1. What Are Cookies */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            1. What Are Cookies?
                        </h2>
                        <p>
                            Cookies are small text files placed on your device when you visit a
                            website. They are widely used to make websites work, remember
                            preferences, and provide information to website owners.
                        </p>
                    </section>

                    {/* 2. How We Use Cookies */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            2. How RewardGrip Uses Cookies
                        </h2>
                        <p className="mb-3">
                            We use cookies to help keep RewardGrip secure, reliable, and user
                            friendly. This includes:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">
                                <p className="font-semibold text-emerald-500 mb-1">
                                    Essential Cookies
                                </p>
                                <p>
                                    Required for basic website functionality, account login,
                                    navigation, and security. The site cannot function properly
                                    without these cookies.
                                </p>
                            </div>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 p-4 text-sm">
                                <p className="font-semibold text-slate-500 mb-1">
                                    Performance & Analytics
                                </p>
                                <p>
                                    Help us understand how users interact with RewardGrip, which pages
                                    are visited, and how the platform performs so we can improve the
                                    experience.
                                </p>
                            </div>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 p-4 text-sm">
                                <p className="font-semibold text-slate-500 mb-1">
                                    Offerwall & Tracking
                                </p>
                                <p>
                                    Used by our partners to track offer completions, surveys, and ad
                                    conversions so that your earnings can be properly credited.
                                </p>
                            </div>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 p-4 text-sm">
                                <p className="font-semibold text-slate-500 mb-1">
                                    Preference Cookies
                                </p>
                                <p>
                                    Remember your settings, such as language, theme (dark/light), and
                                    login preferences to provide a smoother experience.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 3. Third-Party Cookies */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            3. Third-Party Cookies
                        </h2>
                        <p className="mb-3">
                            We work with third-party providers (e.g., offerwalls, analytics,
                            payment processors) who may set their own cookies when you interact
                            with their content or complete offers.
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Offerwall networks for tracking conversions.</li>
                            <li>Analytics tools for performance monitoring.</li>
                            <li>Fraud detection and security services.</li>
                        </ul>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                            These third parties have their own privacy and cookie policies, which
                            we encourage you to review.
                        </p>
                    </section>

                    {/* 4. Managing Cookies */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            4. Managing Your Cookie Preferences
                        </h2>
                        <p className="mb-3">
                            Most web browsers allow you to control cookies through their settings.
                            You can choose to:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mb-2">
                            <li>Accept or block all cookies.</li>
                            <li>Delete existing cookies from your device.</li>
                            <li>Set preferences for specific websites.</li>
                        </ul>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Note that disabling certain cookies may impact the functionality of
                            RewardGrip, including your ability to stay logged in or track your
                            earnings correctly.
                        </p>
                    </section>

                    {/* 5. Updates & Contact */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            5. Changes to This Cookie Policy & Contact
                        </h2>
                        <p className="mb-3">
                            We may update this Cookie Policy from time to time. Changes will be
                            posted on this page with an updated &quot;Last updated&quot; date.
                        </p>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 p-4 text-sm">
                            <p className="font-semibold text-slate-900 dark:text-white mb-1">
                                Questions about Cookies?
                            </p>
                            <p>
                                If you have any questions about how we use cookies, you can contact
                                us at:
                            </p>
                            <ul className="mt-1 space-y-1">
                                <li>
                                    Email:{" "}
                                    <span className="font-mono text-emerald-500">
                                        privacy@rewardgrip.com
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <p className="text-xs text-center text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
                        By continuing to use RewardGrip, you consent to our use of cookies as
                        described in this Cookie Policy.
                    </p>
                </div>
            </div>
        </div>

    );
};

export default CookiePolicyPage;