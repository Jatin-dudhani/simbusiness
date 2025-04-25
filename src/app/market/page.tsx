'use client';

import { useState } from 'react';
import { MarketData } from '@/types';

export default function MarketAnalysis() {
  const [marketData, setMarketData] = useState<MarketData>({
    trends: [
      { category: 'Electronics', growth: 12.5, demand: 'High' },
      { category: 'Fashion', growth: 8.3, demand: 'Medium' },
      { category: 'Home & Garden', growth: 15.7, demand: 'High' },
      { category: 'Beauty', growth: 9.2, demand: 'Medium' },
      { category: 'Sports', growth: 7.6, demand: 'Medium' },
      { category: 'Toys', growth: 5.4, demand: 'Low' },
    ],
    recommendations: [
      { name: 'Wireless Earbuds', category: 'Electronics', price: 35.99, margin: 45, popularity: 92 },
      { name: 'Portable Phone Charger', category: 'Electronics', price: 25.99, margin: 60, popularity: 88 },
      { name: 'LED Strip Lights', category: 'Home & Garden', price: 18.99, margin: 70, popularity: 85 },
      { name: 'Yoga Mat', category: 'Sports', price: 29.99, margin: 55, popularity: 82 },
      { name: 'Kitchen Gadgets Set', category: 'Home & Garden', price: 22.99, margin: 65, popularity: 78 },
    ]
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Market Trends */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Market Trends</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Category</th>
                    <th className="pb-2">Growth (%)</th>
                    <th className="pb-2">Demand</th>
                    <th className="pb-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.trends.map((trend, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{trend.category}</td>
                      <td className="py-2">
                        <span className={`${trend.growth > 10 ? 'text-green-600' : trend.growth < 6 ? 'text-red-600' : 'text-yellow-600'}`}>
                          {trend.growth}%
                        </span>
                      </td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          trend.demand === 'High' 
                            ? 'bg-green-100 text-green-800' 
                            : trend.demand === 'Medium' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {trend.demand}
                        </span>
                      </td>
                      <td className="py-2">
                        <button className="text-primary hover:underline">Explore</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Product Recommendations */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Product Recommendations</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Product</th>
                    <th className="pb-2">Category</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">Margin</th>
                    <th className="pb-2">Popularity</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.recommendations.map((product, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{product.name}</td>
                      <td className="py-2">{product.category}</td>
                      <td className="py-2">${product.price}</td>
                      <td className="py-2">{product.margin}%</td>
                      <td className="py-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${product.popularity}%` }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Market Research */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card">
            <h3 className="text-lg font-bold mb-2">Consumer Behavior</h3>
            <p className="text-gray-600 mb-4">
              Current consumer trends show a preference for sustainable products with minimal packaging.
              Online shopping continues to grow with mobile purchases accounting for 67% of all e-commerce transactions.
            </p>
            <button className="text-primary hover:underline">View Full Report</button>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-bold mb-2">Competitor Analysis</h3>
            <p className="text-gray-600 mb-4">
              Major competitors in the dropshipping space are focusing on faster shipping times and exclusive product deals.
              Price competition remains fierce in electronics and fashion categories.
            </p>
            <button className="text-primary hover:underline">View Full Report</button>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-bold mb-2">Emerging Markets</h3>
            <p className="text-gray-600 mb-4">
              Eco-friendly products, home fitness equipment, and smart home devices show strong growth potential.
              International markets in Southeast Asia are opening up with fewer shipping restrictions.
            </p>
            <button className="text-primary hover:underline">View Full Report</button>
          </div>
        </div>
      </main>
    </div>
  );
} 