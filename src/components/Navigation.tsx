'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiHome, 
  FiLayout, 
  FiShoppingBag, 
  FiBarChart2, 
  FiTruck, 
  FiPackage, 
  FiPercent, 
  FiSettings, 
  FiMoon, 
  FiSun, 
  FiMenu, 
  FiX, 
  FiUser, 
  FiLogOut,
  FiHelpCircle,
  FiMail,
  FiChevronDown,
  FiCpu,
  FiGrid,
  FiSliders,
  FiArrowRight
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { siteConfig } from '@/config/site';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Dropdown states
  const [platformOpen, setPlatformOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const platformRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  // Initialize theme from localStorage or document
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') || 
                   localStorage.getItem('simbusiness_theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (platformRef.current && !platformRef.current.contains(e.target as Node)) {
        setPlatformOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('simbusiness_theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('simbusiness_theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const isPlatformActive = ['/platform', '/dashboard', '/products', '/market', '/suppliers'].some(p => pathname.startsWith(p));
  const isToolsActive = ['/tools', '/orders', '/calculator', '/settings', '/faq', '/advance-tool', '/advanced-tools'].some(p => pathname.startsWith(p));

  const homeHref = isAuthenticated ? '/dashboard' : '/login';

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-obsidian/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href={homeHref} className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-sm tracking-tighter group-hover:scale-105 transition-transform">
                SB
              </div>
              <span className="font-bold text-lg tracking-tight text-black dark:text-white">
                {siteConfig.name}
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    pathname === '/dashboard'
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    pathname === '/login'
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  Sign In
                </Link>
              )}

              <Link
                href="/landing"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/landing'
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                Features
              </Link>

              {/* Platform Dropdown */}
              <div className="relative" ref={platformRef}>
                <button
                  onClick={() => {
                    setPlatformOpen(!platformOpen);
                    setToolsOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isPlatformActive
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <FiGrid className="w-3.5 h-3.5" />
                  <span>Platform</span>
                  <FiChevronDown className={`w-3 h-3 transition-transform ${platformOpen ? 'rotate-180' : ''}`} />
                </button>

                {platformOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in">
                    <Link
                      href="/platform"
                      onClick={() => setPlatformOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-xs font-bold text-black dark:text-white mb-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <div className="flex items-center gap-2">
                        <FiGrid className="w-4 h-4" />
                        <span>Platform Overview</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono text-zinc-400">Hub ↗</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setPlatformOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs transition-colors"
                    >
                      <FiLayout className="w-4 h-4 mt-0.5 text-black dark:text-white flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-black dark:text-white">Operations Dashboard</div>
                        <div className="text-[11px] text-zinc-400">Live profit, cash flow & daily cycles</div>
                      </div>
                    </Link>

                    <Link
                      href="/products"
                      onClick={() => setPlatformOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs transition-colors"
                    >
                      <FiShoppingBag className="w-4 h-4 mt-0.5 text-black dark:text-white flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-black dark:text-white">Product Catalog</div>
                        <div className="text-[11px] text-zinc-400">Source, calculate margins & import inventory</div>
                      </div>
                    </Link>

                    <Link
                      href="/market"
                      onClick={() => setPlatformOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs transition-colors"
                    >
                      <FiBarChart2 className="w-4 h-4 mt-0.5 text-black dark:text-white flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-black dark:text-white">Market Intelligence</div>
                        <div className="text-[11px] text-zinc-400">Demand saturation & trend forecasts</div>
                      </div>
                    </Link>

                    <Link
                      href="/suppliers"
                      onClick={() => setPlatformOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs transition-colors"
                    >
                      <FiTruck className="w-4 h-4 mt-0.5 text-black dark:text-white flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-black dark:text-white">Supplier Directory</div>
                        <div className="text-[11px] text-zinc-400">Verified lead times & reliability scores</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Advanced Tools Dropdown */}
              <div className="relative" ref={toolsRef}>
                <button
                  onClick={() => {
                    setToolsOpen(!toolsOpen);
                    setPlatformOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isToolsActive
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <FiSliders className="w-3.5 h-3.5" />
                  <span>Advanced Tools</span>
                  <FiChevronDown className={`w-3 h-3 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
                </button>

                {toolsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in">
                    <Link
                      href="/tools"
                      onClick={() => setToolsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-xs font-bold text-black dark:text-white mb-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <div className="flex items-center gap-2">
                        <FiSliders className="w-4 h-4" />
                        <span>Advanced Tools Suite</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono text-zinc-400">All ↗</span>
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setToolsOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs transition-colors"
                    >
                      <FiPackage className="w-4 h-4 mt-0.5 text-black dark:text-white flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-black dark:text-white">Orders & Fulfillment</span>
                          <span className="badge-mono badge-mono-black text-[9px] px-1.5 py-0">Active</span>
                        </div>
                        <div className="text-[11px] text-zinc-400">Live order queue & supplier routing</div>
                      </div>
                    </Link>

                    <Link
                      href="/calculator"
                      onClick={() => setToolsOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs transition-colors"
                    >
                      <FiPercent className="w-4 h-4 mt-0.5 text-black dark:text-white flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-black dark:text-white">Unit Economics Calc</span>
                          <span className="badge-mono badge-mono-outline text-[9px] px-1.5 py-0">ROAS</span>
                        </div>
                        <div className="text-[11px] text-zinc-400">Break-even target & margin simulator</div>
                      </div>
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setToolsOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs transition-colors"
                    >
                      <FiCpu className="w-4 h-4 mt-0.5 text-black dark:text-white flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-black dark:text-white">Gemini AI Advisor</div>
                        <div className="text-[11px] text-zinc-400">Strategic operations audit & ad hooks</div>
                      </div>
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setToolsOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs transition-colors"
                    >
                      <FiSettings className="w-4 h-4 mt-0.5 text-black dark:text-white flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-black dark:text-white">Store Preferences</div>
                        <div className="text-[11px] text-zinc-400">Currencies, automation & API keys</div>
                      </div>
                    </Link>

                    <Link
                      href="/faq"
                      onClick={() => setToolsOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-xs transition-colors"
                    >
                      <FiHelpCircle className="w-4 h-4 mt-0.5 text-black dark:text-white flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-black dark:text-white">Knowledge Base & FAQ</div>
                        <div className="text-[11px] text-zinc-400">E-commerce simulation guide & rules</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Direct Quick Shortcuts */}
              <Link
                href="/dashboard"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/orders"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/orders'
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                Orders
              </Link>
            </nav>
          </div>

          {/* Quick Actions & Auth */}
          <div className="hidden sm:flex items-center space-x-2">
            {/* Dark/Light mode toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors"
            >
              {isDarkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>

            {/* User profile dropdown or Sign in button */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs font-bold text-black dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                      <FiSettings className="w-3.5 h-3.5" />
                      Business Settings
                    </Link>
                    <Link
                      href="/faq"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                      <FiHelpCircle className="w-3.5 h-3.5" />
                      Help & FAQ
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                      <FiMail className="w-3.5 h-3.5" />
                      Contact Support
                    </Link>
                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />
                    <button
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                        router.push('/login');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                      <FiLogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn btn-primary text-xs px-3 py-1.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
            >
              {isDarkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
            >
              {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-obsidian border-b border-zinc-200 dark:border-zinc-800 px-4 pt-2 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Section 1: Platform */}
          <div>
            <div className="flex items-center justify-between pb-1 mb-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                Platform Engines
              </span>
              <Link 
                href="/platform" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-[10px] font-mono text-black dark:text-white hover:underline"
              >
                Platform Hub ↗
              </Link>
            </div>
            <div className="space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                  pathname === '/dashboard' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <FiLayout className="w-4 h-4" />
                <span>Operations Dashboard</span>
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                  pathname === '/products' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <FiShoppingBag className="w-4 h-4" />
                <span>Product Catalog & Sourcing</span>
              </Link>
              <Link
                href="/market"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                  pathname === '/market' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <FiBarChart2 className="w-4 h-4" />
                <span>Market Intelligence</span>
              </Link>
              <Link
                href="/suppliers"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                  pathname === '/suppliers' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <FiTruck className="w-4 h-4" />
                <span>Supplier Directory</span>
              </Link>
            </div>
          </div>

          {/* Section 2: Advanced Tools */}
          <div>
            <div className="flex items-center justify-between pb-1 mb-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                Advanced Tools
              </span>
              <Link 
                href="/tools" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-[10px] font-mono text-black dark:text-white hover:underline"
              >
                Tools Suite ↗
              </Link>
            </div>
            <div className="space-y-1">
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium ${
                  pathname === '/orders' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiPackage className="w-4 h-4" />
                  <span>Orders & Fulfillment</span>
                </div>
                <span className="badge-mono badge-mono-outline text-[9px]">Active</span>
              </Link>
              <Link
                href="/calculator"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium ${
                  pathname === '/calculator' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiPercent className="w-4 h-4" />
                  <span>Unit Economics Calculator</span>
                </div>
                <span className="badge-mono badge-mono-outline text-[9px]">ROAS</span>
              </Link>
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                  pathname === '/settings' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <FiSettings className="w-4 h-4" />
                <span>Store Preferences</span>
              </Link>
              <Link
                href="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                  pathname === '/faq' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <FiHelpCircle className="w-4 h-4" />
                <span>Knowledge Base & FAQ</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}