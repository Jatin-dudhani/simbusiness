'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiPackage, 
  FiPercent, 
  FiCpu, 
  FiSettings, 
  FiActivity, 
  FiArrowRight, 
  FiCheckCircle, 
  FiSliders,
  FiZap,
  FiTrendingUp
} from 'react-icons/fi';

export default function AdvancedToolsPage() {
  const tools = [
    {
      id: 'orders',
      title: 'Orders & Fulfillment Hub',
      badge: 'Interactive Operations',
      description: 'Process realistic customer purchases in real time. Route orders to simulated global suppliers, generate legitimate carrier tracking codes, and advance fulfillment statuses.',
      href: '/orders',
      icon: FiPackage,
      features: [
        'Live customer purchase feed with address & item breakdowns',
        '1-click automated supplier order routing',
        'Standard tracking number generation (USPS, DHL, Yanwen)',
        'Delivered & Shipped status progression workflow'
      ],
      actionText: 'Open Fulfillment Hub'
    },
    {
      id: 'calculator',
      title: 'Unit Economics & Break-Even ROAS',
      badge: 'Margin Modeling',
      description: 'Simulate direct-to-consumer profitability before launching ad campaigns. Calculates contribution margins, merchant processor fees, shipping deltas, and minimum target ROAS.',
      href: '/calculator',
      icon: FiPercent,
      features: [
        'Break-even Return on Ad Spend (ROAS) calculator',
        'Target net profit margin sensitivity sliders (10% - 60%)',
        'Pre-configured industry presets (Beauty, Tech, Fashion, Pets)',
        'Payment gateway fee modeling (Stripe 2.9% + $0.30)'
      ],
      actionText: 'Launch Calculator'
    },
    {
      id: 'ai-advisor',
      title: 'Google Gemini Strategic AI Advisor',
      badge: 'Live AI Copilot',
      description: 'Harness Google Gemini 3.8 Flash to audit your store simulation. Receive 3 actionable strategic recommendations on inventory restock, marketing allocation, and supply chain precautions.',
      href: '/dashboard',
      icon: FiCpu,
      features: [
        'Deep automated analysis of current day margins & revenue',
        'Macro-event mitigation advice (strikes, ad fatigue, viral surges)',
        'Viral TikTok / Reels ad hook generation for imported products',
        'Connected to your verified Google Gemini API Key'
      ],
      actionText: 'Access AI on Dashboard'
    },
    {
      id: 'scenarios',
      title: 'Macroeconomic Scenario Simulator',
      badge: 'Stress Testing',
      description: 'Stress-test your store against realistic supply chain shocks, viral social media bursts, and holiday shopping spikes with 1-click economic scenarios.',
      href: '/dashboard',
      icon: FiZap,
      features: [
        'Viral TikTok Surge: +45% order demand spike',
        'Global Port Congestion: -30% sales, +20% handling fees',
        'Q4 Black Friday Blitz: +80% orders and high marketing conversion',
        'Instant trajectory curve re-rendering'
      ],
      actionText: 'Test on Dashboard'
    },
    {
      id: 'settings',
      title: 'Store Preferences & Gateways',
      badge: 'Configuration',
      description: 'Calibrate business currency, default sales tax rates, automated routing rules, and configure optional 3rd-party API credentials.',
      href: '/settings',
      icon: FiSettings,
      features: [
        'Multi-currency display support (USD, EUR, GBP, CAD, AUD, JPY)',
        'Automated fulfillment routing threshold toggles',
        'Optional Stripe, ExchangeRate, and Supplier API keys',
        'Persistent localStorage state across sessions'
      ],
      actionText: 'Manage Preferences'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-mono uppercase tracking-wider mb-4 bg-zinc-50 dark:bg-zinc-900">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
            <span>Advanced Toolkit</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-black dark:text-white">
            Advanced Simulation Tools
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed">
            Specialized instruments for unit economics modeling, real-time supplier fulfillment routing, 
            algorithmic stress-testing, and Gemini AI operations advisory.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-black dark:text-white w-4 h-4" />
              <span>5 Specialized Tools</span>
            </div>
            <div className="flex items-center gap-2">
              <FiTrendingUp className="text-black dark:text-white w-4 h-4" />
              <span>Data-Driven Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCpu className="text-black dark:text-white w-4 h-4" />
              <span>Gemini 3.8 Flash Powered</span>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div 
                key={tool.id}
                className="card card-hover p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="badge-mono badge-mono-outline text-[10px]">
                      {tool.badge}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-black dark:text-white">
                    {tool.title}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                      Highlights:
                    </span>
                    <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-300">
                      {tool.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-black dark:text-white">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <Link
                    href={tool.href}
                    className="btn btn-primary w-full text-xs flex items-center justify-center gap-1.5 py-2"
                  >
                    <span>{tool.actionText}</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation Ribbon */}
        <div className="rounded-2xl border border-black dark:border-white p-8 bg-zinc-50 dark:bg-obsidian flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white">
              Looking for core business modules?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Visit the Platform Overview to explore the Operations Dashboard, Catalog, Market Intel, and Suppliers.
            </p>
          </div>
          <Link
            href="/platform"
            className="btn btn-outline text-xs whitespace-nowrap px-6 py-2.5"
          >
            Go to Platform Overview ↗
          </Link>
        </div>
      </main>
    </div>
  );
}
