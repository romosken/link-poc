'use client';

import { useState, useEffect } from 'react';
import { getTokens } from '@/utils/tokens';

export default function TokenCounter() {
    const [tokens, setTokens] = useState(0);

    useEffect(() => {
        setTokens(getTokens());

        // Listen for token changes
        const handleStorageChange = () => {
            setTokens(getTokens());
        };

        window.addEventListener('storage', handleStorageChange);

        // Custom event for same-tab updates
        const handleTokenUpdate = () => {
            setTokens(getTokens());
        };

        window.addEventListener('tokenUpdate', handleTokenUpdate);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('tokenUpdate', handleTokenUpdate);
        };
    }, []);

    const getTokenColor = () => {
        if (tokens >= 20) return 'text-green-600 bg-green-100';
        if (tokens >= 10) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    return (
        <div className={`fixed top-4 right-4 z-50 px-3 py-2 rounded-full text-sm font-medium ${getTokenColor()} shadow-lg border`}>
            <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{tokens} tokens</span>
            </div>
        </div>
    );
}
