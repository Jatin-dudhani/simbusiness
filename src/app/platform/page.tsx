'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiLayout, 
  FiShoppingBag, 
  FiBarChart2, 
  FiTruck, 
  FiArrowRight, 
  FiCheckCircle, 
  FiCpu,
  FiShield
} from 'react-icons/fi';
import AuthGuard from '@/components/AuthGuard';

export default function PlatformPage() {
  const platformModules = [
    {
      id: 'dashboard',
      title: 'Operations Dashboard',
      description: 'The mission control for your simulated e-commerce business. Track daily financial performance, cash flow, operational overhead, and trigger market events.',
      href: '/dashboard',
      icon: FiLayout,
      stats: 'Real-Time Financial Feed',
      features: [
        'Daily iterative operations simulation (1x, 5x, 10x speeds)',
        'Net profit vs. gross revenue visual trajectory charts',
        'Macroeconomic market event triggers (Viral Surge, Port Strike)',
        'Integrated Google Gemini AI Strategic Advisor'
      ],
      badge: 'Core Engine'
    },
    {
      id: 'products',
      title: 'Product Catalog & Sourcing',
      description: 'Inspect, evaluate unit margins, and import curated consumer products into your live inventory queue with realistic supplier landed costs.',
      href: '/products',
      icon: FiShoppingBag,
      stats: 'Multi-Category Catalog',
      features: [
        'Live product catalog powered by resilient API endpoints',
        'Built-in retail price vs. wholesale COGS margin calculator',
        '1-click store inventory import with local persistence',
        'Category filters across Electronics, Jewelry, Apparel & Men'
      ],
      badge: 'Inventory'
    },
    {
      id: 'market',
      title: 'Market Intelligence & Trends',
      description: 'Analyze consumer search trends, competitive saturation, and niche category viability before committing virtual capital.',
      href: '/market',
      icon: FiBarChart2,
      stats: 'Predictive Analytics',
      features: [
        'Category saturation indexes and market growth forecasts',
        'Average customer acquisition cost (CAC) benchmarks',
        'Risk vs. reward scoring for trending product niches',
        'Consumer purchasing sentiment feedback'
      ],
      badge: 'Analytics'
    },
    {
      id: 'suppliers',
      title: 'Global Supplier Directory',
      description: 'Connect with simulated global fulfillment partners. Review historical reliability ratings, average transit times, and return policies.',
      href: '/suppliers',
      icon: FiTruck,
      stats: 'Verified Logistics',
      features: [
        'Comprehensive supplier reliability ratings (92% - 98%)',
        'Standard and express international shipping timeframes',
        'Warehouse distribution hubs across North America, Europe, and Asia',
        'Direct automated order routing compatibility'
      ],
      badge: 'Fulfillment'
    }
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-mono uppercase tracking-wider mb-4 bg-zinc-50 dark:bg-zinc-900">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
            <span>Architecture & Ecosystem</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-black dark:text-white">
            The SimBusiness Platform
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed">
            A cohesive suite of four interconnected e-commerce operational engines designed to simulate 
            real-world direct-to-consumer businesses with mathematical precision.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-black dark:text-white w-4 h-4" />
              <span>4 Integrated Engines</span>
            </div>
            <div className="flex items-center gap-2">
              <FiShield className="text-black dark:text-white w-4 h-4" />
              <span>Zero Capital Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCpu className="text-black dark:text-white w-4 h-4" />
              <span>Gemini AI Enabled</span>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {platformModules.map((module) => {
            const Icon = module.icon;
            return (
              <div 
                key={module.id}
                className="card card-hover p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="badge-mono badge-mono-outline">
                      {module.badge}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-black dark:text-white">
                    {module.title}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                    {module.description}
                  </p>

                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                      Included Capabilities:
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                      {module.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-black dark:text-white mt-0.5">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-500">
                    {module.stats}
                  </span>
                  <Link
                    href={module.href}
                    className="btn btn-primary text-xs flex items-center gap-1.5 px-4 py-2"
                  >
                    <span>Launch Module</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="rounded-2xl border border-black dark:border-white p-8 bg-zinc-50 dark:bg-obsidian flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white">
              Ready to test high-level unit economics?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Explore the Advanced Tools suite, including the Break-Even ROAS Calculator and Orders & Fulfillment Hub.
            </p>
          </div>
          <Link
            href="/tools"
            className="btn btn-outline text-xs whitespace-nowrap px-6 py-2.5"
          >
            Explore Advanced Tools ↗
          </Link>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
