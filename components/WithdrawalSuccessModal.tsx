import React, { useEffect, useState } from 'react';

interface WithdrawalSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const WithdrawalSuccessModal: React.FC<WithdrawalSuccessModalProps> = ({ isOpen, onClose }) => {
    // This local state ensures the component doesn't disappear abruptly during the closing animation.
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
    
    // Don't render anything if it's not supposed to be on the screen
    if (!isRendered) {
        return null;
    }

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
            onTransitionEnd={handleTransitionEnd}
            aria-modal="true"
            role="dialog"
        >
            <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm"></div>
            <div
                className={`relative bg-white dark:bg-[#141c2f] text-slate-800 dark:text-slate-200 p-8 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-sm w-full m-4 transform transition-all duration-300 ease-in-out text-center overflow-hidden ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={e => e.stopPropagation()}
            >
                {isOpen && (
                    <div className="confetti-container">
                        {[...Array(50)].map((_, i) => <div key={i} className="confetti-piece-modal"></div>)}
                    </div>
                )}
                <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-check text-3xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Congratulations!</h2>
                <p className="text-slate-500 dark:text-slate-400">
                    Your withdrawal request was successful. It is now pending and will be completed after admin review.
                </p>
                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default WithdrawalSuccessModal;
