'use client';

import { useState, useEffect } from 'react';
import { MarketData } from '@/types';
import { FiArrowUp, FiArrowDown, FiTrendingUp, FiInfo, FiBarChart2, FiStar, FiShoppingBag, FiClock } from 'react-icons/fi';
import { fetchCategories } from '@/services/api';

// Current real-world market data
const CURRENT_YEAR = new Date().getFullYear();

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
  
  const [activeTab, setActiveTab] = useState('overview');
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [showTip, setShowTip] = useState<string | null>(null);

  useEffect(() => {
    // Fetch available categories for educational purposes
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    
    loadCategories();
  }, []);

  // Educational content - Real world tips
  const marketingTips = [
    "Use social media to create brand recognition before launching products",
    "Monitor competitors' pricing strategies to stay competitive",
    "Focus on products with at least 30% profit margin for sustainability",
    "Evaluate shipping times and costs before committing to suppliers",
    "Test products with small inventory before scaling up",
    "Consider seasonal trends in your product selection",
    "Analyze customer reviews to identify product improvement opportunities"
  ];

  // Real-world business challenges
  const businessScenarios = [
    {
      id: 'supply-chain',
      title: 'Supply Chain Disruption',
      description: 'Your main supplier has experienced a production delay, affecting your most popular product line.',
      options: [
        {
          text: 'Find an alternative supplier immediately',
          outcome: 'Quick resolution but 15% higher costs and potentially different product quality',
          impact: { revenue: -5, reputation: 0, longTerm: -10 }
        },
        {
          text: 'Notify customers and offer discount coupons for the delay',
          outcome: 'Maintains customer trust but reduces immediate profits',
          impact: { revenue: -10, reputation: +5, longTerm: +5 }
        },
        {
          text: 'Temporarily remove products from your store',
          outcome: 'Avoids negative reviews but loses sales opportunities',
          impact: { revenue: -20, reputation: 0, longTerm: 0 }
        }
      ]
    },
    {
      id: 'competitor-pricing',
      title: 'Aggressive Competitor Pricing',
      description: 'A competitor has drastically reduced prices on similar products to what you offer.',
      options: [
        {
          text: 'Match their prices to stay competitive',
          outcome: 'Maintains sales volume but significantly reduces your profit margins',
          impact: { revenue: 0, reputation: 0, longTerm: -5 }
        },
        {
          text: 'Enhance product descriptions and highlight quality differences',
          outcome: 'Slower effect but maintains your brand positioning and margins',
          impact: { revenue: -5, reputation: +10, longTerm: +15 }
        },
        {
          text: 'Bundle products with accessories to provide better value',
          outcome: 'Increases average order value while differentiating from competitors',
          impact: { revenue: +5, reputation: +5, longTerm: +5 }
        }
      ]
    },
    {
      id: 'shipping-costs',
      title: 'Rising Shipping Costs',
      description: 'Global shipping rates have increased by 25%, affecting your delivery costs.',
      options: [
        {
          text: 'Absorb the costs to maintain customer satisfaction',
          outcome: 'Preserves customer experience but reduces your profit',
          impact: { revenue: -15, reputation: +5, longTerm: 0 }
        },
        {
          text: 'Increase product prices to cover the additional shipping costs',
          outcome: 'Maintains profit margins but may reduce conversion rates',
          impact: { revenue: -5, reputation: -5, longTerm: -5 }
        },
        {
          text: 'Introduce a tiered shipping model with free shipping thresholds',
          outcome: 'Increases average order value but complicates your shipping policy',
          impact: { revenue: +10, reputation: 0, longTerm: +5 }
        }
      ]
    }
  ];

  // Market insights based on real-world data
  const marketInsights = [
    {
      title: 'Customer Acquisition',
      value: '$15-25',
      description: 'Average cost to acquire a new customer',
      trend: 'increasing',
      tip: 'Focus on retention strategies to maximize customer lifetime value',
    },
    {
      title: 'Conversion Rate',
      value: '1.5-3%',
      description: 'Average e-commerce conversion rate',
      trend: 'stable',
      tip: 'Improve product images and descriptions to boost conversions',
    },
    {
      title: 'Mobile Traffic',
      value: '67%',
      description: 'Percentage of e-commerce visits from mobile devices',
      trend: 'increasing',
      tip: 'Ensure your store is fully optimized for mobile browsing',
    },
    {
      title: 'Cart Abandonment',
      value: '70%',
      description: 'Average cart abandonment rate',
      trend: 'stable',
      tip: 'Implement abandonment emails and simplified checkout',
    }
  ];

  const handleScenarioSelect = (id: string) => {
    setActiveScenario(id === activeScenario ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Market Intelligence Center</h1>
        
        {/* Navigation Tabs */}
        <div className="mb-8 border-b">
          <div className="flex space-x-4">
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`py-2 px-4 font-medium ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Market Overview
            </button>
            <button 
              onClick={() => setActiveTab('scenarios')} 
              className={`py-2 px-4 font-medium ${activeTab === 'scenarios' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Business Scenarios
            </button>
            <button 
              onClick={() => setActiveTab('education')} 
              className={`py-2 px-4 font-medium ${activeTab === 'education' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Dropshipping Education
            </button>
          </div>
        </div>
        
        {/* Market Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Real-World Market Insights */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiBarChart2 className="text-primary" /> 
                {CURRENT_YEAR} E-commerce Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {marketInsights.map((insight, index) => (
                  <div key={index} className="card p-4 relative">
                    <div className="absolute top-3 right-3">
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => setShowTip(showTip === insight.title ? null : insight.title)}
                      >
                        <FiInfo size={18} />
                      </button>
                    </div>
                    <h3 className="font-semibold">{insight.title}</h3>
                    <div className="flex items-center gap-2 my-2">
                      <span className="text-2xl font-bold">{insight.value}</span>
                      {insight.trend === 'increasing' && (
                        <FiArrowUp className="text-green-500" />
                      )}
                      {insight.trend === 'decreasing' && (
                        <FiArrowDown className="text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                    
                    {showTip === insight.title && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-md text-sm border border-blue-100">
                        <p className="text-blue-800">{insight.tip}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Market Trends */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiTrendingUp className="text-primary" /> Current Market Trends
                </h2>
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
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiStar className="text-primary" /> Product Recommendations
                </h2>
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
          </>
        )}
        
        {/* Business Scenarios Tab */}
        {activeTab === 'scenarios' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Real-World Business Challenges</h2>
              <p className="text-gray-600">
                Test your decision-making skills with these common dropshipping business scenarios. 
                Each decision impacts your business differently in terms of revenue, reputation, and long-term growth.
              </p>
            </div>
            
            <div className="space-y-6">
              {businessScenarios.map((scenario) => (
                <div key={scenario.id} className="card">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => handleScenarioSelect(scenario.id)}
                  >
                    <h3 className="text-lg font-bold">{scenario.title}</h3>
                    <span className="text-lg">{activeScenario === scenario.id ? '−' : '+'}</span>
                  </div>
                  
                  <p className="my-3 text-gray-700">{scenario.description}</p>
                  
                  {activeScenario === scenario.id && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-3">How would you respond?</h4>
                      <div className="space-y-4">
                        {scenario.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start gap-4">
                              <div className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-gray-700 mt-0.5">
                                {optionIndex + 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{option.text}</p>
                                <p className="text-gray-600 mt-1">{option.outcome}</p>
                                
                                <div className="mt-3 grid grid-cols-3 gap-2">
                                  <div className="text-center">
                                    <p className="text-sm text-gray-500">Revenue Impact</p>
                                    <p className={`font-bold ${option.impact.revenue > 0 ? 'text-green-600' : option.impact.revenue < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                      {option.impact.revenue > 0 ? '+' : ''}{option.impact.revenue}%
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-sm text-gray-500">Reputation</p>
                                    <p className={`font-bold ${option.impact.reputation > 0 ? 'text-green-600' : option.impact.reputation < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                      {option.impact.reputation > 0 ? '+' : ''}{option.impact.reputation}%
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-sm text-gray-500">Long-term Growth</p>
                                    <p className={`font-bold ${option.impact.longTerm > 0 ? 'text-green-600' : option.impact.longTerm < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                      {option.impact.longTerm > 0 ? '+' : ''}{option.impact.longTerm}%
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Dropshipping Education Tab */}
        {activeTab === 'education' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Dropshipping Education Center</h2>
              <p className="text-gray-600">
                Learn the fundamentals of running a successful dropshipping business with these educational resources.
              </p>
            </div>
            
            {/* Product Selection Guide */}
            <div className="card mb-6">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <FiShoppingBag className="text-primary" /> Product Selection Guide
              </h3>
              
              <div className="mb-4">
                <h4 className="font-medium mb-2">Available Categories from API:</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
              
              <h4 className="font-medium mb-2">Evaluation Criteria for Products:</h4>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li><strong>Profit Margin:</strong> Target 30%+ profit margins for sustainable business</li>
                <li><strong>Shipping Weight:</strong> Lighter products reduce shipping costs and complexities</li>
                <li><strong>Competition Level:</strong> Balance between proven demand and market saturation</li>
                <li><strong>Sellability:</strong> Products that solve problems or fulfill desires sell better</li>
                <li><strong>Trend Stability:</strong> Avoid very seasonal or fad products unless you can adapt quickly</li>
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2">Product Research Methods</h4>
                <ol className="list-decimal pl-5 text-blue-700 space-y-1">
                  <li>Analyze top competitors' bestsellers</li>
                  <li>Use Google Trends to verify product demand stability</li>
                  <li>Check social media (particularly Pinterest and Instagram) for trending products</li>
                  <li>Review Amazon bestsellers in relevant categories</li>
                  <li>Subscribe to supplier newsletters for new product announcements</li>
                </ol>
              </div>
            </div>
            
            {/* Supplier Management */}
            <div className="card mb-6">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <FiClock className="text-primary" /> Supplier Management
              </h3>
              
              <h4 className="font-medium mb-2">Supplier Evaluation Checklist:</h4>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li><strong>Reliability:</strong> Consistent product quality and shipping times</li>
                <li><strong>Communication:</strong> Responsive to inquiries within 24-48 hours</li>
                <li><strong>Shipping Options:</strong> Offers ePacket or similar fast shipping methods</li>
                <li><strong>Inventory Management:</strong> Maintains adequate stock levels</li>
                <li><strong>Product Images:</strong> Provides high-quality images for your store</li>
                <li><strong>Order Processing:</strong> Efficient handling of orders with low error rates</li>
              </ul>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-4">
                <h4 className="font-medium text-yellow-800 mb-2">⚠️ Common Supplier Issues</h4>
                <ul className="list-disc pl-5 text-yellow-700 space-y-1">
                  <li>Unexpected inventory shortages during high demand periods</li>
                  <li>Shipping delays during holiday seasons</li>
                  <li>Product quality inconsistencies between batches</li>
                  <li>Packaging changes without notification</li>
                  <li>Price increases without advance notice</li>
                </ul>
              </div>
              
              <p className="text-gray-700">
                <strong>Pro Tip:</strong> Always test products by ordering samples before listing them in your store. 
                This helps you verify quality, shipping times, and packaging.
              </p>
            </div>
            
            {/* Marketing Tips */}
            <div className="card mb-6">
              <h3 className="text-lg font-bold mb-3">Marketing Strategies</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">Customer Acquisition</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Facebook/Instagram ads targeting specific interests</li>
                    <li>Google Shopping ads for high-intent buyers</li>
                    <li>Influencer partnerships in your niche</li>
                    <li>Content marketing to attract organic traffic</li>
                    <li>Pinterest marketing for visual products</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Customer Retention</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Email marketing sequences with personalized offers</li>
                    <li>Loyalty programs with points or rewards</li>
                    <li>Re-engagement campaigns for past customers</li>
                    <li>Post-purchase follow-ups and satisfaction surveys</li>
                    <li>Exclusive discounts for repeat customers</li>
                  </ul>
                </div>
              </div>
              
              <h4 className="font-medium mb-2">Daily Dropshipping Tips:</h4>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="italic text-gray-700">{marketingTips[Math.floor(Math.random() * marketingTips.length)]}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 