'use client';

import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-obsidian transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-xs">
                SB
              </div>
              <span className="font-bold text-base tracking-tight text-black dark:text-white">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Professional dropshipping business simulation and strategic unit economics lab.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100 animate-pulse"></span>
              <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
                Engine: v{siteConfig.version} (Active)
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-black dark:text-white mb-4">
              <Link href="/platform" className="hover:underline flex items-center gap-1 group">
                <span>Platform</span>
                <span className="text-[10px] text-zinc-400 group-hover:text-black dark:group-hover:text-white">↗</span>
              </Link>
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/dashboard" className="hover:text-black dark:hover:text-white transition-colors">
                  Operations Dashboard
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-black dark:hover:text-white transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/market" className="hover:text-black dark:hover:text-white transition-colors">
                  Market Intelligence
                </Link>
              </li>
              <li>
                <Link href="/suppliers" className="hover:text-black dark:hover:text-white transition-colors">
                  Supplier Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Scenarios */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-black dark:text-white mb-4">
              <Link href="/tools" className="hover:underline flex items-center gap-1 group">
                <span>Advanced Tools</span>
                <span className="text-[10px] text-zinc-400 group-hover:text-black dark:group-hover:text-white">↗</span>
              </Link>
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/orders" className="hover:text-black dark:hover:text-white transition-colors">
                  Orders & Fulfillment
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-black dark:hover:text-white transition-colors">
                  Unit Economics Calculator
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-black dark:hover:text-white transition-colors">
                  Store Preferences
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-black dark:hover:text-white transition-colors">
                  Knowledge Base & FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-black dark:text-white mb-4">
              Contact & Inquiry
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/contact" className="hover:text-black dark:hover:text-white transition-colors">
                  Support Desk
                </Link>
              </li>
              <li className="text-zinc-500">
                Email: {siteConfig.contact.email}
              </li>
              <li className="text-zinc-500">
                Tel: {siteConfig.contact.phone}
              </li>
              <li>
                <a 
                  href={siteConfig.socials.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-black dark:hover:text-white transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {currentYear} {siteConfig.name}. All simulation rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/faq" className="hover:text-black dark:hover:text-white">Documentation</Link>
            <Link href="/contact" className="hover:text-black dark:hover:text-white">Privacy & Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
