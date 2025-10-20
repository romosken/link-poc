'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import TokenCounter from '@/components/TokenCounter';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const authStatus = localStorage.getItem('isAuthenticated');
        setIsAuthenticated(!!authStatus);

        // Listen for custom auth events to update state
        const handleAuthChange = () => {
            const newAuthStatus = localStorage.getItem('isAuthenticated');
            setIsAuthenticated(!!newAuthStatus);
        };

        // Also check auth status periodically in case events don't fire
        const interval = setInterval(() => {
            const currentAuthStatus = localStorage.getItem('isAuthenticated');
            setIsAuthenticated(prev => {
                const newAuth = !!currentAuthStatus;
                return newAuth !== prev ? newAuth : prev;
            });
        }, 1000);

        window.addEventListener('authChange', handleAuthChange);

        return () => {
            window.removeEventListener('authChange', handleAuthChange);
            clearInterval(interval);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('searchedAddress');
        setIsAuthenticated(false);
        // Dispatch custom event to notify layout of auth change
        window.dispatchEvent(new Event('authChange'));
        router.push('/');
    };

    return (
        <div className="min-h-screen">
            {isClient && isAuthenticated && <TokenCounter />}
            {/* Header with Logo and Navigation */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Image
                                src="/logo.png"
                                alt="Link Realty Consulting Logo"
                                width={120}
                                height={60}
                                className="h-12 w-auto"
                                priority
                            />
                        </div>

                        {/* Navigation Menu */}
                        {isClient && isAuthenticated && (
                            <nav className="flex items-center space-x-6">
                                <Link
                                    href="/search"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                >
                                    New Search
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                >
                                    Logout
                                </button>
                            </nav>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>
        </div>
    );
}
