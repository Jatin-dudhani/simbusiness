'use client';

import React, { useState } from 'react';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiBarChart2, 
  FiTarget, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiAward, 
  FiLayers,
  FiArrowRight,
  FiBookOpen
} from 'react-icons/fi';
import Link from 'next/link';

interface ScenarioOption {
  text: string;
  outcome: string;
  impact: { revenue: number; reputation: number; margin: number };
}

interface Scenario {
  id: string;
  title: string;
  context: string;
  options: ScenarioOption[];
}

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState<'trends' | 'scenarios' | 'playbook'>('trends');
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);

  const marketTrends = [
    { category: 'Minimalist Electronics & Audio', growth: 16.8, demand: 'High', margin: 42, saturation: 'Medium' },
    { category: 'Ergonomic Home Office & Desk Gear', growth: 14.2, demand: 'High', margin: 55, saturation: 'Low' },
    { category: 'Functional Fitness & Recovery Tools', growth: 11.5, demand: 'Medium', margin: 48, saturation: 'Medium' },
    { category: 'Sustainable Kitchen & Coffee Accessories', growth: 18.4, demand: 'High', margin: 62, saturation: 'Low' },
    { category: 'Everyday Carry & Waxed Canvas Bags', growth: 9.7, demand: 'Medium', margin: 50, saturation: 'High' },
    { category: 'Pet Care & Smart Feeders', growth: 13.1, demand: 'High', margin: 38, saturation: 'High' },
  ];

  const businessScenarios: Scenario[] = [
    {
      id: 'sc_supplier_delay',
      title: 'Wholesale Port Freight Congestion',
      context: 'Your primary supplier reports a 14-day production freeze right as your store ad campaign begins scaling. Over 80 customer orders are queued without immediate tracking numbers.',
      options: [
        {
          text: 'Expedite backup inventory via air freight at $14 extra cost per unit',
          outcome: 'Customer delivery timeline preserved, but shrinks net margin by 35% on current batch.',
          impact: { revenue: 0, reputation: +15, margin: -35 }
        },
        {
          text: 'Send proactive delay email with a $15 store gift card and apology',
          outcome: 'Maintains long-term brand goodwill with negligible return spike, absorbing a minor gift liability.',
          impact: { revenue: -5, reputation: +20, margin: -10 }
        },
        {
          text: 'Keep silent and ship whenever stock arrives',
          outcome: 'High chargeback/dispute rate (Stripe penalty) and negative customer review flood.',
          impact: { revenue: -25, reputation: -40, margin: 0 }
        }
      ]
    },
    {
      id: 'sc_competitor_war',
      title: 'Aggressive Competitor Price Undercutting',
      context: 'A competitor launched identical product creative on TikTok and undercut your retail price by 35%, cutting your daily sales velocity by half.',
      options: [
        {
          text: 'Engage in a price-matching race to the bottom',
          outcome: 'Restores volume temporarily but obliterates profit margins and invites cash flow bleed.',
          impact: { revenue: -15, reputation: -5, margin: -50 }
        },
        {
          text: 'Create a "Buy 1 Get 1 at 40% Off" bundle with premium branded packaging',
          outcome: 'Boosts Average Order Value (AOV) and differentiates on customer unboxing experience.',
          impact: { revenue: +25, reputation: +15, margin: +10 }
        },
        {
          text: 'Shift ad creatives from generic features to authentic problem-solution UGC',
          outcome: 'Improves Click-Through-Rate (CTR) and insulates pricing power through social proof.',
          impact: { revenue: +20, reputation: +25, margin: +15 }
        }
      ]
    },
    {
      id: 'sc_ad_fatigue',
      title: 'Meta & TikTok Ad Creative Saturation',
      context: 'Your hero video ad creative reached ad fatigue: Cost Per Mille (CPM) rose 40% and Cost Per Acquisition (CPA) jumped from $12 to $28, turning daily ads unprofitable.',
      options: [
        {
          text: 'Pause the campaign immediately and batch-produce 5 new creative hooks',
          outcome: 'Halts ad budget leakage while testing new audience angles and hooks with fresh creatives.',
          impact: { revenue: -10, reputation: 0, margin: +30 }
        },
        {
          text: 'Increase daily ad budget hoping the algorithmic auction stabilizes',
          outcome: 'Burns through marketing reserves rapidly with worsening efficiency.',
          impact: { revenue: 0, reputation: 0, margin: -45 }
        },
        {
          text: 'Pivot toward retargeting abandoned cart visitors via automated email flows',
          outcome: 'Extracts high-margin sales from existing website traffic at zero additional ad cost.',
          impact: { revenue: +15, reputation: +10, margin: +40 }
        }
      ]
    }
  ];

  const currentScenario = businessScenarios[selectedScenarioIndex];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-mono badge-mono-black">Market Intelligence</span>
              <span className="text-xs text-zinc-500 font-mono">Strategic Analytics</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white mt-1">
              Industry Trends & Decision Scenarios
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Identify high-margin emerging niches and test executive responses to realistic e-commerce crises.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setActiveTab('trends')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'trends'
                  ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Niche Growth
            </button>
            <button
              onClick={() => setActiveTab('scenarios')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'scenarios'
                  ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Crisis Simulator
            </button>
            <button
              onClick={() => setActiveTab('playbook')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'playbook'
                  ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Operator Playbook
            </button>
          </div>
        </div>

        {/* Tab 1: Niche Growth Trends */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-4">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">
                    High-Margin Category Growth Matrix
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Aggregated market velocity across wholesale fulfillment channels</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                      <th className="pb-3">Product Category</th>
                      <th className="pb-3">YoY Demand Growth</th>
                      <th className="pb-3">Typical Net Margin</th>
                      <th className="pb-3">Ad Saturation</th>
                      <th className="pb-3">Demand Velocity</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {marketTrends.map((t) => (
                      <tr key={t.category} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                        <td className="py-3 font-semibold text-black dark:text-white">{t.category}</td>
                        <td className="py-3 font-mono">
                          <span className="flex items-center gap-1 font-bold text-black dark:text-white">
                            <FiTrendingUp className="w-3.5 h-3.5" /> +{t.growth}%
                          </span>
                        </td>
                        <td className="py-3 font-mono">{t.margin}% Average</td>
                        <td className="py-3">
                          <span className="badge-mono badge-mono-outline">{t.saturation}</span>
                        </td>
                        <td className="py-3">
                          <span className={`badge-mono ${t.demand === 'High' ? 'badge-mono-black' : 'badge-mono-outline'}`}>
                            {t.demand}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            href="/products"
                            className="btn btn-outline text-[11px] py-1 px-2.5"
                          >
                            Browse Products →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Decision Scenarios */}
        {activeTab === 'scenarios' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Scenario Navigation List */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Available Scenarios</span>
              {businessScenarios.map((sc, index) => (
                <div
                  key={sc.id}
                  onClick={() => {
                    setSelectedScenarioIndex(index);
                    setSelectedOptionIndex(null);
                  }}
                  className={`card p-4 cursor-pointer transition-all border ${
                    selectedScenarioIndex === index
                      ? 'border-black dark:border-white shadow-md'
                      : 'hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Case Study 0{index + 1}</span>
                  <h3 className="font-bold text-sm text-black dark:text-white mt-1">{sc.title}</h3>
                </div>
              ))}
            </div>

            {/* Scenario Detail & Options */}
            <div className="lg:col-span-8">
              <div className="card p-6">
                <span className="badge-mono badge-mono-outline mb-2">Scenario Analysis</span>
                <h2 className="text-xl font-bold text-black dark:text-white mt-1">
                  {currentScenario.title}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-3 leading-relaxed p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  {currentScenario.context}
                </p>

                <h3 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white mt-6 mb-3">
                  Choose Strategic Response:
                </h3>

                <div className="space-y-3">
                  {currentScenario.options.map((opt, oIndex) => {
                    const isChosen = selectedOptionIndex === oIndex;
                    return (
                      <div
                        key={oIndex}
                        onClick={() => setSelectedOptionIndex(oIndex)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isChosen
                            ? 'border-black dark:border-white bg-zinc-50 dark:bg-zinc-900 shadow-sm'
                            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border mt-0.5 ${
                            isChosen
                              ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                              : 'border-zinc-400 text-zinc-500'
                          }`}>
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-black dark:text-white">{opt.text}</p>
                            
                            {isChosen && (
                              <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 animate-in fade-in">
                                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                  <strong>Projected Outcome:</strong> {opt.outcome}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-mono">
                                  <span>Revenue: <strong>{opt.impact.revenue > 0 ? '+' : ''}{opt.impact.revenue}%</strong></span>
                                  <span>Reputation: <strong>{opt.impact.reputation > 0 ? '+' : ''}{opt.impact.reputation} pts</strong></span>
                                  <span>Net Margin Shift: <strong>{opt.impact.margin > 0 ? '+' : ''}{opt.impact.margin}%</strong></span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Operator Playbook */}
        {activeTab === 'playbook' && (
          <div className="card space-y-6">
            <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-base font-bold text-black dark:text-white">The Dropshipping Operator Playbook</h2>
              <p className="text-xs text-zinc-400 mt-1">Core strategic principles derived from high-growth direct-to-consumer (DTC) brands.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                <span className="font-mono text-xs font-bold text-black dark:text-white">01 / The 3x Margin Rule</span>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Never sell a dropshipping product at less than 3x the wholesale landed cost (e.g., if product + shipping cost is $15, retail must be at least $45). This preserves enough margin to absorb $18 ad CPA and Stripe processing fees.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                <span className="font-mono text-xs font-bold text-black dark:text-white">02 / The Sample Verification Test</span>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Always order 2 test units to your physical address before launching ad spend. Measure actual transit duration, packaging quality, and unboxing appeal to preempt product return waves.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                <span className="font-mono text-xs font-bold text-black dark:text-white">03 / Multi-Supplier Redundancy</span>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Maintain at least 2 alternate wholesale suppliers for your top 20% revenue-driving SKUs. If supplier A experiences stockouts or holiday factory shutdowns, reroute orders to supplier B immediately.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                <span className="font-mono text-xs font-bold text-black dark:text-white">04 / Zero-Dispute Customer Care</span>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Payment processors (Stripe/PayPal) flag dispute rates over 0.75%. Send automatic carrier tracking updates on days 1, 4, and 7 to keep customer anxiety low during international transit.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}