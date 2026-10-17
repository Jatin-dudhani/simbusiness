'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FiChevronDown, FiHelpCircle, FiArrowRight } from 'react-icons/fi';
import { siteConfig } from '@/config/site';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'economics' | 'suppliers' | 'technical';
}

const faqs: FAQItem[] = [
  {
    category: 'general',
    question: "What is SimBusiness and what makes it unique?",
    answer: "SimBusiness is an advanced e-commerce and dropshipping operations simulator. Unlike simple storefront demos, SimBusiness models the entire operational lifecycle: product sourcing, markups, customer acquisition cost (CPA), carrier transit delays, supplier order routing, and real-time net margin calculations with zero capital at risk."
  },
  {
    category: 'economics',
    question: "How does the simulator calculate daily profits and expenses?",
    answer: "Each simulation day generates organic and paid-ad traffic based on your ad spend and market events. Orders are calculated from dynamic conversion rates. Expenses deduct landed wholesale COGS, supplier shipping, gateway fees (Stripe/Shopify benchmark ~2.9% + $0.30), ad spend, and a realistic return/dispute reserve."
  },
  {
    category: 'suppliers',
    question: "How does simulated supplier order routing work?",
    answer: "When customer orders arrive in the Orders & Fulfillment Hub, you can route them to assigned suppliers (or enable automated routing in Settings). Suppliers acknowledge the order, generate realistic international carrier tracking numbers, and advance delivery statuses from Unfulfilled to Processing, Shipped, and Delivered."
  },
  {
    category: 'economics',
    question: "What is the Unit Economics Calculator?",
    answer: "Our new Unit Economics Calculator (/calculator) helps you model break-even Return On Ad Spend (ROAS) and net margins before investing marketing budget. You can model price points, supplier fees, ad CPAs, and return rates with instant viability feedback."
  },
  {
    category: 'technical',
    question: "Can I connect real 3rd-party API keys?",
    answer: "Yes! While SimBusiness operates autonomously in simulated sandbox mode by default, you can configure optional 3rd-party credentials in Settings (such as Stripe for test card processing, OpenExchangeRates for live multi-currency, or supplier catalog API keys)."
  },
  {
    category: 'technical',
    question: "How do I get the 3rd-party API keys (Stripe, ExchangeRate, Suppliers, Gemini)?",
    answer: "All supported 3rd-party APIs have 100% free developer tiers that require NO credit card: 1) Stripe: Sign up at dashboard.stripe.com, toggle 'Test Mode', and copy the 'pk_test_...' key under Developers > API Keys. 2) Exchange Rates: Visit exchangerate-api.com and enter your email for a free 1,500 req/mo key. 3) Suppliers: Create a free developer account at developers.printful.com or cjdropshipping.com under API Center. 4) Google Gemini: Get a free key at aistudio.google.com/app/apikey. Paste any of these in Settings (/settings) or .env.local."
  },
  {
    category: 'general',
    question: "Is any real money needed or charged?",
    answer: "No. SimBusiness is 100% free and safe. All currency balances, sales numbers, and supplier transactions are simulated within your browser and local sandbox storage."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredFaqs = filterCategory === 'all' 
    ? faqs 
    : faqs.filter(f => f.category === filterCategory);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="badge-mono badge-mono-black">Knowledge Base</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-black dark:text-white tracking-tight mt-2">
            Frequently Asked Questions
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm mt-2">
            Everything you need to master dropshipping simulation mechanics and unit economics.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-1.5 mb-10 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'general', label: 'Platform & Basics' },
            { id: 'economics', label: 'Unit Economics' },
            { id: 'suppliers', label: 'Suppliers & Routing' },
            { id: 'technical', label: 'APIs & Tech' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                filterCategory === cat.id
                  ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="card p-0 overflow-hidden border border-zinc-200 dark:border-zinc-800"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors"
                >
                  <span className="font-semibold text-sm text-black dark:text-white">
                    {faq.question}
                  </span>
                  <FiChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-black dark:text-white' : ''
                  }`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 pt-3"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Card */}
        <div className="card mt-12 p-8 text-center bg-zinc-50 dark:bg-zinc-900/50">
          <h3 className="font-bold text-base text-black dark:text-white">
            Have a custom scenario or simulation inquiry?
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
            Our team is available to assist with custom supplier catalogs and academic simulation setups.
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <Link
              href="/contact"
              className="btn btn-primary text-xs"
            >
              Contact Support Desk
            </Link>
            <Link
              href="/dashboard"
              className="btn btn-outline text-xs"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}