'use client';

import { useState } from 'react';
import { BusinessSettings } from '@/types';

export default function SettingsPage() {
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    businessName: 'My Dropshipping Business',
    email: 'user@example.com',
    currency: 'USD',
    taxRate: 7.5,
    shippingFee: 4.99,
    profitMargin: 30,
    notificationsEnabled: true,
    darkMode: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setBusinessSettings({
      ...businessSettings,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBusinessSettings({
      ...businessSettings,
      [name]: value
    });
  };

  const saveSettings = () => {
    // In a real app, this would save to a backend or localStorage
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Business Settings</h2>
            
            <div className="space-y-6">
              {/* Business Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Business Information</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={businessSettings.businessName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={businessSettings.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
              
              {/* Financial Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">Financial Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={businessSettings.currency}
                      onChange={handleSelectChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="AUD">AUD ($)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      id="taxRate"
                      name="taxRate"
                      min="0"
                      step="0.1"
                      value={businessSettings.taxRate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="shippingFee" className="block text-sm font-medium text-gray-700 mb-1">
                      Default Shipping Fee
                    </label>
                    <input
                      type="number"
                      id="shippingFee"
                      name="shippingFee"
                      min="0"
                      step="0.01"
                      value={businessSettings.shippingFee}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="profitMargin" className="block text-sm font-medium text-gray-700 mb-1">
                      Target Profit Margin (%)
                    </label>
                    <input
                      type="number"
                      id="profitMargin"
                      name="profitMargin"
                      min="0"
                      max="100"
                      value={businessSettings.profitMargin}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
              
              {/* Preferences */}
              <div>
                <h3 className="text-lg font-medium mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notificationsEnabled"
                      name="notificationsEnabled"
                      checked={businessSettings.notificationsEnabled}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary border-gray-300 rounded"
                    />
                    <label htmlFor="notificationsEnabled" className="ml-2 block text-sm text-gray-700">
                      Enable Notifications
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="darkMode"
                      name="darkMode"
                      checked={businessSettings.darkMode}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary border-gray-300 rounded"
                    />
                    <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700">
                      Dark Mode
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={saveSettings}
                  className="btn btn-primary w-full"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 