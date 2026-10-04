import React from 'react';

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

/* Step 1 — Create your account */
export const CreateAccountIllustration: React.FC = () => (
  <svg
    viewBox="0 0 420 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full max-h-[260px] drop-shadow-2xl"
    aria-hidden
  >
    <GlowDefs id="ca" />
    <ellipse cx="210" cy="230" rx="120" ry="28" fill="#00D26A" opacity="0.08" />

    <g transform="translate(110, 20)">
      <rect x="0" y="0" width="200" height="240" rx="22" fill="#1e2433" stroke="#3d4659" strokeWidth="2.5" />
      <rect x="8" y="8" width="184" height="224" rx="16" fill="url(#ca-screen)" />
      <rect x="55" y="8" width="90" height="6" rx="3" fill="#141826" />

      <circle cx="100" cy="52" r="28" fill="#2a3142" stroke="#3d4659" strokeWidth="2" />
      <circle cx="100" cy="48" r="12" fill="#64748b" />
      <path d="M78 72c4-10 14-16 22-16s18 6 22 16" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
      <circle cx="118" cy="38" r="10" fill="url(#ca-green)" filter="url(#ca-glow)" />
      <text x="114" y="42" fill="white" fontSize="14" fontWeight="bold" fontFamily="system-ui">
        +
      </text>

      <rect x="24" y="92" width="152" height="36" rx="10" fill="#1a1f2e" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />
      <rect x="36" y="104" width="16" height="12" rx="3" fill="#64748b" opacity="0.6" />
      <text x="60" y="115" fill="#94a3b8" fontSize="12" fontFamily="system-ui">
        your@email.com
      </text>

      <rect x="24" y="140" width="152" height="44" rx="12" fill="url(#ca-green)" filter="url(#ca-glow)" />
      <text x="52" y="168" fill="white" fontSize="14" fontWeight="bold" fontFamily="system-ui">
        Join free
      </text>

      <g transform="translate(24, 196)">
        <circle cx="8" cy="8" r="8" fill="#00D26A" opacity="0.9" />
        <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="24" y="12" fill="#94a3b8" fontSize="10" fontFamily="system-ui">
          No credit card required
        </text>
      </g>
    </g>

    <g transform="translate(30, 70)">
      <circle cx="35" cy="35" r="35" fill="#1a1f2e" stroke="#00D26A" strokeWidth="2" />
      <rect x="22" y="28" width="26" height="18" rx="4" fill="none" stroke="#00D26A" strokeWidth="2" />
      <path d="M22 32l13 8 13-8" stroke="#00D26A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    <g transform="translate(310, 55)">
      <rect x="0" y="0" width="80" height="72" rx="14" fill="#1a1f2e" stroke="#3d4659" strokeWidth="2" />
      <circle cx="40" cy="28" r="16" fill="#2a3142" stroke="#00D26A" strokeWidth="2" />
      <path d="M34 28l4 4 8-8" stroke="#00D26A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="18" y="58" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="system-ui">
        Verified
      </text>
    </g>
  </svg>
);

export const CreateAccountFloat1: React.FC = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="caf1-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    <rect width="80" height="80" rx="18" fill="url(#caf1-bg)" />
    <rect x="4" y="4" width="72" height="72" rx="14" fill="white" fillOpacity="0.08" />
    <rect x="16" y="22" width="48" height="32" rx="6" fill="white" fillOpacity="0.9" />
    <path d="M16 28l24 16 24-16" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <text x="22" y="68" fill="white" fontSize="9" fontWeight="bold" fontFamily="system-ui" opacity="0.9">
      EMAIL
    </text>
  </svg>
);

export const CreateAccountFloat2: React.FC = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="caf2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00D26A" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <rect width="80" height="80" rx="18" fill="url(#caf2-bg)" />
    <rect x="4" y="4" width="72" height="72" rx="14" fill="white" fillOpacity="0.1" />
    <text x="22" y="46" fill="white" fontSize="22" fontWeight="800" fontFamily="system-ui">
      FREE
    </text>
    <text x="14" y="66" fill="white" fontSize="8" fontWeight="bold" fontFamily="system-ui" opacity="0.85">
      NO FEES
    </text>
  </svg>
);

