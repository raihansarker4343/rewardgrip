import React from 'react';

interface BrandLogoProps {
  className?: string;
  onClick?: () => void;
  variant?: 'full' | 'compact' | 'icon';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  onClick,
  variant = 'full',
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group transition-all duration-300 active:scale-95 ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label="RewardGrip home"
    >
      {/* 3D Glass Gem Icon Badge */}
      <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] sm:rounded-2xl bg-gradient-to-br from-[#00F57C] via-[#00D26A] to-[#009448] p-[1.5px] shadow-[0_4px_20px_rgba(0,210,106,0.38),0_1px_3px_rgba(0,0,0,0.5)] group-hover:shadow-[0_6px_28px_rgba(0,210,106,0.58)] group-hover:scale-105 transition-all duration-300 shrink-0">
        
        {/* Inner container with specular glass bevel */}
        <div className="relative w-full h-full rounded-[12.5px] sm:rounded-[14.5px] bg-gradient-to-br from-[#00D26A] via-[#00B85C] to-[#007A3B] flex items-center justify-center overflow-hidden border-t border-white/40 border-b border-black/25 shadow-inner">
          
          {/* Specular gloss top reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />
          
          {/* Subtle bottom-right dark ambient vignette */}
          <div className="absolute inset-0 bg-gradient-to-tl from-black/25 via-transparent to-transparent pointer-events-none" />

          {/* Premium Vector Insignia: Interlocking Geometric Grip & Reward Shield */}
          <svg
            className="w-6 h-6 sm:w-6.5 sm:h-6.5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Hex-Shield Facet */}
            <path
              d="M16 3L26 8.5V17.5C26 23.5 21.7 27.8 16 29.5C10.3 27.8 6 23.5 6 17.5V8.5L16 3Z"
              fill="rgba(255,255,255,0.18)"
              stroke="white"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Dynamic Interlocking "R" + "Grip Hook" */}
            <path
              d="M12 11H17C18.6569 11 20 12.3431 20 14C20 15.6569 18.6569 17 17 17H13.5M12 11V21M12 21H15M16.5 17L19.5 21"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Glowing Accent Star Node */}
            <circle cx="21" cy="9" r="1.5" fill="#FFE875" className="animate-pulse" />
          </svg>
        </div>

        {/* Live Ambient Status Dot */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3 pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF85] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00FF85] border-2 border-[#141826] shadow-sm"></span>
        </span>
      </div>

      {/* Brand Text */}
      {variant !== 'icon' && (
        <div className="flex items-baseline tracking-tight">
          <span className="text-[1.35rem] sm:text-[1.55rem] font-black text-slate-900 dark:text-white group-hover:text-slate-100 transition-colors tracking-[-0.035em] drop-shadow-sm">
            Reward
          </span>
          <span className="text-[1.35rem] sm:text-[1.55rem] font-black tracking-[-0.035em] bg-gradient-to-r from-[#00FF85] via-[#00D26A] to-[#00b555] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(0,210,106,0.45)]">
            Grip
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF85] ml-0.5 inline-block drop-shadow-[0_0_6px_rgba(0,255,133,0.8)] group-hover:scale-125 transition-transform" />
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
