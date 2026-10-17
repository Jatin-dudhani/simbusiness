'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiSave, 
  FiMoon, 
  FiSun, 
  FiDollarSign, 
  FiMail, 
  FiCheckCircle, 
  FiKey, 
  FiSliders,
  FiShield,
  FiRefreshCw
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { siteConfig, businessDefaults, apiConfig } from '@/config/site';
import { setRuntimeAiApiKey } from '@/services/ai';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();

  const [businessSettings, setBusinessSettings] = useState({
    businessName: siteConfig.name,
    email: siteConfig.contact.email,
    phone: siteConfig.contact.phone,
    currency: businessDefaults.currency,
    taxRate: businessDefaults.taxRate,
    shippingFee: businessDefaults.shippingFee,
    profitMargin: businessDefaults.targetMargin,
    autoRouteOrders: true,
    lowStockAlerts: true,
    darkMode: false,
    stripeKey: apiConfig.thirdPartyKeys.stripePublishableKey,
    exchangeRateKey: apiConfig.thirdPartyKeys.exchangeRateApiKey,
    supplierApiKey: apiConfig.thirdPartyKeys.supplierApiKey,
    aiApiKey: apiConfig.thirdPartyKeys.aiApiKey,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('simbusiness_settings');
      const isDark = document.documentElement.classList.contains('dark');
      if (stored) {
        const parsed = JSON.parse(stored);
        setBusinessSettings(prev => ({ ...prev, ...parsed, darkMode: isDark }));
      } else {
        setBusinessSettings(prev => ({ ...prev, darkMode: isDark }));
      }
    } catch (e) {
      console.warn('Failed to load settings:', e);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setBusinessSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleToggleDark = () => {
    const nextDark = !businessSettings.darkMode;
    setBusinessSettings(prev => ({ ...prev, darkMode: nextDark }));
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('simbusiness_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('simbusiness_theme', 'light');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 500));

    try {
      // Security: Only persist non-sensitive operational preferences in localStorage.
      // Sensitive 3rd-party API credentials are excluded to prevent clear-text storage (CWE-312 / CodeQL Alert #2).
      const { 
        stripeKey, 
        exchangeRateKey, 
        supplierApiKey, 
        aiApiKey, 
        ...safeOperationalPreferences 
      } = businessSettings;

      localStorage.setItem('simbusiness_settings', JSON.stringify(safeOperationalPreferences));

      if (aiApiKey) {
        setRuntimeAiApiKey(aiApiKey);
      }

      if (user) {
        updateProfile({ businessName: businessSettings.businessName });
      }
    } catch (err) {
      console.warn('Settings save error:', err);
    }

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-mono badge-mono-black">Preferences</span>
              <span className="text-xs text-zinc-500 font-mono">Store Configuration</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white mt-1">
              Store & Simulation Settings
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Customize currency formatting, automation thresholds, and configure optional 3rd-party API credentials.
            </p>
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold animate-in fade-in">
              <FiCheckCircle className="w-4 h-4" />
              Settings saved successfully
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Business Profile */}
          <div className="card space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
              1. Store Identity & Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">
                  Business Store Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={businessSettings.businessName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={businessSettings.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">
                  Customer Service Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={businessSettings.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Economics Calibration */}
          <div className="card space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
              2. Financial Economics & Margin Targets
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">
                  Currency Symbol
                </label>
                <select
                  name="currency"
                  value={businessSettings.currency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">
                  Default Sales Tax (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="taxRate"
                  value={businessSettings.taxRate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">
                  Customer Shipping Fee ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="shippingFee"
                  value={businessSettings.shippingFee}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">
                  Target Profit Margin (%)
                </label>
                <input
                  type="number"
                  step="1"
                  name="profitMargin"
                  value={businessSettings.profitMargin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Automation & Theme */}
          <div className="card space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
              3. Automation & Aesthetics
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="autoRouteOrders"
                  checked={businessSettings.autoRouteOrders}
                  onChange={handleInputChange}
                  className="rounded border-zinc-300 text-black focus:ring-0 w-4 h-4"
                />
                <span className="text-zinc-700 dark:text-zinc-300">
                  <strong>Automated Supplier Routing:</strong> Instantly generate supplier tracking numbers upon order placement.
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="lowStockAlerts"
                  checked={businessSettings.lowStockAlerts}
                  onChange={handleInputChange}
                  className="rounded border-zinc-300 text-black focus:ring-0 w-4 h-4"
                />
                <span className="text-zinc-700 dark:text-zinc-300">
                  <strong>Low Inventory Warning:</strong> Alert when warehouse inventory drops below 10 units.
                </span>
              </label>

              <div className="pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <p className="font-semibold text-black dark:text-white">Monochrome Dark Mode</p>
                  <p className="text-[11px] text-zinc-500">Switch between deep obsidian dark and minimalist crisp light.</p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleDark}
                  className="btn btn-outline text-xs flex items-center gap-2"
                >
                  {businessSettings.darkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
                  {businessSettings.darkMode ? 'Light Theme' : 'Dark Theme'}
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: 3rd Party API Keys Configuration */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
                  <FiKey className="w-4 h-4" /> 4. Third-Party API Keys & Live Gateways
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Optional. If left blank, SimBusiness operates fully autonomously in simulated mode.
                </p>
              </div>
              <span className="badge-mono badge-mono-outline">Configurable</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-zinc-600 dark:text-zinc-400 font-medium">
                    Stripe Test Publishable Key
                  </label>
                  <a 
                    href="https://dashboard.stripe.com/test/apikeys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-zinc-400 hover:text-black dark:hover:text-white underline font-mono"
                  >
                    dashboard.stripe.com ↗
                  </a>
                </div>
                <input
                  type="password"
                  name="stripeKey"
                  placeholder="pk_test_51..."
                  value={businessSettings.stripeKey}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs font-mono focus:outline-none"
                />
                <p className="text-[10px] text-zinc-400 mt-1">Free instant developer sandbox key for simulated customer checkouts.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-zinc-600 dark:text-zinc-400 font-medium">
                    Exchange Rates API Key
                  </label>
                  <a 
                    href="https://www.exchangerate-api.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-zinc-400 hover:text-black dark:hover:text-white underline font-mono"
                  >
                    exchangerate-api.com ↗
                  </a>
                </div>
                <input
                  type="password"
                  name="exchangeRateKey"
                  placeholder="Free tier API key"
                  value={businessSettings.exchangeRateKey}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs font-mono focus:outline-none"
                />
                <p className="text-[10px] text-zinc-400 mt-1">Free instant tier (1,500 req/month) for live multi-currency pricing.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-zinc-600 dark:text-zinc-400 font-medium">
                    Supplier API Key (Printful / CJ)
                  </label>
                  <a 
                    href="https://developers.printful.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-zinc-400 hover:text-black dark:hover:text-white underline font-mono"
                  >
                    developers.printful.com ↗
                  </a>
                </div>
                <input
                  type="password"
                  name="supplierApiKey"
                  placeholder="Direct dropship supplier token"
                  value={businessSettings.supplierApiKey}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs font-mono focus:outline-none"
                />
                <p className="text-[10px] text-zinc-400 mt-1">Free developer sandbox API access for live POD sync.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-zinc-600 dark:text-zinc-400 font-medium">
                    Google Gemini API Key
                  </label>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-zinc-400 hover:text-black dark:hover:text-white underline font-mono"
                  >
                    aistudio.google.com ↗
                  </a>
                </div>
                <input
                  type="password"
                  name="aiApiKey"
                  placeholder="AIzaSy... (Google Gemini key)"
                  value={businessSettings.aiApiKey}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs font-mono focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
                <p className="text-[10px] text-zinc-400 mt-1 font-medium text-black dark:text-white">Active in SimBusiness! Powers the AI Strategic Advisor on Dashboard.</p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary px-6 text-xs flex items-center gap-2"
            >
              <FiSave className="w-4 h-4" />
              {isSaving ? 'Saving Preferences...' : 'Save All Settings'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}