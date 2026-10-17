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

export default function LandingPage() {
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
              href="/login"
              className="btn btn-primary px-7 py-3.5 text-sm w-full sm:w-auto shadow-md hover:shadow-lg"
            >
              Sign In to Launch Simulation
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
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800 text-left"
          >
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="text-2xl font-mono font-bold text-black dark:text-white">$10,000</div>
              <div className="text-xs text-zinc-500 mt-1">Virtual Seed Capital</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="text-2xl font-mono font-bold text-black dark:text-white">500+</div>
              <div className="text-xs text-zinc-500 mt-1">Monte Carlo Trial Paths</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="text-2xl font-mono font-bold text-black dark:text-white">T+2</div>
              <div className="text-xs text-zinc-500 mt-1">Stripe Settlement Clearing</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="text-2xl font-mono font-bold text-black dark:text-white">100%</div>
              <div className="text-xs text-zinc-500 mt-1">Safe Training Environment</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 bg-background border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
              An Enterprise Simulation Sandbox
            </h2>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Everything required to run an omnichannel dropshipping brand—from realistic ad spend saturation curves to rolling reserves and supplier delays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 flex flex-col justify-between hover:border-black dark:hover:border-white transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mb-5 font-bold">
                  <FiDollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-2">3-Statement Financial Engine</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Real-time Income Statement (P&L), Direct Cash Flow Statement, and Balance Sheet with T+2 Stripe clearing and 10% rolling reserve escrow.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-mono text-zinc-500">
                GAAP Compatible • CSV Ledger
              </div>
            </div>

            <div className="card p-6 flex flex-col justify-between hover:border-black dark:hover:border-white transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mb-5 font-bold">
                  <FiTrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-2">Multi-Channel Ad Saturation</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Manage Meta, TikTok, and Google Ads with realistic diminishing returns, audience saturation curves, and creative fatigue decay over time.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-mono text-zinc-500">
                Dynamic CPM & ROAS • Creative Refresh
              </div>
            </div>

            <div className="card p-6 flex flex-col justify-between hover:border-black dark:hover:border-white transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mb-5 font-bold">
                  <FiBarChart2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-2">Monte Carlo Risk Engine</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Run 500 stochastic trials across 60 simulated days to forecast runway, safe cash buffer, breakeven ROAS, and probability of store insolvency.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-mono text-zinc-500">
                P10 / P50 / P90 Probability Bands
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-black dark:text-white tracking-tight">
            Ready to test your entrepreneurial strategy?
          </h2>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Log in to your store operations portal and start Day 1 of your simulation.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/login" className="btn btn-primary px-8 py-3 text-sm">
              Sign In to Store
            </Link>
            <Link href="/faq" className="btn btn-outline px-6 py-3 text-sm">
              Read Documentation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
