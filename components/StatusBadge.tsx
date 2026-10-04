import React from 'react';
import type { Transaction } from '../types';

interface StatusConfig {
    bg: string;
    text: string;
    icon: string;
}

const statusConfig: Record<Transaction['status'], StatusConfig> = {
    Completed: {
        bg: 'bg-green-100 dark:bg-green-900/50',
        text: 'text-green-800 dark:text-green-300',
        icon: 'fas fa-check-circle',
    },
    Pending: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/50',
        text: 'text-yellow-800 dark:text-yellow-300',
        icon: 'fas fa-hourglass-half',
    },
    Failed: {
        bg: 'bg-red-100 dark:bg-red-900/50',
        text: 'text-red-800 dark:text-red-300',
        icon: 'fas fa-times-circle',
    },
    Rejected: {
        bg: 'bg-red-100 dark:bg-red-900/50',
        text: 'text-red-800 dark:text-red-300',
        icon: 'fas fa-ban',
    },
};

const StatusBadge: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
    const config = statusConfig[status] || { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-800 dark:text-slate-300', icon: 'fas fa-question-circle' };

    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${config.bg} ${config.text}`}>
            <i className={config.icon}></i>
            <span>{status}</span>
        </span>
    );
};

export default StatusBadge;
