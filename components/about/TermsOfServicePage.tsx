import React from 'react';

const TermsOfServicePage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                    Terms of{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-500">
                        Service
                    </span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Please read these terms carefully before using RewardGrip. By accessing the
                    platform, you agree to be bound by these Terms of Service.
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

                    {/* 1. Acceptance */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center justify-between gap-2">
                            <span>1. Acceptance of Terms</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                                Agreement
                            </span>
                        </h2>
                        <p>
                            By accessing or using <span className="font-semibold">RewardGrip.com</span> (the
                            &quot;Platform&quot; or &quot;Service&quot;), you acknowledge that you have read,
                            understood, and agree to be bound by these Terms of Service
                            (&quot;Terms&quot;), as well as our Privacy Policy and any additional guidelines
                            we may publish. If you do not agree to these Terms, you must not use
                            the Service.
                        </p>
                    </section>

                    {/* 2. Eligibility */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            2. Eligibility
                        </h2>
                        <p className="mb-3">
                            You must meet all of the following requirements to use RewardGrip:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>You are at least <span className="font-semibold">13 years old</span> (or the minimum legal age in your country).</li>
                            <li>
                                You have the legal capacity to enter into a binding agreement in
                                your jurisdiction.
                            </li>
                            <li>
                                You are not prohibited from participating in online reward or
                                incentive programs under any applicable law or regulation.
                            </li>
                        </ul>
                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                            Some offers, surveys, and payment methods may require you to be{" "}
                            <span className="font-semibold">18 years or older</span>. It is your responsibility
                            to comply with the laws of your country.
                        </p>
                    </section>

                    {/* 3. User Accounts */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            3. User Accounts
                        </h2>
                        <p className="mb-3">
                            To access certain features, you must create an account. You agree to:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Provide accurate, current, and complete information during registration.</li>
                            <li>Maintain and promptly update your information if it changes.</li>
                            <li>Keep your login credentials secure and confidential.</li>
                            <li>Accept responsibility for all activity occurring under your account.</li>
                        </ul>
                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                            You may not create an account using another person&apos;s identity or
                            an invalid email address. RewardGrip reserves the right to suspend or
                            terminate accounts that contain false or misleading information.
                        </p>
                    </section>

                    {/* 4. Prohibited Activities */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            4. Prohibited Activities
                        </h2>

                        {/* Warning card */}
                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/40 mb-4">
                            <div className="flex gap-3">
                                <div className="mt-1">
                                    <i className="fas fa-exclamation-triangle text-red-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white mb-1">
                                        Strict Prohibition
                                    </p>
                                    <p className="text-sm">
                                        Using VPNs, proxies, emulators, automation tools, fake device
                                        profiles, or fabricated data to complete offers or surveys is
                                        strictly prohibited and may result in{" "}
                                        <span className="font-semibold">immediate account termination</span> and
                                        loss of all earnings. Creating multiple or duplicate accounts is
                                        also strictly forbidden.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="mb-3">
                            You agree NOT to engage in any of the following activities:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Using VPNs, proxies, or anonymizing tools to spoof your location.</li>
                            <li>Creating more than one RewardGrip account per person.</li>
                            <li>
                                Providing fake, misleading, or intentionally random answers in
                                surveys or tasks.
                            </li>
                            <li>Using bots, scripts, macros, or automation software.</li>
                            <li>
                                Exploiting bugs, loopholes, or system weaknesses for unfair
                                advantage.
                            </li>
                            <li>
                                Selling, sharing, or trading accounts or balances with other users.
                            </li>
                        </ul>
                    </section>

                    {/* 5. Earnings & Rewards */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            5. Earnings and Rewards
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 mb-4">
                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500 mb-1">
                                    How You Earn
                                </p>
                                <p className="text-sm">
                                    You may earn rewards by completing surveys, offers, tasks,
                                    achievements, bonuses, and referral activities provided by
                                    RewardGrip and its partners.
                                </p>
                            </div>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-1">
                                    No Guarantee
                                </p>
                                <p className="text-sm">
                                    Earnings depend on offer availability, your location, profile
                                    match, and partner approval. RewardGrip does not guarantee any
                                    minimum income or continuous earning opportunities.
                                </p>
                            </div>
                        </div>
                        <p className="mb-2">
                            All earnings displayed on your account are considered{" "}
                            <span className="font-semibold">pending</span> until fully validated by
                            our offerwall and survey partners. Partners may{" "}
                            <span className="font-semibold">
                                reverse, adjust, or cancel rewards
                            </span>{" "}
                            for reasons including but not limited to:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mb-2">
                            <li>Fraudulent or invalid activity.</li>
                            <li>Chargebacks or failed advertiser payments.</li>
                            <li>Survey disqualification or poor quality responses.</li>
                        </ul>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            In such cases, your RewardGrip balance may be adjusted accordingly. We
                            are not responsible for losses caused by third-party reversals.
                        </p>
                    </section>

                    {/* 6. Offerwalls & Third-Party Partners */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            6. Offerwalls, Surveys, and Third-Party Services
                        </h2>
                        <p className="mb-3">
                            RewardGrip integrates with third-party offerwalls, survey routers, and
                            advertisers. When you engage with these services:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mb-2">
                            <li>You may be redirected to external websites or apps.</li>
                            <li>
                                You may be subject to the terms, conditions, and privacy policies of
                                those third parties.
                            </li>
                            <li>
                                Any dispute related to a specific offer, survey, or advertiser may
                                require resolution directly with that partner.
                            </li>
                        </ul>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            RewardGrip does not control and is not responsible for third-party
                            content, decisions, or tracking accuracy.
                        </p>
                    </section>

                    {/* 7. Withdrawals & Payments */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            7. Withdrawals and Payments
                        </h2>
                        <p className="mb-3">
                            Withdrawals are subject to our internal review and may require
                            additional verification. When requesting a payout, you agree that:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mb-3">
                            <li>You have reached the minimum withdrawal threshold.</li>
                            <li>
                                The payment details you provide (e.g., wallet, email, ID) are yours
                                and valid.
                            </li>
                            <li>
                                RewardGrip may review your account for fraud, chargebacks, or policy
                                violations before approving a payout.
                            </li>
                        </ul>
                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/40 rounded-xl p-4 text-sm">
                            <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">
                                Important
                            </p>
                            <p>
                                We reserve the right to delay, deny, or reverse withdrawals if we
                                detect suspicious activity, invalid traffic, multiple accounts, or
                                violations of these Terms. In severe cases, balances may be{" "}
                                <span className="font-semibold">permanently forfeited</span>.
                            </p>
                        </div>
                    </section>

                    {/* 8. Referral Program */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            8. Referral Program
                        </h2>
                        <p className="mb-3">
                            RewardGrip may offer a referral program that rewards you when users you
                            invite register and actively use the Platform. By using the referral
                            system, you agree not to:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mb-2">
                            <li>Self-refer using your own devices or multiple accounts.</li>
                            <li>
                                Use misleading, spammy, or deceptive advertising to obtain referrals.
                            </li>
                            <li>
                                Buy or sell referrals, or use incentivized traffic that violates our
                                partners&apos; rules.
                            </li>
                        </ul>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            We may adjust or revoke referral earnings if we detect serious abuse,
                            fraud, or violation of our or our partners&apos; policies.
                        </p>
                    </section>

                    {/* 9. Account Suspension & Termination */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            9. Account Suspension and Termination
                        </h2>
                        <p className="mb-3">
                            RewardGrip reserves the right, at our sole discretion, to suspend,
                            restrict, or permanently terminate your account, with or without
                            notice, if:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mb-2">
                            <li>You violate any provision of these Terms.</li>
                            <li>We detect fraud, abuse, or suspicious activity.</li>
                            <li>
                                You engage in offensive, harmful, or illegal behavior toward staff,
                                partners, or other users.
                            </li>
                            <li>We receive a valid legal or regulatory request.</li>
                        </ul>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            In the event of termination for cause (such as fraud or abuse), your
                            remaining balance may be{" "}
                            <span className="font-semibold">canceled and not paid out</span>.
                        </p>
                    </section>

                    {/* 10. Intellectual Property */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            10. Intellectual Property
                        </h2>
                        <p>
                            All content on RewardGrip, including but not limited to logos, graphics,
                            text, UI components, software, and branding, is the property of
                            RewardGrip or its licensors and is protected by copyright, trademark,
                            and other intellectual property laws. You may not copy, reproduce,
                            distribute, modify, or create derivative works without our prior
                            written consent.
                        </p>
                    </section>

                    {/* 11. Privacy & Data */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            11. Privacy and Data Usage
                        </h2>
                        <p className="mb-3">
                            By using RewardGrip, you consent to the collection and processing of
                            your data as described in our Privacy Policy. This may include:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mb-2">
                            <li>Account and contact information (such as email address).</li>
                            <li>
                                Device, IP, and browser data for security and anti-fraud purposes.
                            </li>
                            <li>
                                Activity logs related to offers, surveys, and withdrawals.
                            </li>
                        </ul>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            We implement reasonable security measures to protect your data but
                            cannot guarantee absolute security of information transmitted over the
                            internet.
                        </p>
                    </section>

                    {/* 12. Disclaimer */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            12. Disclaimer of Warranties
                        </h2>
                        <p>
                            The Service is provided on an{" "}
                            <span className="font-semibold">&quot;AS IS&quot; and &quot;AS AVAILABLE&quot;</span> basis.
                            RewardGrip disclaims all warranties of any kind, whether express or
                            implied, including but not limited to implied warranties of
                            merchantability, fitness for a particular purpose, and
                            non-infringement. We do not warrant that:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>The Service will be uninterrupted, secure, or error-free.</li>
                            <li>Offers or surveys will always be available in your region.</li>
                            <li>You will earn any specific amount of money or rewards.</li>
                        </ul>
                    </section>

                    {/* 13. Limitation of Liability */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            13. Limitation of Liability
                        </h2>
                        <p>
                            To the maximum extent permitted by law, RewardGrip and its owners,
                            employees, and partners shall not be liable for any indirect,
                            incidental, special, consequential, or punitive damages, or any loss
                            of profits or revenues, whether incurred directly or indirectly, or
                            any loss of data, goodwill, or other intangible losses, arising out of
                            your use of or inability to use the Service.
                        </p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            In no event shall our total liability exceed the total amount of
                            confirmed, unpaid earnings in your account at the time of the claim.
                        </p>
                    </section>

                    {/* 14. Changes to Service & Terms */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            14. Changes to the Service and Terms
                        </h2>
                        <p>
                            We may modify, suspend, or discontinue any part of the Service at any
                            time, with or without notice. We may also update these Terms from time
                            to time. When we do, we will update the &quot;Last updated&quot; date
                            at the top of this page. Your continued use of RewardGrip after changes
                            are posted constitutes your acceptance of the revised Terms.
                        </p>
                    </section>

                    {/* 15. Governing Law & Contact */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            15. Governing Law and Contact
                        </h2>
                        <p className="mb-3">
                            These Terms shall be governed and construed in accordance with the
                            laws of <span className="font-semibold">[Your Country / State]</span>, without regard
                            to its conflict of law provisions.
                        </p>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 p-4 text-sm">
                            <p className="font-semibold text-slate-900 dark:text-white mb-1">
                                Contact Us
                            </p>
                            <p className="mb-1">
                                If you have any questions about these Terms, you can contact us at:
                            </p>
                            <ul className="space-y-1">
                                <li>
                                    Email:{" "}
                                    <span className="font-mono text-emerald-500">
                                        support@rewardgrip.com
                                    </span>
                                </li>
                                <li>
                                    Website:{" "}
                                    <span className="font-mono text-emerald-500">
                                        https://rewardgrip.com
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <p className="text-xs text-center text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
                        By using RewardGrip, you acknowledge that you have read, understood, and
                        agree to these Terms of Service.
                    </p>
                </div>
            </div>
        </div>

    );
};

export default TermsOfServicePage;