/* Step 2 — Pick offers you like */
export const PickOffersIllustration: React.FC = () => (
  <svg
    viewBox="0 0 420 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full max-h-[260px] drop-shadow-2xl"
    aria-hidden
  >
    <GlowDefs id="po" />
    <ellipse cx="210" cy="235" rx="130" ry="28" fill="#6366f1" opacity="0.07" />

    <g transform="translate(90, 30)">
      <rect x="0" y="0" width="240" height="210" rx="18" fill="#1e2433" stroke="#3d4659" strokeWidth="2.5" />
      <rect x="10" y="10" width="220" height="190" rx="14" fill="url(#po-screen)" />
      <text x="24" y="36" fill="white" fontSize="13" fontWeight="bold" fontFamily="system-ui">
        Pick your offers
      </text>

      {[
        { y: 48, color: '#6366f1', label: 'Games', icon: '🎮', selected: true },
        { y: 98, color: '#ec4899', label: 'Apps', icon: '📱', selected: false },
        { y: 148, color: '#a855f7', label: 'Surveys', icon: '📋', selected: true },
      ].map((item) => (
        <g key={item.label} transform={`translate(16, ${item.y})`}>
          <rect
            width="208"
            height="42"
            rx="10"
            fill="#1a1f2e"
            stroke={item.selected ? '#00D26A' : '#ffffff'}
            strokeOpacity={item.selected ? 0.6 : 0.08}
            strokeWidth={item.selected ? 2 : 1}
          />
          <rect x="10" y="7" width="28" height="28" rx="8" fill={item.color} />
          <text x="17" y="27" fill="white" fontSize="14" fontFamily="system-ui">
            {item.icon}
          </text>
          <text x="48" y="26" fill="white" fontSize="12" fontWeight="600" fontFamily="system-ui">
            {item.label}
          </text>
          {item.selected && (
            <g transform="translate(178, 11)">
              <circle cx="12" cy="12" r="12" fill="url(#po-green)" />
              <path d="M7 12l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          )}
        </g>
      ))}
    </g>

    <g transform="translate(25, 100)">
      <circle cx="32" cy="32" r="32" fill="#1a1f2e" stroke="#6366f1" strokeWidth="2" />
      <path
        d="M20 32l8 8 16-16"
        stroke="#6366f1"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    <g transform="translate(330, 80)">
      <rect x="0" y="0" width="70" height="90" rx="12" fill="#1a1f2e" stroke="#3d4659" strokeWidth="2" />
      <text x="14" y="28" fill="#94a3b8" fontSize="9" fontFamily="system-ui">
        Tailored
      </text>
      <text x="14" y="42" fill="#94a3b8" fontSize="9" fontFamily="system-ui">
        for you
      </text>
      <rect x="10" y="54" width="50" height="24" rx="6" fill="url(#po-green)" />
      <text x="18" y="70" fill="white" fontSize="10" fontWeight="bold" fontFamily="system-ui">
        Match
      </text>
    </g>
  </svg>
);

export const PickOffersFloat1: React.FC = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="pof1-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#4338ca" />
      </linearGradient>
    </defs>
    <rect width="80" height="80" rx="18" fill="url(#pof1-bg)" />
    <rect x="4" y="4" width="72" height="72" rx="14" fill="white" fillOpacity="0.08" />
    <rect x="14" y="30" width="52" height="28" rx="14" fill="#2a3142" stroke="#4a5568" strokeWidth="1.5" />
    <circle cx="28" cy="44" r="6" fill="#4a5568" />
    <circle cx="52" cy="40" r="5" fill="#00D26A" />
    <circle cx="44" cy="48" r="5" fill="#ef4444" />
    <text x="18" y="22" fill="white" fontSize="8" fontWeight="bold" fontFamily="system-ui" opacity="0.9">
      GAMES
    </text>
  </svg>
);

export const PickOffersFloat2: React.FC = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="pof2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <rect width="80" height="80" rx="18" fill="url(#pof2-bg)" />
    <rect x="4" y="4" width="72" height="72" rx="14" fill="white" fillOpacity="0.08" />
    <rect x="18" y="14" width="44" height="52" rx="6" fill="white" fillOpacity="0.9" />
    <rect x="26" y="24" width="28" height="4" rx="2" fill="#a855f7" opacity="0.5" />
    <rect x="26" y="34" width="20" height="4" rx="2" fill="#a855f7" opacity="0.35" />
    <rect x="26" y="44" width="24" height="4" rx="2" fill="#a855f7" opacity="0.35" />
    <text x="12" y="74" fill="white" fontSize="8" fontWeight="bold" fontFamily="system-ui" opacity="0.85">
      SURVEY
    </text>
  </svg>
);

/* Step 3 — Cash out instantly */
export const CashOutIllustration: React.FC = () => (
  <svg
    viewBox="0 0 420 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full max-h-[260px] drop-shadow-2xl"
    aria-hidden
  >
    <GlowDefs id="co2" />
    <ellipse cx="210" cy="235" rx="125" ry="28" fill="#00D26A" opacity="0.1" />

    <g transform="translate(120, 35)">
      <rect x="0" y="40" width="180" height="120" rx="16" fill="#1e2433" stroke="#3d4659" strokeWidth="2.5" />
      <rect x="8" y="48" width="164" height="104" rx="12" fill="url(#co2-screen)" />
      <rect x="20" y="62" width="140" height="28" rx="8" fill="#1a1f2e" stroke="#ffffff" strokeOpacity="0.08" />
      <text x="32" y="81" fill="#94a3b8" fontSize="11" fontFamily="system-ui">
        Available balance
      </text>
      <text x="32" y="108" fill="#00D26A" fontSize="22" fontWeight="800" fontFamily="system-ui">
        $48.50
      </text>

      <rect x="20" y="120" width="140" height="36" rx="10" fill="url(#co2-green)" filter="url(#co2-glow)" />
      <text x="48" y="143" fill="white" fontSize="13" fontWeight="bold" fontFamily="system-ui">
        Cash out now
      </text>

      <path d="M90 0 L110 0 L100 40 Z" fill="#1e2433" stroke="#3d4659" strokeWidth="2" />
    </g>

    <g transform="translate(30, 90)">
      <circle cx="38" cy="38" r="38" fill="#1a1f2e" stroke="#eab308" strokeWidth="2" />
      <path
        d="M38 14v28M38 42l-12-10M38 42l12-10"
        stroke="#eab308"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#co2-glow)"
      />
      <text x="22" y="72" fill="#eab308" fontSize="9" fontWeight="bold" fontFamily="system-ui">
        INSTANT
      </text>
    </g>

    <g transform="translate(300, 60)">
      <rect x="10" y="30" width="58" height="14" rx="3" fill="#00A855" />
      <rect x="6" y="20" width="58" height="14" rx="3" fill="#00D26A" />
      <rect x="2" y="10" width="58" height="14" rx="3" fill="#34d399" />
      <text x="18" y="20" fill="white" fontSize="9" fontWeight="bold" fontFamily="system-ui">
        $48
      </text>

      <g transform="translate(0, 58)">
        <rect width="70" height="44" rx="10" fill="#1a1f2e" stroke="#3d4659" strokeWidth="1.5" />
        <circle cx="22" cy="22" r="12" fill="#3b82f6" />
        <text x="16" y="26" fill="white" fontSize="10" fontWeight="bold" fontFamily="system-ui">
          P
        </text>
        <circle cx="48" cy="22" r="12" fill="#00D26A" />
        <text x="43" y="26" fill="white" fontSize="10" fontWeight="bold" fontFamily="system-ui">
          $
        </text>
      </g>
    </g>

    <g transform="translate(175, 175)" opacity="0.85">
      <circle cx="0" cy="0" r="6" fill="#00D26A" />
      <circle cx="30" cy="-20" r="5" fill="#34d399" />
      <circle cx="55" cy="5" r="4" fill="#00D26A" />
      <path d="M6 0 Q30 -15 55 5" stroke="#00D26A" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.6" />
    </g>
  </svg>
);

export const CashOutFloat1: React.FC = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="cof1-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
    </defs>
    <rect width="80" height="80" rx="18" fill="url(#cof1-bg)" />
    <rect x="4" y="4" width="72" height="72" rx="14" fill="white" fillOpacity="0.1" />
    <path
      d="M40 16v32M40 48l-14-12M40 48l14-12"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text x="14" y="68" fill="white" fontSize="9" fontWeight="bold" fontFamily="system-ui" opacity="0.9">
      INSTANT
    </text>
  </svg>
);

export const CashOutFloat2: React.FC = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="cof2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00D26A" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <rect width="80" height="80" rx="18" fill="url(#cof2-bg)" />
    <rect x="4" y="4" width="72" height="72" rx="14" fill="white" fillOpacity="0.1" />
    <text x="28" y="48" fill="white" fontSize="28" fontWeight="800" fontFamily="system-ui">
      $
    </text>
    <text x="10" y="68" fill="white" fontSize="9" fontWeight="bold" fontFamily="system-ui" opacity="0.9">
      PAYOUT
    </text>
  </svg>
);
