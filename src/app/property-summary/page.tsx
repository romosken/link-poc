'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTokens, consumeTokens, TOKEN_COSTS } from '@/utils/tokens';

interface PropertyData {
    address: string;
    marketValue: number;
    afterReformValue: number;
    mortgageBalance: number;
    monthlyPayment: number;
    interestRate: number;
    debtAmount: number;
    liens: Array<{ type: string; amount: number; priority: number }>;
    propertySize: {
        bedrooms: number;
        bathrooms: number;
        squareFeet: number;
        lotSize: string;
    };
    rentalPotential: {
        monthlyRent: number;
        annualRent: number;
        capRate: number;
        cashFlow: number;
    };
    neighborhood: {
        crimeRate: string;
        schoolRating: number;
        walkScore: number;
        transitScore: number;
    };
    investmentMetrics: {
        roi: number;
        cashOnCashReturn: number;
        grossRentMultiplier: number;
        breakEvenRatio: number;
    };
    recentSales: Array<{
        address: string;
        salePrice: number;
        saleDate: string;
        pricePerSqFt: number;
    }>;
}

export default function PropertySummaryPage() {
    const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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
            return;
        }
        setIsAuthenticated(true);

        // Get searched address
        const searchedAddress = localStorage.getItem('searchedAddress');
        if (!searchedAddress) {
            router.push('/search');
            return;
        }

        // Simulate loading property data
        setTimeout(() => {
            setPropertyData({
                address: searchedAddress,
                marketValue: 485000,
                afterReformValue: 625000,
                mortgageBalance: 320000,
                monthlyPayment: 1850,
                interestRate: 6.5,
                debtAmount: 45000,
                liens: [
                    { type: 'Property Tax Lien', amount: 8500, priority: 1 },
                    { type: 'HOA Lien', amount: 3200, priority: 2 },
                    { type: 'Mechanics Lien', amount: 12000, priority: 3 }
                ],
                propertySize: {
                    bedrooms: 3,
                    bathrooms: 2,
                    squareFeet: 1850,
                    lotSize: '0.25 acres'
                },
                rentalPotential: {
                    monthlyRent: 3200,
                    annualRent: 38400,
                    capRate: 7.9,
                    cashFlow: 1350
                },
                neighborhood: {
                    crimeRate: 'Low',
                    schoolRating: 8.5,
                    walkScore: 78,
                    transitScore: 65
                },
                investmentMetrics: {
                    roi: 12.3,
                    cashOnCashReturn: 18.7,
                    grossRentMultiplier: 12.6,
                    breakEvenRatio: 0.58
                },
                recentSales: [
                    { address: '125 Main St', salePrice: 465000, saleDate: '2024-01-15', pricePerSqFt: 251 },
                    { address: '127 Main St', salePrice: 498000, saleDate: '2024-02-03', pricePerSqFt: 269 },
                    { address: '129 Main St', salePrice: 472000, saleDate: '2024-01-28', pricePerSqFt: 255 }
                ]
            });
            setIsLoading(false);
        }, 2000);
    }, [router]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatPercentage = (value: number) => {
        return `${value.toFixed(1)}%`;
    };


    if (!isClient || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-500">Analyzing Property Data...</h2>
                    <p className="text-gray-500 mt-2">This may take a few moments</p>
                </div>
            </div>
        );
    }

    if (!propertyData) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-500">No property data found</h2>
                    <button
                        onClick={() => router.push('/search')}
                        className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                    >
                        Search Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Property Address */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-500 mb-2">Property Address</h2>
                    <p className="text-lg text-gray-500">{propertyData.address}</p>
                </div>

                {/* Key Financial Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Market Value</h3>
                        <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(propertyData.marketValue)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">After Reform Value</h3>
                        <p className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(propertyData.afterReformValue)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Monthly Cash Flow</h3>
                        <p className="text-2xl font-bold text-purple-600 mt-2">{formatCurrency(propertyData.rentalPotential.cashFlow)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">ROI</h3>
                        <p className="text-2xl font-bold text-indigo-600 mt-2">{formatPercentage(propertyData.investmentMetrics.roi)}</p>
                    </div>
                </div>

                {/* Detailed Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Financial Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-500 mb-4">Financial Information</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Mortgage Balance:</span>
                                <span className="font-medium text-gray-500">{formatCurrency(propertyData.mortgageBalance)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Monthly Payment:</span>
                                <span className="font-medium text-gray-500">{formatCurrency(propertyData.monthlyPayment)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Interest Rate:</span>
                                <span className="font-medium text-gray-500">{formatPercentage(propertyData.interestRate)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Other Debt:</span>
                                <span className="font-medium text-gray-500">{formatCurrency(propertyData.debtAmount)}</span>
                            </div>
                        </div>

                        <h4 className="text-md font-semibold text-gray-500 mt-6 mb-3">Liens & Encumbrances</h4>
                        <div className="space-y-2">
                            {propertyData.liens.map((lien, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span className="text-gray-500">{lien.type}:</span>
                                    <span className="font-medium text-gray-500">{formatCurrency(lien.amount)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-500 mb-4">Property Details</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Bedrooms:</span>
                                <span className="font-medium text-gray-500">{propertyData.propertySize.bedrooms}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Bathrooms:</span>
                                <span className="font-medium text-gray-500">{propertyData.propertySize.bathrooms}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Square Feet:</span>
                                <span className="font-medium text-gray-500">{propertyData.propertySize.squareFeet.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Lot Size:</span>
                                <span className="font-medium text-gray-500">{propertyData.propertySize.lotSize}</span>
                            </div>
                        </div>

                        <h4 className="text-md font-semibold text-gray-500 mt-6 mb-3">Neighborhood</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Crime Rate:</span>
                                <span className="font-medium text-gray-500">{propertyData.neighborhood.crimeRate}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">School Rating:</span>
                                <span className="font-medium text-gray-500">{propertyData.neighborhood.schoolRating}/10</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Walk Score:</span>
                                <span className="font-medium text-gray-500">{propertyData.neighborhood.walkScore}/100</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Transit Score:</span>
                                <span className="font-medium text-gray-500">{propertyData.neighborhood.transitScore}/100</span>
                            </div>
                        </div>
                    </div>

                    {/* Rental Analysis */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-500 mb-4">Rental Analysis</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Monthly Rent:</span>
                                <span className="font-medium text-gray-500">{formatCurrency(propertyData.rentalPotential.monthlyRent)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Annual Rent:</span>
                                <span className="font-medium text-gray-500">{formatCurrency(propertyData.rentalPotential.annualRent)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Cap Rate:</span>
                                <span className="font-medium text-gray-500">{formatPercentage(propertyData.rentalPotential.capRate)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Monthly Cash Flow:</span>
                                <span className="font-medium text-green-600">{formatCurrency(propertyData.rentalPotential.cashFlow)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Investment Metrics */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-500 mb-4">Investment Metrics</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-500">ROI:</span>
                                <span className="font-medium text-green-600">{formatPercentage(propertyData.investmentMetrics.roi)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Cash-on-Cash Return:</span>
                                <span className="font-medium text-blue-600">{formatPercentage(propertyData.investmentMetrics.cashOnCashReturn)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Gross Rent Multiplier:</span>
                                <span className="font-medium text-gray-500">{propertyData.investmentMetrics.grossRentMultiplier.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Break-Even Ratio:</span>
                                <span className="font-medium text-gray-500">{propertyData.investmentMetrics.breakEvenRatio.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Sales */}
                <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-500 mb-4">Recent Sales in Area</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sale Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sale Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Sq Ft</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {propertyData.recentSales.map((sale, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.address}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(sale.salePrice)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.saleDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(sale.pricePerSqFt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Investment Recommendation */}
                <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-500 mb-4">Investment Recommendation</h3>
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-gray-500">
                                <strong>Strong Investment Opportunity:</strong> This property shows excellent potential with a{" "}
                                {formatPercentage(propertyData.investmentMetrics.roi)} ROI and positive cash flow of{" "}
                                {formatCurrency(propertyData.rentalPotential.cashFlow)} per month. The after-reform value
                                of {formatCurrency(propertyData.afterReformValue)} represents significant upside potential.
                                The neighborhood scores well with low crime rates and good school ratings.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-500 mb-4">Next Steps</h3>
                    <p className="text-gray-500 mb-6">
                        Based on this analysis, you can either proceed with further consultation or explore other opportunities.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => {
                                // Check if user has enough tokens for consultant
                                if (getTokens() < TOKEN_COSTS.CONSULTANT_REQUEST) {
                                    alert(`Insufficient tokens! You need ${TOKEN_COSTS.CONSULTANT_REQUEST} tokens to request consultant analysis. You currently have ${getTokens()} tokens.`);
                                    return;
                                }

                                // Consume tokens for consultant request
                                const success = consumeTokens(TOKEN_COSTS.CONSULTANT_REQUEST);
                                if (!success) {
                                    alert('Failed to consume tokens. Please try again.');
                                    return;
                                }

                                // Trigger token counter update
                                window.dispatchEvent(new Event('tokenUpdate'));

                                // Simulate sending to consultant
                                alert(`Property analysis has been sent to our investment consultant. You will receive a detailed report within 24 hours. (${TOKEN_COSTS.CONSULTANT_REQUEST} tokens consumed)`);
                                router.push('/search');
                            }}
                            className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Send to Consultant for Further Analysis
                        </button>

                        <button
                            onClick={() => {
                                // Simulate discarding property
                                if (confirm('Are you sure you want to discard this property analysis? This action cannot be undone.')) {
                                    alert('Property analysis discarded. You can search for other properties.');
                                    router.push('/search');
                                }
                            }}
                            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Discard This Property
                        </button>
                    </div>

                    <div className="mt-4 text-sm text-gray-500 text-center space-y-2">
                        <p>💡 <strong>Tip:</strong> Our consultants provide personalized investment strategies and detailed market insights.</p>
                        <p className="text-red-600 font-medium">
                            ⚠️ <strong>Token Cost:</strong> Consultant analysis will consume {TOKEN_COSTS.CONSULTANT_REQUEST} tokens
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
