import React from 'react';

const AmlKycPolicyPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                    KYC &{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-500">
                        Anti-Fraud Policy
                    </span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    This policy explains how RewardGrip verifies users and prevents fraud to
                    protect our community, partners, and payouts.
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
                    {/* 1. Purpose */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center justify-between gap-2">
                            <span>1. Purpose of This Policy</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                                Compliance
                            </span>
                        </h2>
                        <p>
                            RewardGrip operates a rewards and payout platform that must protect
                            users, advertisers, and partners from fraud, money laundering, and
                            abuse. This KYC (Know Your Customer) and Anti-Fraud Policy explains
                            how we verify accounts and monitor activity in order to maintain a
                            secure and compliant environment.
                        </p>
                    </section>

                    {/* 2. KYC Verification */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            2. KYC (Know Your Customer) Verification
                        </h2>
                        <p className="mb-3">
                            In some cases, RewardGrip may require you to complete identity
                            verification before allowing certain actions, especially payouts. KYC
                            checks help us ensure:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mb-3">
                            <li>You are a real individual and not a fake or duplicate account.</li>
                            <li>Your identity matches the payout details provided.</li>
                            <li>We comply with applicable anti-fraud and AML (Anti-Money Laundering) measures.</li>
                        </ul>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                                <p className="font-semibold text-emerald-500 mb-1">
                                    2.1 What We May Request
                                </p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Full name and date of birth</li>
                                    <li>Country and city of residence</li>
                                    <li>Valid government-issued ID (e.g., passport, ID card)</li>
                                    <li>Proof of address in some cases</li>
                                </ul>
                            </div>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 p-4">
                                <p className="font-semibold text-slate-500 mb-1">
                                    2.2 When KYC Is Required
                                </p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>High total earnings or large withdrawal amounts</li>
                                    <li>Suspicious or unusual account activity</li>
                                    <li>Multiple failed or reversed payments</li>
                                    <li>Manual review triggered by our systems or partners</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 3. Anti-Fraud Monitoring */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            3. Anti-Fraud Monitoring and Detection
                        </h2>
                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/40 mb-4">
                            <div className="flex gap-3">
                                <div className="mt-1">
                                    <i className="fas fa-shield-alt text-red-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white mb-1">
                                        Zero-Tolerance for Fraud
                                    </p>
                                    <p className="text-sm">
                                        RewardGrip strictly prohibits fraudulent activity, including fake
                                        signups, false survey responses, VPN/proxy abuse, and offer
                                        manipulation. Violations may result in permanent bans and
                                        forfeiture of earnings.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="mb-3">
                            We use a combination of automated systems and manual reviews to detect
                            abnormal or risky behavior, including:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Multiple accounts from the same device, IP, or household.</li>
                            <li>Use of VPNs, proxies, emulators, or spoofed devices.</li>
                            <li>Very high offer completion rate inconsistent with normal use.</li>
                            <li>Repeated disqualifications, chargebacks, or reversed conversions.</li>
                            <li>Inconsistent profile information or payout details.</li>
                        </ul>
                    </section>

                    {/* 4. Actions We May Take */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            4. Actions We May Take on Suspicious Accounts
                        </h2>
                        <p className="mb-3">
                            If our systems or partners flag an account for potential fraud or
                            abuse, RewardGrip may take one or more of the following actions:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mb-3">
                            <li>Temporarily place the account under review.</li>
                            <li>Request additional information (KYC, proof of ownership).</li>
                            <li>Reverse or hold suspicious earnings or pending withdrawals.</li>
                            <li>Limit or disable access to offers and promotions.</li>
                            <li>Permanently suspend or terminate the account.</li>
                        </ul>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            In cases of confirmed fraud, we may also share relevant information
                            with our partners or, where required, with authorities.
                        </p>
                    </section>

                    {/* 5. User Responsibilities */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            5. Your Responsibilities
                        </h2>
                        <p className="mb-3">
                            By using RewardGrip, you agree to:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mb-2">
                            <li>Provide accurate and truthful information.</li>
                            <li>Maintain only one personal account on RewardGrip.</li>
                            <li>Complete offers and surveys honestly and as instructed.</li>
                            <li>Not use VPNs, proxies, or other tools to disguise your identity.</li>
                            <li>Not exploit bugs, scripts, or automation for unfair gain.</li>
                        </ul>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Failure to follow these rules may result in account restrictions or
                            permanent bans and loss of rewards.
                        </p>
                    </section>

                    {/* 6. Data Protection & KYC Storage */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            6. Data Protection and Storage of KYC Information
                        </h2>
                        <p className="mb-3">
                            Any documents or data you provide for KYC or anti-fraud checks are
                            handled with care and stored securely in line with our Privacy Policy.
                            We:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Use secure storage and limited access controls.</li>
                            <li>Retain KYC data only as long as necessary for compliance.</li>
                            <li>Do not use KYC information for marketing or unrelated purposes.</li>
                        </ul>
                    </section>

                    {/* 7. No Guaranteed Approval */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            7. No Guarantee of Account or Payout Approval
                        </h2>
                        <p>
                            Completion of KYC does not guarantee that your account or withdrawals
                            will be approved. We reserve the right, at our sole discretion, to
                            deny payouts or close accounts where we believe there is a compliance
                            risk, violation of our policies, or unresolved fraud concerns.
                        </p>
                    </section>

                    {/* 8. Changes & Contact */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            8. Changes to This Policy & Contact
                        </h2>
                        <p className="mb-3">
                            We may update this KYC & Anti-Fraud Policy from time to time to
                            reflect new regulations, security improvements, or business needs.
                            Changes will be posted here with an updated date.
                        </p>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 p-4 text-sm">
                            <p className="font-semibold text-slate-900 dark:text-white mb-1">
                                Contact the Compliance Team
                            </p>
                            <p className="mb-1">
                                If you have questions about this policy or a review on your
                                account, contact us at:
                            </p>
                            <ul className="space-y-1">
                                <li>
                                    Email:{" "}
                                    <span className="font-mono text-emerald-500">
                                        compliance@rewardgrip.com
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
                        By using RewardGrip, you acknowledge and agree to this KYC & Anti-Fraud
                        Compliance Policy.
                    </p>
                </div>
            </div>
        </div>

    );
};

export default AmlKycPolicyPage;