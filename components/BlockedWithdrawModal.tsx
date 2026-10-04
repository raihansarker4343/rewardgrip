import React, { useEffect, useState } from "react";

interface BlockedWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlockedWithdrawModal: React.FC<BlockedWithdrawModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    }
  }, [isOpen]);

  const handleTransitionEnd = () => {
    if (!isOpen) {
      setIsRendered(false);
    }
  };

  if (!isRendered) return null;

  return (
    <div 
      className={`fixed inset-0 z-[60] flex items-center justify-center transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onTransitionEnd={handleTransitionEnd}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={`
          relative 
          bg-white dark:bg-[#141c2f] 
          text-slate-800 dark:text-slate-200 
          p-8 rounded-xl 
          shadow-2xl 
          border border-slate-200 dark:border-slate-700 
          max-w-sm w-full m-4 
          text-center 
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
            onClick={onClose} 
            className="absolute -top-4 -right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close modal"
        >
            <i className="fas fa-times"></i>
        </button>

        {/* Icon */}
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-red-50 dark:ring-red-900/10">
          <i className="fas fa-ban text-3xl"></i>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Withdrawals Restricted
        </h2>

        {/* Message */}
        <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm leading-relaxed">
          Your account is currently restricted from making withdrawals. This action is often taken for security reviews.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onClose} 
            // Ideally this would open the support chat:
            // onClick={() => { onClose(); openSupportChat(); }}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
          >
            <i className="fas fa-headset"></i>
            Contact Support
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-400 font-semibold py-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockedWithdrawModal;