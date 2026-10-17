'use client';

import React, { useState } from 'react';
import { 
  FiPercent, 
  FiDollarSign, 
  FiTrendingUp, 
  FiPieChart, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiSliders,
  FiTarget,
  FiRefreshCw
} from 'react-icons/fi';
import MonteCarloModal from '@/components/MonteCarloModal';
import AuthGuard from '@/components/AuthGuard';

interface Preset {
  name: string;
  price: number;
  cost: number;
  shippingCustomer: number;
  shippingSupplier: number;
  cpa: number;
  returnRate: number;
}

const PRESETS: Preset[] = [
  {
    name: 'High-Ticket Electronics',
    price: 119.99,
    cost: 44.50,
    shippingCustomer: 0, // Free shipping marketing
    shippingSupplier: 8.50,
    cpa: 28.00,
    returnRate: 6,
  },
  {
    name: 'Viral Lifestyle Impulse Buy',
    price: 29.99,
    cost: 7.20,
    shippingCustomer: 4.99,
    shippingSupplier: 4.50,
    cpa: 11.50,
    returnRate: 4,
  },
  {
    name: 'Fashion / Apparel (High Return)',
    price: 54.00,
    cost: 16.00,
    shippingCustomer: 4.99,
    shippingSupplier: 5.50,
    cpa: 17.00,
    returnRate: 18,
  },
];

