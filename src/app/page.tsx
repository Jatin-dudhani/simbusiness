'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiBarChart2, 
  FiPackage, 
  FiDollarSign, 
  FiUsers, 
  FiTarget, 
  FiShield, 
  FiArrowRight,
  FiTrendingUp,
  FiCheckCircle,
  FiLayers,
  FiTruck,
  FiPercent
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { siteConfig } from '@/config/site';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-mono uppercase tracking-wider mb-8 bg-zinc-50 dark:bg-zinc-900"
          >
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
            <span>SimBusiness Engine v{siteConfig.version} • Next-Gen Simulation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-black dark:text-white max-w-4xl mx-auto leading-[1.08]"
          >
            Master e-commerce with zero financial risk.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mt-6 leading-relaxed"
          >
            {siteConfig.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-10"
          >
            <Link
              href="/dashboard"
              className="btn btn-primary px-7 py-3.5 text-sm w-full sm:w-auto shadow-md hover:shadow-lg"
            >
              Launch Simulation
              <FiArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/calculator"
              className="btn btn-outline px-7 py-3.5 text-sm w-full sm:w-auto"
            >
              Unit Economics Calculator
            </Link>
          </motion.div>

          {/* Key Metrics Ribbon */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 pt-12 border-t border-zinc-100 dark:border-zinc-800 text-left"
          >
            <div className="p-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Realism Level</span>
              <p className="text-xl font-bold text-black dark:text-white mt-0.5">High-Fidelity</p>
              <p className="text-xs text-zinc-500 mt-0.5">Dynamic market events</p>
            </div>
            <div className="p-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Order Routing</span>
              <p className="text-xl font-bold text-black dark:text-white mt-0.5">Automated</p>
              <p className="text-xs text-zinc-500 mt-0.5">Live supplier fulfillment</p>
            </div>
            <div className="p-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Capital At Risk</span>
              <p className="text-xl font-bold text-black dark:text-white mt-0.5">$0.00</p>
              <p className="text-xs text-zinc-500 mt-0.5">Safe virtual economics</p>
            </div>
            <div className="p-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Decision Modeling</span>
              <p className="text-xl font-bold text-black dark:text-white mt-0.5">Instant</p>
              <p className="text-xs text-zinc-500 mt-0.5">ROAS & margin feedback</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Simulation Capabilities */}
      <section className="py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-obsidian/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-mono badge-mono-outline">Comprehensive System</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mt-3">
              Engineered for realistic entrepreneurship.
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-3 text-base">
              Test pricing elasticity, supply chain bottlenecks, conversion rates, and paid ad scale without putting your savings on the line.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card card-hover p-6">
              <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mb-5">
                <FiBarChart2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-black dark:text-white">Real-Time Operations</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                Run daily sales simulations, adjust inventory replenishment intervals, and monitor live revenue, expenses, and net profit charts.
              </p>
            </div>

            <div className="card card-hover p-6">
              <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mb-5">
                <FiTruck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-black dark:text-white">Supplier Directory & Routing</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                Connect with simulated global suppliers, evaluate lead times and reliability scores, and route customer orders with real tracking numbers.
              </p>
            </div>

            <div className="card card-hover p-6">
              <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mb-5">
                <FiPercent className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-black dark:text-white">Unit Economics Modeling</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                Calculate break-even ROAS, per-order COGS, payment gateway fees, and return allowances to protect your bottom line before spending ad dollars.
              </p>
            </div>

            <div className="card card-hover p-6">
              <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mb-5">
                <FiPackage className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-black dark:text-white">Catalog Sync & Markups</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                Import winning products from suppliers directly into your store catalog. Adjust markups, variants, and stock thresholds seamlessly.
              </p>
            </div>

            <div className="card card-hover p-6">
              <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mb-5">
                <FiTarget className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-black dark:text-white">Market Intelligence</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                Evaluate industry growth categories and test strategic decision scenarios when facing price wars, logistics delays, or holiday rushes.
              </p>
            </div>

            <div className="card card-hover p-6">
              <div className="w-10 h-10 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mb-5">
                <FiShield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-black dark:text-white">Risk-Free Environment</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                Experiment with bold price increases or heavy marketing campaigns. Discover failure points safely before starting real-world stores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Workflow */}
      <section className="py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-mono badge-mono-outline">Execution Flow</span>
            <h2 className="text-3xl font-bold text-black dark:text-white tracking-tight mt-3">
              The Dropshipping Lifecycle
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-2">
              Step through the five core stages every successful e-commerce operator executes.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                step: '01',
                title: 'Niche Research & Supplier Discovery',
                desc: 'Audit trending product categories in Market Intel and inspect supplier lead times and reliability ratings.',
              },
              {
                step: '02',
                title: 'Product Import & Markup Strategy',
                desc: 'Select products from the catalog, configure target profit margins, and calculate break-even acquisition costs.',
              },
              {
                step: '03',
                title: 'Operations & Traffic Simulation',
                desc: 'Launch the daily simulation engine on the dashboard. Calibrate marketing ad budgets and watch incoming customer order velocity.',
              },
              {
                step: '04',
                title: 'Automated Supplier Routing & Tracking',
                desc: 'Route incoming orders to wholesale partners, obtain simulated carrier tracking numbers, and manage customer fulfillment status.',
              },
              {
                step: '05',
                title: 'Data-Driven Optimization',
                desc: 'Review net profit trends, return rates, and cart abandonment stats to refine margins for sustainable scaling.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="card flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <span className="font-mono text-base font-bold text-black dark:text-white w-8">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-black dark:text-white">{item.title}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1 self-end sm:self-center">
                  <FiCheckCircle className="w-3.5 h-3.5" /> Ready
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 md:py-24 bg-black text-white dark:bg-zinc-900/60 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to test your business instincts?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mt-4 leading-relaxed">
            Jump directly into the virtual dashboard. No credit card, no inventory commitments, and zero capital risk.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors shadow"
            >
              Start Operating Now
            </Link>
            <Link
              href="/orders"
              className="px-6 py-3 rounded-lg border border-zinc-700 text-white font-medium text-xs hover:bg-zinc-800 transition-colors"
            >
              Explore Order Fulfillment
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}