'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FiLock, FiMail, FiArrowRight, FiCheckCircle, FiZap } from 'react-icons/fi';
import { siteConfig } from '@/config/site';

export default function SignInPage() {
  const router = useRouter();
  const { signIn, signInDemoUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await signIn(email, password, rememberMe);
    if (res.success) {
      router.push('/dashboard');
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    signInDemoUser();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-sm">
            SB
          </div>
          <span className="font-bold text-xl tracking-tight text-black dark:text-white">
            {siteConfig.name}
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white">
          Sign in to your virtual store
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Or{' '}
          <Link href="/auth/signup" className="font-semibold underline text-black dark:text-white">
            create a new simulator account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="card p-8 shadow-sm">
          {/* Quick Demo Access */}
          <div className="mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <button
              onClick={handleDemoLogin}
              className="w-full btn btn-secondary text-xs flex items-center justify-center gap-2 py-2.5 font-medium border border-zinc-200 dark:border-zinc-700"
            >
              <FiZap className="w-3.5 h-3.5 text-black dark:text-white" />
              1-Click Admin Login (Jatin Dudhani)
            </button>
            <p className="text-[11px] text-zinc-400 text-center mt-2">Instant access as jatindudhani07@gmail.com</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-lg border border-black dark:border-white bg-zinc-50 dark:bg-zinc-900 text-black dark:text-white font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
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
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <Link href="/faq" className="text-[11px] text-zinc-400 hover:underline">
                  Need help?
                </Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-300 text-black focus:ring-0 w-3.5 h-3.5"
                />
                <span className="text-zinc-600 dark:text-zinc-400 text-xs">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full text-xs py-2.5 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Authenticating...' : (
                <>
                  Sign In to Dashboard <FiArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
