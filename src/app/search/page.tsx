'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTokens, consumeTokens, TOKEN_COSTS } from '@/utils/tokens';

export default function SearchPage() {
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Mark as client-side rendered
        setIsClient(true);

        // Check authentication
        const authStatus = localStorage.getItem('isAuthenticated');
        if (!authStatus) {
            router.push('/');
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address.trim()) return;

        // Check if user has enough tokens
        if (getTokens() < TOKEN_COSTS.PROPERTY_ANALYSIS) {
            alert(`Insufficient tokens! You need ${TOKEN_COSTS.PROPERTY_ANALYSIS} tokens to analyze a property. You currently have ${getTokens()} tokens.`);
            return;
        }

        // Consume tokens for property analysis
        const success = consumeTokens(TOKEN_COSTS.PROPERTY_ANALYSIS);
        if (!success) {
            alert('Failed to consume tokens. Please try again.');
            return;
        }

        // Trigger token counter update
        window.dispatchEvent(new Event('tokenUpdate'));

        setIsLoading(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Store the searched address and navigate to results
        localStorage.setItem('searchedAddress', address);
        router.push('/property-summary');
    };


    if (!isClient || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-500 mb-4">
                        Find Property Investment Opportunities
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Enter any address to get comprehensive property analysis including market value,
                        mortgage information, and investment potential.
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-500 mb-2">
                                Property Address
                            </label>
                            <input
                                id="address"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter full address (e.g., 123 Main St, New York, NY 10001)"
                                className="w-full px-4 py-3 border border-gray-300 text-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !address.trim()}
                            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Analyzing Property...
                                </div>
                            ) : (
                                'Analyze Property'
                            )}
                        </button>

                        <div className="mt-3 text-center">
                            <p className="text-sm text-gray-500">
                                ⚠️ <strong>Token Cost:</strong> This analysis will consume {TOKEN_COSTS.PROPERTY_ANALYSIS} tokens
                            </p>
                        </div>
                    </form>
                </div>

                {/* Features */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-500 mb-2">Market Analysis</h3>
                        <p className="text-gray-500">Get current market value and price trends for the property</p>
                    </div>

                    <div className="text-center">
                        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-500 mb-2">Financial Data</h3>
                        <p className="text-gray-500">Access mortgage, debt, and lien information</p>
                    </div>

                    <div className="text-center">
                        <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-500 mb-2">Investment Insights</h3>
                        <p className="text-gray-500">After-reform value and rental potential analysis</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
