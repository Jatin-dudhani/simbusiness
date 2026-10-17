'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiLock, FiShield } from 'react-icons/fi';
import Link from 'next/link';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : '/login';
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Loading spinner while checking local storage / session
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-background">
        <div className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-sm mb-4 animate-pulse">
          SB
        </div>
        <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-zinc-500 font-mono">Initializing store session...</p>
      </div>
    );
  }

  // Not authenticated screen (shown briefly while redirecting)
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-background text-center">
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-5">
          <FiLock className="w-6 h-6 text-black dark:text-white" />
        </div>
        <h2 className="text-lg font-bold text-black dark:text-white">Store Access Restricted</h2>
        <p className="text-xs text-zinc-500 max-w-sm mt-1.5 mb-6 leading-relaxed">
          You must sign in to your store operator account to access the simulation dashboard and platform tools.
        </p>
        <Link
          href={`/login?redirect=${encodeURIComponent(pathname || '/dashboard')}`}
          className="btn btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
        >
          <FiShield className="w-3.5 h-3.5" />
          Proceed to Login Page
        </Link>
      </div>
    );
  }

  // Authenticated: Render children
  return <>{children}</>;
}
