'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FiLock, 
  FiMail, 
  FiArrowRight, 
  FiZap, 
  FiCheckCircle, 
  FiEye, 
  FiEyeOff, 
  FiShield, 
  FiUserCheck,
  FiLogOut
} from 'react-icons/fi';
import { siteConfig } from '@/config/site';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  const { user, isAuthenticated, signIn, signInDemoUser, signOut } = useAuth();

  const [email, setEmail] = useState('jatindudhani07@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await signIn(email, password, rememberMe);
    if (res.success) {
      router.push(redirectTarget);
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    signInDemoUser();
    router.push(redirectTarget);
  };

  const handleAutofillAdmin = () => {
    setEmail('jatindudhani07@gmail.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/login" className="inline-flex items-center gap-2.5 group mb-4">
          <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-sm shadow-md group-hover:scale-105 transition-transform">
            SB
          </div>
          <span className="font-bold text-2xl tracking-tight text-black dark:text-white">
            {siteConfig.name}
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white">
          Sign In to Your Store
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-sm mx-auto">
          Start your e-commerce simulation session with real-time analytics, 3-statement financial modeling, and marketing engines.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* If user is already authenticated */}
        {isAuthenticated && user && (
          <div className="mb-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 flex-shrink-0">
                <FiUserCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Active Session</div>
                <div className="text-xs font-bold text-black dark:text-white truncate">{user.name}</div>
                <div className="text-[11px] text-zinc-500 truncate">{user.email}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.push(redirectTarget)}
                className="btn btn-primary flex-1 text-xs py-2 flex items-center justify-center gap-1.5 font-medium"
              >
                <span>Enter Operations Dashboard</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  setEmail('');
                  setPassword('');
                }}
                className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 text-zinc-500 hover:text-black dark:hover:text-white"
                title="Sign Out"
              >
                <FiLogOut className="w-3.5 h-3.5" />
                <span>Switch</span>
              </button>
            </div>
          </div>
        )}

        <div className="card p-6 sm:p-8 shadow-sm border border-zinc-200 dark:border-zinc-800">
          {/* Quick 1-Click Admin Access */}
          <div className="mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full btn btn-primary text-xs flex items-center justify-center gap-2 py-3 font-semibold shadow hover:shadow-md transition-all"
            >
              <FiZap className="w-4 h-4 fill-current" />
              <span>1-Click Admin Login (Jatin Dudhani)</span>
            </button>
            <div className="flex items-center justify-between mt-2.5 px-1">
              <span className="text-[11px] text-zinc-400 font-mono">ID: jatindudhani07@gmail.com</span>
              <button
                type="button"
                onClick={handleAutofillAdmin}
                className="text-[11px] text-black dark:text-white hover:underline font-medium"
              >
                Autofill Credentials
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2.5 bg-white dark:bg-obsidian text-zinc-400 font-medium">
                Or sign in with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Store Operator Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  placeholder="name@business.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-xs focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <span className="text-[11px] text-zinc-400 font-mono">Min 4 chars</span>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-xs focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black dark:hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-300 text-black dark:text-white focus:ring-0 w-3.5 h-3.5"
                />
                <span className="text-zinc-600 dark:text-zinc-400 text-xs">Remember this device</span>
              </label>
              <Link href="/faq" className="text-[11px] text-zinc-400 hover:text-black dark:hover:text-white hover:underline">
                Help & Guide
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full text-xs py-2.5 mt-2 flex items-center justify-center gap-2 font-medium"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Store</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-500">
            Need a new simulator account?{' '}
            <Link href="/auth/signup" className="font-semibold underline text-black dark:text-white">
              Create account
            </Link>
          </div>
        </div>

        {/* Feature Overview Link */}
        <div className="mt-6 text-center text-xs text-zinc-400">
          Want to explore simulator features first?{' '}
          <Link href="/landing" className="font-medium underline hover:text-black dark:hover:text-white">
            View Platform Tour & Roadmap
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col justify-center items-center">
          <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-zinc-500 font-mono">Loading login interface...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
