import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                    Privacy{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-500">
                        Policy
                    </span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    This Privacy Policy explains how RewardGrip collects, uses, and protects
                    your personal information when you use our services.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    Last updated: <span className="font-semibold">February 28, 2025</span>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-[#0b1220] p-8 rounded-2xl shadow-xl border border-slate-200/70 dark:border-slate-800 relative overflow-hidden">
                {/* Background accents */}
                <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 -left-24 h-64 w-64 rounded-full bg-lime-400/5 blur-3xl" />

                <div className="relative z-10 space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {/* 1. Introduction */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center justify-between gap-2">
                            <span>1. Introduction</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                                Your Data
                            </span>
                        </h2>
                        <p>
                            This Privacy Policy describes how{" "}
                            <span className="font-semibold">RewardGrip (&quot;we&quot;,
                                &quot;us&quot;, &quot;our&quot;)</span> collects, uses, stores, and protects your
                            information when you use our website, apps, and related services
                            (collectively, the &quot;Service&quot;). By using RewardGrip, you agree
                            to the collection and use of information in accordance with this
                            policy.
                        </p>
                    </section>

                    {/* 2. Information We Collect */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            2. Information We Collect
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm">
                                <p className="font-semibold text-emerald-500 mb-1">
                                    2.1 Information You Provide
                                </p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Email address</li>
                                    <li>Username and profile information</li>
                                    <li>Payment / payout details (e.g., wallet or account ID)</li>
                                    <li>Support messages or inquiries</li>
                                </ul>
                            </div>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 p-4 text-sm">
                                <p className="font-semibold text-slate-500 mb-1">
                                    2.2 Information Collected Automatically
                                </p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>IP address and approximate location</li>
                                    <li>Device identifiers and browser information</li>
                                    <li>Usage logs (pages viewed, clicks, timestamps)</li>
                                    <li>Referral and affiliate information</li>
                                </ul>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Some survey and offerwall partners may collect additional demographic
                            or profiling data. Those are subject to their own privacy policies.
                        </p>
                    </section>

                    {/* 3. Cookies & Tracking */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            3. Cookies and Tracking Technologies
                        </h2>
                        <p className="mb-3">
                            We use cookies and similar technologies to enhance your experience,
                            keep you logged in, remember preferences, and measure performance of
                            offers and surveys. For more details, please refer to our{" "}
                            <span className="font-semibold">Cookie Policy</span>.
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Authentication cookies (to keep you signed in)</li>
                            <li>Analytics cookies (to understand how the site is used)</li>
                            <li>Affiliate and tracking cookies (for offerwall and referrals)</li>
                        </ul>
                    </section>

                    {/* 4. How We Use Your Information */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            4. How We Use Your Information
                        </h2>
                        <p className="mb-3">
                            We use the information we collect for purposes including:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mb-2">
                            <li>Creating and managing your RewardGrip account.</li>
                            <li>Tracking completed offers, surveys, and rewards.</li>
                            <li>Processing withdrawals and payouts.</li>
                            <li>Detecting and preventing fraud, abuse, or policy violations.</li>
                            <li>Improving platform performance and user experience.</li>
                            <li>Sending important updates, notifications, and security alerts.</li>
                        </ul>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            We do <span className="font-semibold">not</span> sell your personal data to
                            third parties.
                        </p>
                    </section>

                    {/* 5. Sharing of Information */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            5. How We Share Your Information
                        </h2>
                        <p className="mb-3">
                            We may share limited information with:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mb-2">
                            <li>
                                Offerwall and survey partners, to track conversions and validate
                                your earnings.
                            </li>
                            <li>
                                Payment processors (e.g., PayPal, crypto processors) for payouts.
                            </li>
                            <li>
                                Service providers (hosting, analytics, customer support tools).
                            </li>
                            <li>
                                Authorities or regulators if required by law or to enforce our
                                rights.
                            </li>
                        </ul>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            We share only the minimum necessary data needed to operate the
                            service.
                        </p>
                    </section>

                    {/* 6. Data Retention */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            6. Data Retention
                        </h2>
                        <p>
                            We retain your data for as long as your account is active and as
                            necessary to comply with legal obligations, resolve disputes, and
                            enforce our agreements. If you request account deletion, some
                            information may still be kept for fraud prevention and legal
                            compliance.
                        </p>
                    </section>

                    {/* 7. Your Rights */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            7. Your Rights and Choices
                        </h2>
                        <p className="mb-3">
                            Depending on your jurisdiction, you may have the right to:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mb-2">
                            <li>Access the personal data we hold about you.</li>
                            <li>Request corrections to inaccurate information.</li>
                            <li>Request deletion of your account and certain data.</li>
                            <li>Opt out of non-essential communications.</li>
                        </ul>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            To exercise these rights, contact us at{" "}
                            <span className="font-mono text-emerald-500">
                                privacy@rewardgrip.com
                            </span>
                            .
                        </p>
                    </section>

                    {/* 8. Security */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            8. Security
                        </h2>
                        <p>
                            We use reasonable technical and organizational measures to protect
                            your data, including encryption, access controls, and monitoring.
                            However, no method of transmission over the internet is 100% secure,
                            and we cannot guarantee absolute security.
                        </p>
                    </section>

                    {/* 9. Children's Privacy */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            9. Children&apos;s Privacy
                        </h2>
                        <p>
                            RewardGrip is not directed to children under the age of 13. We do not
                            knowingly collect personal information from children under 13. If you
                            believe a child has provided us with personal data, please contact us
                            so we can take appropriate action.
                        </p>
                    </section>

                    {/* 10. Changes & Contact */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            10. Changes to this Privacy Policy & Contact
                        </h2>
                        <p className="mb-3">
                            We may update this Privacy Policy from time to time. Changes will be
                            posted on this page with an updated &quot;Last updated&quot; date.
                        </p>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 p-4 text-sm">
                            <p className="font-semibold text-slate-900 dark:text-white mb-1">
                                Contact Us
                            </p>
                            <p>If you have questions about this Privacy Policy, contact us at:</p>
                            <ul className="mt-1 space-y-1">
                                <li>
                                    Email:{" "}
                                    <span className="font-mono text-emerald-500">
                                        privacy@rewardgrip.com
                                    </span>
                                </li>
                                <li>
                                    Support:{" "}
                                    <span className="font-mono text-emerald-500">
                                        support@rewardgrip.com
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <p className="text-xs text-center text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
                        By using RewardGrip, you consent to the data practices described in this
                        Privacy Policy.
                    </p>
                </div>
            </div>
        </div>

    );
};

export default PrivacyPolicyPage;