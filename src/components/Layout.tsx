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
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('searchedAddress');
        setIsAuthenticated(false);
        router.push('/');
    };

    return (
        <div className="min-h-screen">
            {isClient && <TokenCounter />}
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
