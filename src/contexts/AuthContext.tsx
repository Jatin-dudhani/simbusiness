'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'store_owner' | 'manager' | 'analyst';
  businessName?: string;
  avatarUrl?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  updateProfile: (updates: Partial<User>) => void;
  signInDemoUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 'usr_admin_01',
  name: 'Jatin Dudhani',
  email: 'jatindudhani07@gmail.com',
  role: 'store_owner',
  businessName: 'Apex E-Commerce',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  createdAt: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('simbusiness_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email === 'alex.vance@simbusiness.app') {
          setUser(DEMO_USER);
          localStorage.setItem('simbusiness_auth_user', JSON.stringify(DEMO_USER));
        } else {
          setUser(parsed);
        }
      } else {
        // Automatically provide admin user for seamless simulation experience
        setUser(DEMO_USER);
        localStorage.setItem('simbusiness_auth_user', JSON.stringify(DEMO_USER));
      }
    } catch (e) {
      console.warn('Failed to load auth state:', e);
      setUser(DEMO_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    setIsLoading(true);
    // Simulate network authentication delay
    await new Promise(resolve => setTimeout(resolve, 600));

    if (!email || !password) {
      setIsLoading(false);
      return { success: false, error: 'Please enter both email and password.' };
    }

    if (password.length < 4) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    const authenticatedUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role: 'store_owner',
      businessName: `${email.split('@')[0]} Dropship Co.`,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString(),
    };

    setUser(authenticatedUser);
    if (rememberMe) {
      localStorage.setItem('simbusiness_auth_user', JSON.stringify(authenticatedUser));
    }
    setIsLoading(false);
    return { success: true };
  };

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    if (!name || !email || !password) {
      setIsLoading(false);
      return { success: false, error: 'All fields are required.' };
    }

    if (password.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'store_owner',
      businessName: `${name.trim()}'s Boutique`,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem('simbusiness_auth_user', JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const signOut = () => {
    setUser(null);
    try {
      localStorage.removeItem('simbusiness_auth_user');
    } catch {}
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    try {
      localStorage.setItem('simbusiness_auth_user', JSON.stringify(updated));
    } catch {}
  };

  const signInDemoUser = () => {
    setUser(DEMO_USER);
    try {
      localStorage.setItem('simbusiness_auth_user', JSON.stringify(DEMO_USER));
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        signInDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
