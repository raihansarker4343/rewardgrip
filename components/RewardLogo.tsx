import React from 'react';

interface RewardLogoProps {
  name: string;
  className?: string;
  imageUrl?: string;
}

export const RewardLogo: React.FC<RewardLogoProps> = ({ name, className = 'w-10 h-10', imageUrl }) => {
  const normalized = name.toLowerCase().replace(/[\s\-_.]/g, '');

  switch (normalized) {
    case 'paypal':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="drop-shadow(0 2px 4px rgba(0, 121, 193, 0.25))">
            {/* Dark blue back P */}
            <path
              d="M13.5 6.5H23.8C27.9 6.5 30.8 9.2 29.9 13.5C29.1 17.2 25.8 19.5 21.8 19.5H18.2L15.8 32H11L13.5 6.5Z"
              fill="#003087"
            />
            {/* Light blue front P */}
            <path
              d="M17.8 12.5H28C32 12.5 34.6 15 33.8 19.2C33 22.8 29.8 25 25.8 25H22.4L20.2 34.5H15.5L17.8 12.5Z"
              fill="#0079C1"
            />
            {/* Overlap shadow */}
            <path
              d="M18.2 19.5H21.8C25.8 19.5 29.1 17.2 29.9 13.5C28.8 17.8 25.3 19.8 21.4 19.8H18.2L17.2 25H22.4L22.8 23H19L18.2 19.5Z"
              fill="#001C64"
              opacity="0.35"
            />
          </g>
        </svg>
      );

    case 'ach':
    case 'banktransfer':
    case 'bank':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="10" fill="#10B981" fillOpacity="0.15" />
          <path d="M20 7L8 13.5V15.5H32V13.5L20 7Z" fill="#10B981" />
          <rect x="10.5" y="18" width="3" height="10" rx="1" fill="#10B981" />
          <rect x="16" y="18" width="3" height="10" rx="1" fill="#10B981" />
          <rect x="21" y="18" width="3" height="10" rx="1" fill="#10B981" />
          <rect x="26.5" y="18" width="3" height="10" rx="1" fill="#10B981" />
          <rect x="7" y="30" width="26" height="3" rx="1" fill="#10B981" />
          <circle cx="20" cy="23" r="3" fill="#065F46" />
          <text x="20" y="24.8" fill="#34D399" fontSize="4.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">$</text>
        </svg>
      );

    case 'venmo':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="10" fill="#008CFF" />
          <path
            d="M27.2 10.5C28.1 12.3 28.5 14.1 28.5 16.1C28.5 22.8 23.3 31.8 18 35.8H10.5L7.8 11.2L15.2 10.5L17.2 25.5C19.8 21.1 22.1 16 22.1 12.9C22.1 11.4 21.8 10.4 21.4 9.4L27.2 10.5Z"
            fill="white"
          />
        </svg>
      );

    case 'cashapp':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="10" fill="#00D632" />
          <path
            d="M23.1 16.4C22.9 15.3 21.9 14.6 20.6 14.6C19.1 14.6 17.9 15.4 17.9 16.7C17.9 18.1 19 18.7 20.9 19.2L22 19.5C24.7 20.2 26.3 21.4 26.3 23.5C26.3 26.1 24 27.7 21.1 27.9V30.5H18.8V27.9C16.5 27.7 14.9 26.5 14.7 24.7H17.3C17.5 25.7 18.6 26.4 20.2 26.4C21.9 26.4 23.1 25.6 23.1 24.2C23.1 22.8 22 22.2 20 21.7L19 21.4C16.4 20.7 14.9 19.5 14.9 17.5C14.9 15.1 17.1 13.5 19.7 13.3V10.8H22V13.3C24.2 13.6 25.6 14.7 25.8 16.4H23.1Z"
            fill="white"
          />
        </svg>
      );

    case 'amazon':
      return (
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 72 26" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Amazon text in clean white */}
            <text x="36" y="14" fill="#FFFFFF" fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="-0.5">
              amazon
            </text>
            {/* Signature smile arrow in vibrant orange */}
            <path
              d="M12 18.5C23 23 48 23 59 18.2"
              stroke="#FF9900"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M56 16L61 18.5L57 21.5"
              fill="#FF9900"
              stroke="#FF9900"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'apple':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="drop-shadow(0 2px 5px rgba(255, 255, 255, 0.15))">
            {/* Leaf */}
            <path
              d="M24.4 7.8C25.3 6.6 25.9 5 25.7 3.4C24.3 3.5 22.7 4.4 21.8 5.5C21 6.5 20.3 8.1 20.5 9.7C22 9.8 23.5 8.9 24.4 7.8Z"
              fill="#FFFFFF"
            />
            {/* Apple body */}
            <path
              d="M28.6 21.7C28.6 18.1 31.5 16.4 31.7 16.2C30 13.7 27.4 13.4 26.5 13.4C24.3 13.2 22.1 14.7 21 14.7C19.8 14.7 18.1 13.4 16.2 13.4C13.8 13.4 11.5 14.8 10.2 17C7.7 21.3 9.6 27.7 12 31.2C13.2 32.9 14.6 34.8 16.4 34.7C18.2 34.6 18.9 33.6 21.1 33.6C23.3 33.6 23.9 34.7 25.8 34.7C27.7 34.7 28.9 33 30.1 31.3C31.5 29.3 32 27.4 32.1 27.3C32 27.2 28.6 25.9 28.6 21.7Z"
              fill="#FFFFFF"
            />
          </g>
        </svg>
      );

    case 'visa':
      return (
        <div className="flex items-center justify-center">
          <svg viewBox="0 0 64 22" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="22" rx="4" fill="#FFFFFF" fillOpacity="0.08" />
            <text x="32" y="16" fill="#FFFFFF" fontSize="15" fontWeight="900" fontStyle="italic" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.5">
              VISA
            </text>
            <polygon points="12,6.5 16,6.5 13.5,16 9.5,16" fill="#F7B600" />
          </svg>
        </div>
      );

    case 'walmart':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <g fill="#FFC220" filter="drop-shadow(0 0 8px rgba(255, 194, 32, 0.4))">
            {/* Top ray */}
            <path d="M20 4C18.9 4 18 4.9 18 6V13C18 14.1 18.9 15 20 15C21.1 15 22 14.1 22 13V6C22 4.9 21.1 4 20 4Z" />
            {/* Bottom ray */}
            <path d="M20 25C18.9 25 18 25.9 18 27V34C18 35.1 18.9 36 20 36C21.1 36 22 35.1 22 34V27C22 25.9 21.1 25 20 25Z" />
            {/* Top-Right ray */}
            <path d="M32.8 11.2C32.2 10.3 31 10 30.1 10.6L24.1 14.1C23.2 14.7 22.9 15.9 23.5 16.8C24.1 17.7 25.3 18 26.2 17.4L32.2 13.9C33.1 13.3 33.4 12.1 32.8 11.2Z" />
            {/* Bottom-Left ray */}
            <path d="M14.6 21.8C14 20.9 12.8 20.6 11.9 21.2L5.9 24.7C5 25.3 4.7 26.5 5.3 27.4C5.9 28.3 7.1 28.6 8 28L14 24.5C14.9 23.9 15.2 22.7 14.6 21.8Z" />
            {/* Top-Left ray */}
            <path d="M7.2 11.2C6.6 12.1 6.9 13.3 7.8 13.9L13.8 17.4C14.7 18 15.9 17.7 16.5 16.8C17.1 15.9 16.8 14.7 15.9 14.1L9.9 10.6C9 10 7.8 10.3 7.2 11.2Z" />
            {/* Bottom-Right ray */}
            <path d="M25.4 21.8C24.8 22.7 25.1 23.9 26 24.5L32 28C32.9 28.6 34.1 28.3 34.7 27.4C35.3 26.5 35 25.3 34.1 24.7L28.1 21.2C27.2 20.6 26 20.9 25.4 21.8Z" />
          </g>
        </svg>
      );

    case 'target':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="#CC0000" />
          <circle cx="20" cy="20" r="12" fill="#141826" />
          <circle cx="20" cy="20" r="6" fill="#CC0000" />
        </svg>
      );

    case 'xbox':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="#107C10" />
          <g fill="white">
            <path d="M12.4 10.2C14.6 8.7 17.2 7.8 20 7.8C22.8 7.8 25.4 8.7 27.6 10.2C25.1 12.4 22 15.7 20 18.6C18 15.7 14.9 12.4 12.4 10.2Z" />
            <path d="M9 15C8.2 16.5 7.8 18.2 7.8 20C7.8 25.2 11.5 29.5 16.5 30.5C14.9 26.8 14 22.7 14 19.1C14 17.8 14.1 16.6 14.3 15.5C12.5 15.5 10.7 15.3 9 15Z" />
            <path d="M31 15C29.3 15.3 27.5 15.5 25.7 15.5C25.9 16.6 26 17.8 26 19.1C26 22.7 25.1 26.8 23.5 30.5C28.5 29.5 32.2 25.2 32.2 20C32.2 18.2 31.8 16.5 31 15Z" />
          </g>
        </svg>
      );

    case 'adidas':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <g fill="#FFFFFF">
            {/* Three iconic performance mountain bars */}
            <path d="M28.5 10L35 27H29L24 14H28.5Z" />
            <path d="M19.5 16L25.5 30H19.8L15 19.5H19.5Z" />
            <path d="M10.8 22.5L16 33H10.5L6.5 24.5H10.8Z" />
          </g>
        </svg>
      );

    case 'bestbuy':
      return (
        <div className="flex items-center justify-center">
          <svg viewBox="0 0 52 34" className="h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Yellow Tag */}
            <path d="M4 2H36L48 17L36 32H4C2.9 32 2 31.1 2 30V4C2 2.9 2.9 2 4 2Z" fill="#FFF200" />
            <circle cx="41" cy="17" r="2.5" fill="#141826" />
            <text x="8" y="14" fill="#000000" fontSize="8.5" fontWeight="900" fontFamily="Arial Black, Impact, sans-serif">
              BEST
            </text>
            <text x="8" y="24" fill="#000000" fontSize="8.5" fontWeight="900" fontFamily="Arial Black, Impact, sans-serif">
              BUY
            </text>
          </svg>
        </div>
      );

    case 'doordash':
      return (
        <svg viewBox="0 0 44 28" className="h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M37.5 7.5A13.8 13.8 0 0 0 25.5 2H5.6C4.4 2 3.6 3.2 4.2 4.2L9.5 13H25.5C28.2 13 30.5 14.5 31.6 16.7L37.5 7.5Z"
            fill="#FF3008"
          />
          <path
            d="M29.8 17.5C28.8 19 27.2 20 25.5 20H13.6C12.4 20 11.6 21.2 12.2 22.2L14.8 26H25.5C31.5 26 36.8 22.2 39 16.8L29.8 17.5Z"
            fill="#FF3008"
          />
        </svg>
      );

    case 'binance':
    case 'bnb':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="10" fill="#181A20" />
          <g fill="#F0B90B">
            <path d="M20 6.5L24.8 11.3L14.4 21.7L9.6 16.9L20 6.5Z" />
            <path d="M20 33.5L15.2 28.7L25.6 18.3L30.4 23.1L20 33.5Z" />
            <path d="M7 17.6L11.8 20L7 22.4L2.2 20L7 17.6Z" />
            <path d="M33 17.6L37.8 20L33 22.4L28.2 20L33 17.6Z" />
            <path d="M20 15.2L24.8 20L20 24.8L15.2 20L20 15.2Z" />
          </g>
        </svg>
      );

    case 'litecoin':
    case 'ltc':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="#345D9D" />
          <path
            d="M17.8 10L15.6 19.5L12.5 20.5L13.1 22.5L16 21.6L14.8 27L11.5 28L12.1 30L15.2 29L13.8 33H27.5L29.2 25.5H20.3L21.7 19.5L24.8 18.5L24.2 16.5L21.1 17.5L22.3 12H17.8Z"
            fill="white"
          />
        </svg>
      );

    case 'tether':
    case 'usdt':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="#26A17B" />
          <path
            d="M23.5 17.8V14.3H30.5V10H9.5V14.3H16.5V17.8C10.7 18.2 6.3 19.8 6.3 21.8C6.3 23.8 10.7 25.4 16.5 25.8V33.5H23.5V25.8C29.3 25.4 33.7 23.8 33.7 21.8C33.7 19.8 29.3 18.2 23.5 17.8ZM20 23.8C15.8 23.8 12.3 22.7 12.3 21.8C12.3 20.9 15.8 19.8 20 19.8C24.2 19.8 27.7 20.9 27.7 21.8C27.7 22.7 24.2 23.8 20 23.8Z"
            fill="white"
          />
        </svg>
      );

    case 'coinbase':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="#0052FF" />
          <rect x="13" y="13" width="14" height="14" rx="4" fill="white" />
          <rect x="16.5" y="16.5" width="7" height="7" rx="2" fill="#0052FF" />
        </svg>
      );

    case 'airtm':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="#00B2FF" />
          {/* Airtm paper airplane emblem */}
          <path d="M10 20.5L30 11.5L21.5 30L18 22.5L10 20.5Z" fill="white" />
          <path d="M18 22.5L21.5 30L23.5 25L18 22.5Z" fill="#0094D9" />
        </svg>
      );

    case 'bitcoin':
    case 'btc':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="#F7931A" />
          <path
            d="M27.5 17.5C27 15.4 25.1 14.5 22.5 14.2V11H20.3V14.1H18.2V11H16V14.1H12.5V16.3H14.5C15.2 16.3 15.6 16.7 15.6 17.3V25.2C15.6 25.8 15.1 26.2 14.5 26.2H12.5V28.5H16V31.5H18.2V28.5H20.3V31.5H22.5V28.4C26.1 28.1 28.5 26.7 28.8 23.3C29 21.2 28.1 19.8 26.6 19.1C27.5 18.6 27.9 17.9 27.5 17.5ZM23.4 20.2C22.6 20.4 20.2 20.4 18.8 20.4V16.7C19.7 16.7 22 16.6 22.8 17C23.6 17.4 23.9 18.4 23.8 19.1C23.8 19.8 23.7 20.1 23.4 20.2ZM24.4 25.1C23.5 25.4 20.7 25.4 18.8 25.4V21.6C20 21.6 23.2 21.5 24 22C24.8 22.5 25.1 23.6 25 24.3C24.9 24.8 24.8 25 24.4 25.1Z"
            fill="white"
          />
        </svg>
      );

    case 'ethereum':
    case 'eth':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="#627EEA" />
          <g fill="white">
            <path d="M20 7L13 18.5L20 22.5L27 18.5L20 7Z" fillOpacity="0.9" />
            <path d="M20 7L20 22.5L27 18.5L20 7Z" fillOpacity="0.6" />
            <path d="M20 24L13 20L20 33L27 20L20 24Z" fillOpacity="0.9" />
            <path d="M20 24L20 33L27 20L20 24Z" fillOpacity="0.6" />
          </g>
        </svg>
      );

    case 'googleplay':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 7.5L23.5 20L9 32.5V7.5Z" fill="#00C3FF" />
          <path d="M9 7.5L23.5 20L28 16L12 6.5L9 7.5Z" fill="#00E676" />
          <path d="M9 32.5L23.5 20L28 24L12 33.5L9 32.5Z" fill="#FF3D00" />
          <path d="M23.5 20L28 16L33 19C34.3 19.7 34.3 20.3 33 21L28 24L23.5 20Z" fill="#FFD600" />
        </svg>
      );

    case 'steam':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="#171A21" />
          <circle cx="20" cy="20" r="17" stroke="#2A475E" strokeWidth="1.5" />
          <path
            d="M26.5 13C24 13 22 15 22 17.5C22 17.8 22 18.1 22.1 18.4L16.2 21.2C15.6 20.8 14.8 20.5 14 20.5C11.8 20.5 10 22.3 10 24.5C10 26.7 11.8 28.5 14 28.5C16.2 28.5 18 26.7 18 24.5C18 24.3 18 24.1 17.9 23.9L23.4 20.5C24.3 21.4 25.5 22 26.5 22C29 22 31 20 31 17.5C31 15 29 13 26.5 13Z"
            fill="white"
          />
        </svg>
      );

    case 'playstation':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="#003791" />
          <path
            d="M17.5 11V26.5L21.5 28V14C23 14.5 24 15.5 24 17C24 18.5 23 19.5 21.5 19.8V23C24.5 22.5 27 20.5 27 17C27 13.5 23.5 11 17.5 11ZM11 26C11 28 14 29.5 18.5 29.5C20.5 29.5 22.5 29 24 28L15 25C13.5 24.5 12.5 24.2 12.5 23.5C12.5 22.8 13.2 22.5 14.5 22.5C15.8 22.5 17 22.8 18 23.2V20C16.8 19.5 15.5 19.2 14.5 19.2C12 19.2 11 20.8 11 22.5C11 24.2 11.5 25.2 12.5 25.8L11 26Z"
            fill="white"
          />
        </svg>
      );

    default:
      if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
        return (
          <img
            src={imageUrl}
            alt={name}
            className={`${className} object-contain transition-transform duration-300 group-hover:scale-110`}
            loading="lazy"
            onError={(e) => {
              // fallback to generic reward coin
              e.currentTarget.style.display = 'none';
            }}
          />
        );
      }
      return (
        <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-base">
          {name.charAt(0).toUpperCase()}
        </div>
      );
  }
};

export default RewardLogo;