export default function CalculatorPage() {
  const [price, setPrice] = useState<number>(49.99);
  const [cost, setCost] = useState<number>(18.50);
  const [shippingCharged, setShippingCharged] = useState<number>(4.99);
  const [shippingPaid, setShippingPaid] = useState<number>(5.50);
  const [cpa, setCpa] = useState<number>(14.00); // Ad spend per sale
  const [paymentFeePercent, setPaymentFeePercent] = useState<number>(2.9);
  const [paymentFeeFixed, setPaymentFeeFixed] = useState<number>(0.30);
  const [returnRate, setReturnRate] = useState<number>(8); // percent
  const [monthlyTargetOrders, setMonthlyTargetOrders] = useState<number>(300);
  const [monteCarloOpen, setMonteCarloOpen] = useState<boolean>(false);

  // Calculations
  const grossRevenue = price + shippingCharged;
  const paymentFee = (grossRevenue * (paymentFeePercent / 100)) + paymentFeeFixed;
  const directProductCost = cost + shippingPaid;
  const marketingCost = cpa;
  const returnAllowance = (grossRevenue * (returnRate / 100)) * 0.5; // Estimated 50% loss on returned items
  const totalCostPerUnit = directProductCost + paymentFee + marketingCost + returnAllowance;
  const netProfitPerUnit = grossRevenue - totalCostPerUnit;
  const netMarginPercent = (netProfitPerUnit / grossRevenue) * 100;
  
  // Break-even ROAS = (Gross Revenue) / (Ad Spend CPA)
  const breakEvenRoas = cpa > 0 ? (grossRevenue / cpa) : 0;

  // Monthly projections
  const monthlyRevenue = grossRevenue * monthlyTargetOrders;
  const monthlyProfit = netProfitPerUnit * monthlyTargetOrders;
  const monthlyAdSpend = cpa * monthlyTargetOrders;

  const applyPreset = (preset: Preset) => {
    setPrice(preset.price);
    setCost(preset.cost);
    setShippingCharged(preset.shippingCustomer);
    setShippingPaid(preset.shippingSupplier);
    setCpa(preset.cpa);
    setReturnRate(preset.returnRate);
  };

  const getHealthVerdict = () => {
    if (netMarginPercent >= 25) {
      return {
        label: 'Highly Profitable & Scalable Winner',
        description: 'Strong unit economics with sufficient room to aggressively scale paid ads (TikTok, Meta, Google).',
        badgeClass: 'badge-mono badge-mono-black',
      };
    } else if (netMarginPercent >= 10) {
      return {
        label: 'Viable with Moderate Optimization',
        description: 'Profitable, but watch ad fatigue closely. Improve average order value (AOV) with bundles or post-purchase upsells.',
        badgeClass: 'badge-mono badge-mono-outline',
      };
    } else if (netMarginPercent > 0) {
      return {
        label: 'Thin Margin Warning (<10%)',
        description: 'Vulnerable to slight spikes in ad CPA or shipping rates. Renegotiate supplier costs or increase retail pricing.',
        badgeClass: 'badge-mono badge-mono-outline',
      };
    } else {
      return {
        label: 'Unprofitable Unit Economics',
        description: 'You are currently losing money on every order shipped. Reduce ad acquisition costs or switch wholesale suppliers immediately.',
        badgeClass: 'badge-mono badge-mono-black',
      };
    }
  };

  const verdict = getHealthVerdict();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-mono badge-mono-black">Strategic Finance</span>
              <span className="text-xs text-zinc-500 font-mono">Unit Economics Engine</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white mt-1">
              Dropshipping Profit & Break-Even Calculator
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Model accurate per-order unit economics including COGS, fulfillment, payment gateway processing, customer return rates, and ROAS.
            </p>
          </div>
          <button
            onClick={() => setMonteCarloOpen(true)}
            className="btn btn-primary text-xs flex items-center gap-2 self-start md:self-auto shrink-0"
            title="Run 500 stochastic trials using these exact unit economics"
          >
            <FiTrendingUp className="w-3.5 h-3.5" />
            <span>Monte Carlo Simulator</span>
          </button>
        </div>

        {/* Preset Selector */}
        <div className="card mb-8 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <FiSliders className="w-3.5 h-3.5" />
              Quick Industry Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Section (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="card space-y-6">
              <h2 className="text-base font-bold text-black dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
                1. Revenue & Pricing Structure
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Retail Selling Price ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Shipping Fee Charged to Customer ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={shippingCharged}
                      onChange={(e) => setShippingCharged(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card space-y-6">
              <h2 className="text-base font-bold text-black dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
                2. Supplier & Fulfillment Costs
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Supplier Product Base Cost (COGS) ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={cost}
                      onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Shipping Cost Paid to Supplier ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={shippingPaid}
                      onChange={(e) => setShippingPaid(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card space-y-6">
              <h2 className="text-base font-bold text-black dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
                3. Marketing, Processing & Returns
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Ad Spend per Sale (CPA) ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={cpa}
                      onChange={(e) => setCpa(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Gateway Fee (% + $0.30)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={paymentFeePercent}
                      onChange={(e) => setPaymentFeePercent(parseFloat(e.target.value) || 0)}
                      className="w-full pr-8 pl-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Expected Return Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="50"
                      value={returnRate}
                      onChange={(e) => setReturnRate(parseFloat(e.target.value) || 0)}
                      className="w-full pr-8 pl-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">%</span>
                  </div>
                </div>
              </div>

              {/* Monthly volume slider */}
              <div className="pt-2">
                <div className="flex justify-between text-xs font-medium mb-2">
                  <span className="text-zinc-600 dark:text-zinc-400">Target Monthly Orders Scale:</span>
                  <span className="font-bold text-black dark:text-white font-mono">{monthlyTargetOrders} orders / mo</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="2000"
                  step="20"
                  value={monthlyTargetOrders}
                  onChange={(e) => setMonthlyTargetOrders(parseInt(e.target.value))}
                  className="w-full accent-black dark:accent-white cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Results Summary & Health Dashboard (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-xs uppercase font-mono tracking-wider text-zinc-400">Per-Order Economics</span>
                <span className={verdict.badgeClass}>{verdict.label}</span>
              </div>

              {/* Net Profit Big KPI */}
              <div className="py-6 text-center border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-xs uppercase font-medium tracking-widest text-zinc-400">Net Profit Per Sale</span>
                <p className={`text-4xl font-extrabold tracking-tight mt-1 ${
                  netProfitPerUnit >= 0 ? 'text-black dark:text-white' : 'text-zinc-400'
                }`}>
                  ${netProfitPerUnit.toFixed(2)}
                </p>
                <div className="flex items-center justify-center gap-3 mt-2 text-xs font-mono">
                  <span>Net Margin: <strong>{netMarginPercent.toFixed(1)}%</strong></span>
                  <span>•</span>
                  <span>Break-Even ROAS: <strong>{breakEvenRoas.toFixed(2)}x</strong></span>
                </div>
              </div>

              {/* Cost Stack Breakdown */}
              <div className="py-4 border-b border-zinc-100 dark:border-zinc-800 space-y-2 text-xs font-mono">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-sans mb-3">
                  Cost Breakdown per Unit
                </h3>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Gross Customer Inflow:</span>
                  <span className="font-semibold text-black dark:text-white">+${grossRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Wholesale COGS & Shipping:</span>
                  <span>-${directProductCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Customer Acquisition Ad Spend:</span>
                  <span>-${marketingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Stripe/Gateway Processing Fee:</span>
                  <span>-${paymentFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Return & Dispute Reserve:</span>
                  <span>-${returnAllowance.toFixed(2)}</span>
                </div>
              </div>

              {/* Monthly Projections */}
              <div className="py-4 border-b border-zinc-100 dark:border-zinc-800 space-y-2 text-xs">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                  Monthly Projection ({monthlyTargetOrders} Units)
                </h3>
                <div className="flex justify-between font-mono">
                  <span className="text-zinc-500">Gross Monthly GMV:</span>
                  <span className="font-bold text-black dark:text-white">${monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-zinc-500">Total Ad Budget Needed:</span>
                  <span className="text-black dark:text-white">${monthlyAdSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between font-mono font-bold text-sm pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span>Net Monthly Profit:</span>
                  <span className="text-black dark:text-white">${monthlyProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Recommendation Note */}
              <div className="pt-4 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                <strong className="text-black dark:text-white">Strategic Note:</strong> {verdict.description}
              </div>
            </div>
          </div>
        </div>

        {/* Founder Monte Carlo Simulator Modal */}
        <MonteCarloModal
          isOpen={monteCarloOpen}
          onClose={() => setMonteCarloOpen(false)}
        />
      </main>
    </div>
    </AuthGuard>
  );
}
