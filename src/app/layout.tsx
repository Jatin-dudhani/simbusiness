import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE || 'SimBusiness - Dropshipping Business Simulation',
  description: 'Learn and practice dropshipping business strategies with our interactive simulation platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
          <div className="font-bold text-xl">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              SimBusiness
            </Link>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">FAQ</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">Contact</Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:underline">Sign Up</Link>
              </li>
              <li>
                <Link href="/auth/signin" className="hover:underline">Sign In</Link>
              </li>
            </ul>
          </nav>
        </header>
        <Navigation />
        {children}
      </body>
    </html>
  );
} 