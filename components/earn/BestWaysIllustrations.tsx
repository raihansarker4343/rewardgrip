import React from 'react';

/* ── Shared gradient defs ── */
const GlowDefs = ({ id }: { id: string }) => (
  <defs>
    <linearGradient id={`${id}-green`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#00D26A" />
      <stop offset="100%" stopColor="#00A855" />
    </linearGradient>
    <linearGradient id={`${id}-screen`} x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#2d3748" />
      <stop offset="100%" stopColor="#1a202c" />
    </linearGradient>
    <linearGradient id={`${id}-shine`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
    </linearGradient>
    <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

/* ═══════════════════════════════════════════
   PLAY GAMES — Main illustration
   ═══════════════════════════════════════════ */
export const PlayGamesIllustration: React.FC = () => (
  <svg
    viewBox="0 0 420 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full max-h-[260px] drop-shadow-2xl"
    aria-hidden
  >
    <GlowDefs id="pg" />
    {/* Ambient glow */}
    <ellipse cx="210" cy="200" rx="120" ry="30" fill="#00D26A" opacity="0.08" />
    {/* Game controller */}
    <g transform="translate(30, 80)">
      <rect x="0" y="20" width="130" height="80" rx="40" fill="#2a3142" stroke="#3d4659" strokeWidth="2" />
      <rect x="4" y="24" width="122" height="72" rx="36" fill="url(#pg-shine)" />
      {/* D-pad */}
      <rect x="22" y="48" width="12" height="28" rx="3" fill="#4a5568" />
      <rect x="14" y="56" width="28" height="12" rx="3" fill="#4a5568" />
      {/* Buttons */}
      <circle cx="95" cy="52" r="8" fill="#00D26A" opacity="0.9" />
      <circle cx="110" cy="62" r="8" fill="#ef4444" opacity="0.85" />
      <circle cx="80" cy="62" r="8" fill="#3b82f6" opacity="0.85" />
      <circle cx="95" cy="72" r="8" fill="#eab308" opacity="0.85" />
    </g>
    {/* Phone with game */}
    <g transform="translate(140, 20)">
      <rect x="0" y="0" width="160" height="240" rx="22" fill="#1e2433" stroke="#3d4659" strokeWidth="2.5" />
      <rect x="8" y="8" width="144" height="224" rx="16" fill="url(#pg-screen)" />
      {/* Notch */}
      <rect x="55" y="8" width="50" height="6" rx="3" fill="#141826" />
      {/* Game scene on screen */}
      <rect x="16" y="24" width="128" height="80" rx="8" fill="#0f3460" />
      {/* Bubble game elements */}
      <circle cx="40" cy="50" r="12" fill="#ef4444" opacity="0.9" />
      <circle cx="65" cy="42" r="10" fill="#3b82f6" opacity="0.9" />
      <circle cx="90" cy="55" r="11" fill="#eab308" opacity="0.9" />
      <circle cx="115" cy="45" r="9" fill="#00D26A" opacity="0.9" />
      <circle cx="55" cy="68" r="8" fill="#a855f7" opacity="0.85" />
      <circle cx="100" cy="72" r="10" fill="#f97316" opacity="0.85" />
      {/* Score bar */}
      <rect x="16" y="114" width="128" height="28" rx="6" fill="#1a1f2e" />
      <text x="28" y="133" fill="#00D26A" fontSize="14" fontWeight="bold" fontFamily="system-ui">
        +$2.50
      </text>
      <rect x="90" y="120" width="46" height="16" rx="4" fill="url(#pg-green)" />
      <text x="98" y="132" fill="white" fontSize="10" fontWeight="bold" fontFamily="system-ui">
        Level 5
      </text>
      {/* Progress */}
      <rect x="16" y="152" width="128" height="8" rx="4" fill="#2a3142" />
      <rect x="16" y="152" width="90" height="8" rx="4" fill="url(#pg-green)" />
      {/* Play button */}
      <circle cx="80" cy="190" r="22" fill="url(#pg-green)" filter="url(#pg-glow)" />
      <polygon points="74,180 74,200 92,190" fill="white" />
      {/* Coins floating */}
      <g transform="translate(130, 30)">
        <circle cx="0" cy="0" r="14" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
        <text x="-5" y="5" fill="#78350f" fontSize="12" fontWeight="bold" fontFamily="system-ui">
          $
        </text>
      </g>
    </g>
    {/* Trophy badge */}
    <g transform="translate(310, 60)">
      <circle cx="40" cy="40" r="38" fill="#1a1f2e" stroke="#00D26A" strokeWidth="2" opacity="0.95" />
      <path
        d="M28 28h24v8c0 10-5 18-12 20-7-2-12-10-12-20v-8z"
        fill="#eab308"
        stroke="#ca8a04"
        strokeWidth="1"
      />
      <rect x="34" y="48" width="12" height="6" rx="2" fill="#ca8a04" />
      <rect x="30" y="52" width="20" height="4" rx="2" fill="#eab308" />
    </g>
  </svg>
);

export const PlayGamesFloat1: React.FC = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="pgf1-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#4338ca" />
      </linearGradient>
    </defs>
    <rect width="80" height="80" rx="18" fill="url(#pgf1-bg)" />
    <rect x="4" y="4" width="72" height="72" rx="14" fill="white" fillOpacity="0.08" />
    {/* Puzzle pieces */}
    <circle cx="28" cy="28" r="10" fill="#ef4444" />
    <circle cx="52" cy="28" r="10" fill="#3b82f6" />
    <circle cx="28" cy="52" r="10" fill="#eab308" />
    <circle cx="52" cy="52" r="10" fill="#00D26A" />
    <text x="22" y="76" fill="white" fontSize="8" fontWeight="bold" fontFamily="system-ui" opacity="0.9">
      PUZZLE
    </text>
  </svg>
);

export const PlayGamesFloat2: React.FC = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="pgf2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#c2410c" />
      </linearGradient>
    </defs>
    <rect width="80" height="80" rx="18" fill="url(#pgf2-bg)" />
    <rect x="4" y="4" width="72" height="72" rx="14" fill="white" fillOpacity="0.08" />
    {/* Racing car icon */}
    <path
      d="M18 48h44l-6-14H24l-6 14z"
      fill="#1e293b"
      stroke="#0f172a"
      strokeWidth="1.5"
    />
    <circle cx="28" cy="50" r="6" fill="#334155" stroke="#1e293b" strokeWidth="2" />
    <circle cx="52" cy="50" r="6" fill="#334155" stroke="#1e293b" strokeWidth="2" />
    <rect x="38" y="38" width="8" height="6" rx="2" fill="#38bdf8" />
    {/* Payout tag */}
    <rect x="10" y="8" width="44" height="18" rx="6" fill="#00D26A" />
    <text x="16" y="21" fill="white" fontSize="10" fontWeight="bold" fontFamily="system-ui">
      $120
    </text>
  </svg>
);

/* ═══════════════════════════════════════════
   COMPLETE OFFERS — Main illustration
   ═══════════════════════════════════════════ */
export const CompleteOffersIllustration: React.FC = () => (
  <svg
    viewBox="0 0 420 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full max-h-[260px] drop-shadow-2xl"
    aria-hidden
  >
    <GlowDefs id="co" />
    <ellipse cx="210" cy="230" rx="130" ry="28" fill="#3b82f6" opacity="0.07" />
    {/* Phone frame */}
    <g transform="translate(120, 15)">
      <rect x="0" y="0" width="180" height="250" rx="24" fill="#1e2433" stroke="#3d4659" strokeWidth="2.5" />
      <rect x="10" y="10" width="160" height="230" rx="18" fill="url(#co-screen)" />
      <rect x="60" y="10" width="60" height="7" rx="3.5" fill="#141826" />
      {/* App offer cards */}
      {[
        { y: 28, color: '#6366f1', name: 'ShopApp', pay: '$12.00', icon: 'S' },
        { y: 88, color: '#ec4899', name: 'StreamTV', pay: '$8.50', icon: 'T' },
        { y: 148, color: '#14b8a6', name: 'FitTrack', pay: '$25.00', icon: 'F' },
      ].map((app) => (
        <g key={app.name} transform={`translate(18, ${app.y})`}>
          <rect width="144" height="52" rx="10" fill="#1a1f2e" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />
          <rect x="10" y="10" width="32" height="32" rx="8" fill={app.color} />
          <text x="18" y="32" fill="white" fontSize="16" fontWeight="bold" fontFamily="system-ui">
            {app.icon}
          </text>
          <text x="52" y="24" fill="white" fontSize="13" fontWeight="600" fontFamily="system-ui">
            {app.name}
          </text>
          <text x="52" y="40" fill="#64748b" fontSize="10" fontFamily="system-ui">
            Try &amp; earn
          </text>
          <rect x="100" y="14" width="36" height="24" rx="6" fill="url(#co-green)" />
          <text x="106" y="30" fill="white" fontSize="10" fontWeight="bold" fontFamily="system-ui">
            {app.pay}
          </text>
        </g>
      ))}
    </g>
    {/* Download arrow badge */}
    <g transform="translate(30, 100)">
      <circle cx="35" cy="35" r="35" fill="#1a1f2e" stroke="#3b82f6" strokeWidth="2" />
      <path d="M35 18v24M35 42l-10-10M35 42l10-10" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    {/* Cash stack */}
    <g transform="translate(310, 90)">
      <rect x="10" y="30" width="60" height="12" rx="3" fill="#00A855" />
      <rect x="6" y="20" width="60" height="12" rx="3" fill="#00D26A" />
      <rect x="2" y="10" width="60" height="12" rx="3" fill="#34d399" />
      <text x="18" y="19" fill="white" fontSize="10" fontWeight="bold" fontFamily="system-ui">
        $75
      </text>
    </g>
  </svg>
);

export const CompleteOffersFloat1: React.FC = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="cof1-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="50%" stopColor="#EA4335" />
        <stop offset="100%" stopColor="#FBBC05" />
      </linearGradient>
    </defs>
    <rect width="80" height="80" rx="18" fill="#1a1f2e" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1" />
    {/* App store style icon */}
    <rect x="14" y="14" width="52" height="52" rx="12" fill="url(#cof1-bg)" />
    <path d="M40 24l12 20H28l12-20z" fill="white" opacity="0.9" />
    <rect x="30" y="48" width="20" height="4" rx="2" fill="white" opacity="0.7" />
    {/* Checkmark badge */}
    <circle cx="62" cy="62" r="14" fill="#00D26A" />
    <path d="M56 62l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CompleteOffersFloat2: React.FC = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="cof2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00D26A" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <rect width="80" height="80" rx="18" fill="url(#cof2-bg)" />
    <rect x="4" y="4" width="72" height="72" rx="14" fill="white" fillOpacity="0.1" />
    <text x="18" y="48" fill="white" fontSize="28" fontWeight="800" fontFamily="system-ui">
      $
    </text>
    <text x="16" y="68" fill="white" fontSize="11" fontWeight="bold" fontFamily="system-ui" opacity="0.9">
      INSTANT
    </text>
  </svg>
);

/* ═══════════════════════════════════════════
   JOIN SURVEYS — Main illustration
   ═══════════════════════════════════════════ */
export const JoinSurveysIllustration: React.FC = () => (
  <svg
    viewBox="0 0 420 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full max-h-[260px] drop-shadow-2xl"
    aria-hidden
  >
    <GlowDefs id="js" />
    <ellipse cx="210" cy="240" rx="120" ry="26" fill="#a855f7" opacity="0.07" />
    {/* Tablet / clipboard */}
    <g transform="translate(100, 25)">
      <rect x="0" y="0" width="220" height="230" rx="16" fill="#1e2433" stroke="#3d4659" strokeWidth="2.5" />
      <rect x="10" y="10" width="200" height="210" rx="12" fill="#f8fafc" />
      {/* Survey header */}
      <rect x="10" y="10" width="200" height="36" rx="12" fill="#1a1f2e" />
      <rect x="10" y="34" width="200" height="12" fill="#1a1f2e" />
      <text x="24" y="34" fill="white" fontSize="13" fontWeight="bold" fontFamily="system-ui">
        Quick Opinion Survey
      </text>
      {/* Progress bar */}
      <rect x="24" y="58" width="172" height="6" rx="3" fill="#e2e8f0" />
      <rect x="24" y="58" width="120" height="6" rx="3" fill="url(#js-green)" />
      <text x="24" y="78" fill="#64748b" fontSize="10" fontFamily="system-ui">
        Question 3 of 5
      </text>
      {/* Question */}
      <text x="24" y="100" fill="#1e293b" fontSize="12" fontWeight="600" fontFamily="system-ui">
        How satisfied are you with
      </text>
      <text x="24" y="116" fill="#1e293b" fontSize="12" fontWeight="600" fontFamily="system-ui">
        our product?
      </text>
      {/* Star rating options */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${24 + i * 34}, 130)`}>
          <rect width="28" height="28" rx="6" fill={i < 4 ? '#fef3c7' : '#f1f5f9'} stroke={i < 4 ? '#eab308' : '#e2e8f0'} strokeWidth="1.5" />
          <text x="7" y="20" fill={i < 4 ? '#eab308' : '#cbd5e1'} fontSize="14" fontFamily="system-ui">
            ★
          </text>
        </g>
      ))}
      {/* Selected answer highlight */}
      <rect x="24" y="168" width="172" height="32" rx="8" fill="#ecfdf5" stroke="#00D26A" strokeWidth="1.5" />
      <circle cx="40" cy="184" r="8" fill="url(#js-green)" />
      <text x="56" y="188" fill="#065f46" fontSize="11" fontWeight="500" fontFamily="system-ui">
        Very satisfied
      </text>
      {/* Submit */}
      <rect x="24" y="208" width="172" height="32" rx="8" fill="url(#js-green)" />
      <text x="78" y="229" fill="white" fontSize="12" fontWeight="bold" fontFamily="system-ui">
        Submit
      </text>
    </g>
    {/* Opinion bubbles */}
    <g transform="translate(30, 50)" opacity="0.9">
      <ellipse cx="30" cy="20" rx="28" ry="18" fill="#a855f7" opacity="0.2" />
      <text x="18" y="25" fill="#a855f7" fontSize="18" fontFamily="system-ui">
        💬
      </text>
    </g>
    {/* Dollar reward badge */}
    <g transform="translate(330, 70)">
      <circle cx="35" cy="35" r="35" fill="#1a1f2e" stroke="#00D26A" strokeWidth="2" />
      <text x="22" y="44" fill="#00D26A" fontSize="24" fontWeight="800" fontFamily="system-ui">
        $1
      </text>
    </g>
  </svg>
);

export const JoinSurveysFloat1: React.FC = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="jsf1-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <rect width="80" height="80" rx="18" fill="url(#jsf1-bg)" />
    <rect x="4" y="4" width="72" height="72" rx="14" fill="white" fillOpacity="0.08" />
    {/* Chat / opinion bubble */}
    <path
      d="M16 20h48a4 4 0 014 4v20a4 4 0 01-4 4H28l-8 8v-8h-4a4 4 0 01-4-4V24a4 4 0 014-4z"
      fill="white"
      fillOpacity="0.9"
    />
    <rect x="24" y="32" width="32" height="4" rx="2" fill="#a855f7" opacity="0.6" />
    <rect x="24" y="40" width="24" height="4" rx="2" fill="#a855f7" opacity="0.4" />
  </svg>
);

export const JoinSurveysFloat2: React.FC = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="jsf2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
    </defs>
    <rect width="80" height="80" rx="18" fill="url(#jsf2-bg)" />
    <rect x="4" y="4" width="72" height="72" rx="14" fill="white" fillOpacity="0.1" />
    {/* 5-star rating */}
    {[0, 1, 2, 3, 4].map((i) => (
      <text key={i} x={8 + i * 14} y="52" fill="white" fontSize="14" fontFamily="system-ui">
        ★
      </text>
    ))}
    <text x="14" y="72" fill="white" fontSize="8" fontWeight="bold" fontFamily="system-ui" opacity="0.85">
      RATE US
    </text>
  </svg>
);
