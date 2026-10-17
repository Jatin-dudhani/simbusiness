'use client';

import React, { useState, useEffect } from 'react';
import { 
  BusinessStats, 
  CashLedgerEntry, 
  PayoutBatch, 
  MerchantAdvance, 
  AdChannelState, 
  ScenarioChallenge 
} from '@/types';
import { 
  createDailyPayoutBatch, 
  processDailySettlement, 
  remitMerchantAdvance 
} from '@/services/financialEngine';
import { INITIAL_AD_CHANNELS, simulateMarketingDay } from '@/services/adEngine';
import FinancialStatementsModal from '@/components/FinancialStatementsModal';
import MarketingChannelsModal from '@/components/MarketingChannelsModal';
import MonteCarloModal from '@/components/MonteCarloModal';
import ScenarioChallengesModal from '@/components/ScenarioChallengesModal';
import { 
  FiDollarSign, 
  FiShoppingCart, 
  FiTrendingUp, 
  FiPackage, 
  FiTarget, 
  FiPlay, 
  FiPlus, 
  FiRefreshCw,
  FiAlertCircle,
  FiActivity,
  FiPause,
  FiZap,
  FiTrendingDown,
  FiCpu,
  FiX,
  FiFileText,
  FiAward
} from 'react-icons/fi';
import { getStoreAiAdvice, getGeminiApiKey, setRuntimeAiApiKey } from '@/services/ai';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import BusinessInsights from '@/components/BusinessInsights';
import Link from 'next/link';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MarketEvent {
  title: string;
  description: string;
  impact: { inventory: number; sales: number; expenses: number };
}

const marketEvents: MarketEvent[] = [
  {
    title: 'Global Supply Chain Disruption',
    description: 'International container port congestion delays restock shipments.',
    impact: { inventory: 0, sales: -15, expenses: +10 }
  },
  {
    title: 'Viral Social Media Surge',
    description: 'A micro-influencer unboxing video drove high-intent organic traffic!',
    impact: { inventory: 0, sales: +45, expenses: 0 }
  },
  {
    title: 'Wholesale Supplier Price Adjustment',
    description: 'Primary supplier increased manufacturing cost of goods by 12%.',
    impact: { inventory: 0, sales: 0, expenses: +12 }
  },
  {
    title: 'Competitor Aggressive Clearance Sale',
    description: 'A rival brand slashed pricing by 30%, temporarily softening your conversion rate.',
    impact: { inventory: 0, sales: -20, expenses: 0 }
  },
  {
    title: 'Q4 Peak Holiday Shopping Window',
    description: 'E-commerce buyer sentiment and purchasing frequency surge across all categories.',
    impact: { inventory: 0, sales: +35, expenses: 0 }
  },
  {
    title: 'Carrier Discounted Bulk Shipping Tier',
    description: 'Secured negotiated commercial carrier volume discount for fulfillment.',
    impact: { inventory: 0, sales: 0, expenses: -15 }
  },
];

const simulationSpeeds = [
  { label: '1x', value: 1 },
  { label: '5x', value: 5 },
  { label: '10x', value: 10 }
];

export default function Dashboard() {
  const [businessStats, setBusinessStats] = useState<BusinessStats>({
    revenue: 0,
    expenses: 0,
    profit: 0,
    orders: 0,
    inventory: 25,
    marketing: 100,
  });

  const [simulationHistory, setSimulationHistory] = useState<{ profit: number[]; revenue: number[] }>({
    profit: [0],
    revenue: [0],
  });

  const [day, setDay] = useState(0);
  const [currentEvent, setCurrentEvent] = useState<MarketEvent | null>(null);
  const [autoSimulate, setAutoSimulate] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const [metrics, setMetrics] = useState({
    conversionRate: 2.8, // percent
    abandonmentRate: 67.4, // percent
    averageOrderValue: 49.50, // dollars
    returnRate: 7.5 // percent
  });

  // Option A Financial Engine State
  const [liquidCash, setLiquidCash] = useState(250.0);
  const [initialCash] = useState(250.0);
  const [payoutBatches, setPayoutBatches] = useState<PayoutBatch[]>([]);
  const [cashLedger, setCashLedger] = useState<CashLedgerEntry[]>([]);
  const [merchantAdvance, setMerchantAdvance] = useState<MerchantAdvance>({
    active: false,
    borrowedAmount: 0,
    flatFee: 0,
    totalRepayable: 0,
    remainingBalance: 0,
    remittancePercent: 10,
  });
  const [financialModalOpen, setFinancialModalOpen] = useState(false);
  const [cashWarning, setCashWarning] = useState<string | null>(null);

  // Option B: Multi-Channel Marketing Engine State
  const [adChannels, setAdChannels] = useState<AdChannelState[]>(INITIAL_AD_CHANNELS);
  const [marketingModalOpen, setMarketingModalOpen] = useState(false);

  // Option C: Monte Carlo Forecasting State
  const [monteCarloModalOpen, setMonteCarloModalOpen] = useState(false);

  // Option D: Scenario Challenges State
  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<ScenarioChallenge | null>(null);
  const [challengeStatusMsg, setChallengeStatusMsg] = useState<string | null>(null);

  // Gemini AI Advisor State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [aiKeyInput, setAiKeyInput] = useState('');
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);

  const fetchAiAdvice = async () => {
    setAiLoading(true);
    setAiModalOpen(true);
    setShowKeyPrompt(false);
    try {
      const advice = await getStoreAiAdvice({
        day,
        revenue: businessStats.revenue,
        expenses: businessStats.expenses,
        profit: businessStats.profit,
        orders: businessStats.orders,
        inventory: businessStats.inventory,
        conversionRate: metrics.conversionRate,
        currentEvent: currentEvent?.title,
      });
      setAiAdvice(advice);
    } catch (e: any) {
      setAiAdvice(`Error querying Gemini: ${e.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAskGemini = async () => {
    const key = getGeminiApiKey();
    if (!key) {
      setShowKeyPrompt(true);
      setAiModalOpen(true);
      return;
    }
    fetchAiAdvice();
  };

  const handleSaveGeminiKeyAndProceed = () => {
    if (!aiKeyInput.trim()) return;
    // Security: Keep in memory to eliminate clear-text storage risks (CodeQL Alert #1)
    setRuntimeAiApiKey(aiKeyInput.trim());
    setShowKeyPrompt(false);
    fetchAiAdvice();
  };

  // Auto-simulation interval timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoSimulate && businessStats.inventory > 0) {
      interval = setInterval(() => {
        simulateDay();
      }, 1800 / simulationSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSimulate, businessStats.inventory, simulationSpeed, day, businessStats, liquidCash, payoutBatches, merchantAdvance, adChannels, activeChallenge]);

  // Execute one day of business operations
  const simulateDay = () => {
    const nextDay = day + 1;
    setDay(nextDay);

    // 12% probability of market event triggering
    if (Math.random() < 0.12) {
      const newEvent = marketEvents[Math.floor(Math.random() * marketEvents.length)];
      setCurrentEvent(newEvent);
    } else if (currentEvent && Math.random() < 0.6) {
      setCurrentEvent(null);
    }

    // Traffic grows organically and with marketing
    const baseDailyVisitors = 110 + (day * 1.5);
    const marketingMultiplier = 1 + (businessStats.marketing / 400);

    let effectiveConversion = (metrics.conversionRate / 100) * marketingMultiplier;
    let eventExpenseMultiplier = 1;

    if (currentEvent) {
      effectiveConversion *= (1 + (currentEvent.impact.sales / 100));
      eventExpenseMultiplier = 1 + (currentEvent.impact.expenses / 100);
    }

    // Option B: Multi-Channel Marketing Engine
    // Runs Meta, TikTok, Google ads with saturation factor and creative fatigue
    const channelResult = simulateMarketingDay(adChannels, metrics.averageOrderValue);
    setAdChannels(channelResult.updatedChannels);
    const dailyAdSpend = channelResult.totalAdSpend;
    const adAttributedOrders = channelResult.totalAttributedOrders;

    // Combined order generation (Organic + Paid Ads)
    const organicOrders = Math.max(0, Math.round(baseDailyVisitors * effectiveConversion));
    const potentialOrders = Math.max(1, organicOrders + adAttributedOrders);
    const availableInventory = businessStats.inventory;
    const actualOrders = Math.min(potentialOrders, availableInventory);

    // Revenue per order
    const orderVariation = 0.2;
    const orderAov = metrics.averageOrderValue * (1 - orderVariation / 2 + Math.random() * orderVariation);
    const dailyRevenue = actualOrders * orderAov;

    // Direct fulfillment expenses (COGS ~45% + shipping + marketing burn)
    const cogsPerOrder = orderAov * 0.45;
    const shippingPerOrder = 5.0;
    const returnCost = dailyRevenue * (metrics.returnRate / 100) * 0.4;

    const rawExpenses = (actualOrders * (cogsPerOrder + shippingPerOrder)) + dailyAdSpend + returnCost;
    const dailyExpenses = rawExpenses * eventExpenseMultiplier;
    const dailyProfit = dailyRevenue - dailyExpenses;

    // Option A: Payment Processor Clearing (T+2 Settlement) & 10% Rolling Reserve
    const { updatedBatches, settledAmountToday, releasedReservesToday } = processDailySettlement(nextDay, payoutBatches);

    let newBatch: PayoutBatch | null = null;
    let dailyProcessingFees = 0;
    if (actualOrders > 0 && dailyRevenue > 0) {
      newBatch = createDailyPayoutBatch(nextDay, dailyRevenue, actualOrders);
      dailyProcessingFees = newBatch.processingFee;
    }
    const allBatches = newBatch ? [...updatedBatches, newBatch] : updatedBatches;
    setPayoutBatches(allBatches);

    // Automatic remittance on active Merchant Cash Advance
    let advanceRemittance = 0;
    if (settledAmountToday > 0 && merchantAdvance.active) {
      const remitResult = remitMerchantAdvance(settledAmountToday, merchantAdvance);
      advanceRemittance = remitResult.remittanceAmount;
      setMerchantAdvance(remitResult.updatedAdvance);
    }

    // Real Cash Movement:
    // Inflow: Settled payouts released by processor + matured rolling reserves
    // Outflow: Today's marketing burn + outbound shipping fees + advance remittance
    const totalCashInflow = settledAmountToday + releasedReservesToday;
    const directCashOutflow = dailyAdSpend + (actualOrders * shippingPerOrder) + advanceRemittance;
    const netCashDelta = totalCashInflow - directCashOutflow;

    const newCash = parseFloat((liquidCash + netCashDelta).toFixed(2));
    setLiquidCash(newCash);

    const inTransit = allBatches.filter(b => b.status === 'clearing').reduce((acc, b) => acc + b.netPayout, 0);
    const reservesHeld = allBatches.reduce((acc, b) => acc + b.rollingReserve, 0);

    // Record complete accounting & cash ledger row
    const ledgerRow: CashLedgerEntry = {
      day: nextDay,
      grossRevenue: parseFloat(dailyRevenue.toFixed(2)),
      processingFees: parseFloat(dailyProcessingFees.toFixed(2)),
      cogs: parseFloat((actualOrders * cogsPerOrder).toFixed(2)),
      shippingFees: parseFloat((actualOrders * shippingPerOrder).toFixed(2)),
      adSpend: parseFloat(dailyAdSpend.toFixed(2)),
      refunds: parseFloat(returnCost.toFixed(2)),
      netAccountingProfit: parseFloat(dailyProfit.toFixed(2)),
      cashInflow: parseFloat(totalCashInflow.toFixed(2)),
      cashOutflow: parseFloat(directCashOutflow.toFixed(2)),
      cashBalance: newCash,
      inTransitPayouts: parseFloat(inTransit.toFixed(2)),
      rollingReserve: parseFloat(reservesHeld.toFixed(2)),
      inventoryValuation: parseFloat((Math.max(0, businessStats.inventory - actualOrders) * 16.0).toFixed(2)),
      orders: actualOrders,
    };
    setCashLedger(prev => [...prev, ledgerRow]);

    if (newCash < 50) {
      setCashWarning(`Low Cash Warning: Spendable bank cash is $${newCash.toFixed(2)}. In-transit processor payouts ($${inTransit.toFixed(2)}) settle in T+2.`);
    } else {
      setCashWarning(null);
    }

    // Update real metrics
    setMetrics(prev => ({
      conversionRate: Math.max(1.0, Math.min(6.5, prev.conversionRate + (Math.random() - 0.5) * 0.15)),
      abandonmentRate: Math.max(48, Math.min(78, prev.abandonmentRate + (Math.random() - 0.5) * 0.5)),
      averageOrderValue: Math.max(30, Math.min(85, prev.averageOrderValue + (Math.random() - 0.5) * 1.5)),
      returnRate: Math.max(4, Math.min(18, prev.returnRate + (Math.random() - 0.5) * 0.25)),
    }));

    setBusinessStats(prev => ({
      revenue: parseFloat((prev.revenue + dailyRevenue).toFixed(2)),
      expenses: parseFloat((prev.expenses + dailyExpenses).toFixed(2)),
      profit: parseFloat((prev.profit + dailyProfit).toFixed(2)),
      orders: prev.orders + actualOrders,
      inventory: Math.max(0, prev.inventory - actualOrders),
      marketing: Math.max(0, parseFloat((prev.marketing - dailyAdSpend).toFixed(2))),
    }));

    setSimulationHistory(prev => ({
      profit: [...prev.profit, parseFloat((businessStats.profit + dailyProfit).toFixed(2))],
      revenue: [...prev.revenue, parseFloat((businessStats.revenue + dailyRevenue).toFixed(2))],
    }));

    // Option D: Evaluate Active Scenario Challenge Directives
    if (activeChallenge) {
      const updatedProfit = businessStats.profit + dailyProfit;
      const updatedOrders = businessStats.orders + actualOrders;

      if (activeChallenge.targetMetric === 'Net Business Profit' && updatedProfit >= activeChallenge.targetValue) {
        setChallengeStatusMsg(`🎉 Mission Accomplished! You conquered "${activeChallenge.title}" with $${updatedProfit.toFixed(2)} Net Profit on Day ${nextDay}!`);
        setAutoSimulate(false);
      } else if (activeChallenge.targetMetric === 'Total Orders Completed' && updatedOrders >= activeChallenge.targetValue) {
        setChallengeStatusMsg(`🎉 Mission Accomplished! You fulfilled ${updatedOrders} orders in "${activeChallenge.title}" on Day ${nextDay}!`);
        setAutoSimulate(false);
      } else if (nextDay >= activeChallenge.maxDays) {
        setChallengeStatusMsg(`⚠️ Mission Expired: Day ${activeChallenge.maxDays} reached before completing the target.`);
        setAutoSimulate(false);
      } else if (newCash <= 0 && inTransit <= 0) {
        setChallengeStatusMsg(`❌ Store Insolvent: Liquid cash hit $0 with no in-transit payouts. Challenge failed.`);
        setAutoSimulate(false);
      }
    }
  };

  const restockInventory = (qty = 25) => {
    const costPerItem = 16.0;
    const totalRestockCost = qty * costPerItem;
    if (liquidCash < totalRestockCost) {
      setCashWarning(`Restock Blocked: Insufficient bank funds ($${liquidCash.toFixed(2)} available, $${totalRestockCost.toFixed(2)} needed). Payouts settle in T+2, or draw a $500 Working Capital Advance.`);
      setFinancialModalOpen(true);
      return;
    }
    setLiquidCash(prev => parseFloat((prev - totalRestockCost).toFixed(2)));
    setBusinessStats(prev => ({
      ...prev,
      inventory: prev.inventory + qty,
      expenses: parseFloat((prev.expenses + totalRestockCost).toFixed(2)),
      profit: parseFloat((prev.profit - totalRestockCost).toFixed(2)),
    }));
  };

  const increaseMarketingBudget = (amount = 100) => {
    if (liquidCash < amount) {
      setCashWarning(`Cannot fund ads: Insufficient cash ($${liquidCash.toFixed(2)} available, $${amount.toFixed(2)} needed). In-transit payouts settle in T+2.`);
      return;
    }
    setLiquidCash(prev => parseFloat((prev - amount).toFixed(2)));
    setBusinessStats(prev => ({
      ...prev,
      marketing: prev.marketing + amount,
    }));
  };

  const handleRequestAdvance = (amount = 500) => {
    const flatFee = amount * 0.08;
    const totalRepayable = amount + flatFee;
    setMerchantAdvance({
      active: true,
      borrowedAmount: amount,
      flatFee,
      totalRepayable,
      remainingBalance: totalRepayable,
      remittancePercent: 10,
    });
    setLiquidCash(prev => parseFloat((prev + amount).toFixed(2)));
    setCashWarning(null);
  };

  const handleSelectChallenge = (challenge: ScenarioChallenge) => {
    setActiveChallenge(challenge);
    setChallengeStatusMsg(null);
    setDay(0);
    setLiquidCash(challenge.initialCash);
    setBusinessStats({
      revenue: 0,
      expenses: 0,
      profit: 0,
      orders: 0,
      inventory: challenge.initialInventory,
      marketing: 100,
    });
    setSimulationHistory({ profit: [0], revenue: [0] });
    setPayoutBatches([]);
    setCashLedger([]);
    setAdChannels(INITIAL_AD_CHANNELS);
    setMerchantAdvance({
      active: false,
      borrowedAmount: 0,
      flatFee: 0,
      totalRepayable: 0,
      remainingBalance: 0,
      remittancePercent: 10,
    });
    setCashWarning(null);
    setCurrentEvent(null);
    setAutoSimulate(false);
  };

  // Preset scenarios to test business limits
  const applyPresetScenario = (scenario: 'viral' | 'delay' | 'blitz' | 'reset') => {
    setActivePreset(scenario);
    if (scenario === 'viral') {
      setCurrentEvent({
        title: 'Viral TikTok Phenomenon',
        description: 'Product trending on social media: +60% sales demand for next days.',
        impact: { inventory: 0, sales: 60, expenses: 0 }
      });
      setMetrics(prev => ({ ...prev, conversionRate: 5.2 }));
    } else if (scenario === 'delay') {
      setCurrentEvent({
        title: 'Port Strike & Logistics Delay',
        description: 'Shipping carrier backlogs: -30% sales, +20% handling fees.',
        impact: { inventory: 0, sales: -30, expenses: 20 }
      });
    } else if (scenario === 'blitz') {
      setCurrentEvent({
        title: 'Black Friday Campaign Blitz',
        description: 'High traffic holiday sale: +80% orders, higher marketing conversion.',
        impact: { inventory: 0, sales: 80, expenses: 5 }
      });
      setBusinessStats(prev => ({ ...prev, marketing: prev.marketing + 200 }));
    } else if (scenario === 'reset') {
      setBusinessStats({
        revenue: 0,
        expenses: 0,
        profit: 0,
        orders: 0,
        inventory: 25,
        marketing: 100,
      });
      setSimulationHistory({ profit: [0], revenue: [0] });
      setDay(0);
      setCurrentEvent(null);
      setAutoSimulate(false);
      setLiquidCash(250.0);
      setPayoutBatches([]);
      setCashLedger([]);
      setAdChannels(INITIAL_AD_CHANNELS);
      setActiveChallenge(null);
      setChallengeStatusMsg(null);
      setMerchantAdvance({
        active: false,
        borrowedAmount: 0,
        flatFee: 0,
        totalRepayable: 0,
        remainingBalance: 0,
        remittancePercent: 10,
      });
      setCashWarning(null);
    }
  };

  // Monochrome Chart Setup
  const chartData = {
    labels: Array.from({ length: simulationHistory.profit.length }, (_, i) => `Day ${i}`),
    datasets: [
      {
        label: 'Net Profit ($)',
        data: simulationHistory.profit,
        borderColor: '#09090b',
        backgroundColor: 'rgba(9, 9, 11, 0.08)',
        fill: true,
        tension: 0.25,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: 'Cumulative Gross Revenue ($)',
        data: simulationHistory.revenue,
        borderColor: '#71717a',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.25,
        pointRadius: 1,
        borderWidth: 1.5,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          font: { family: 'inherit', size: 11 },
          color: '#52525b',
        },
      },
      tooltip: {
        backgroundColor: '#09090b',
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, color: '#71717a' },
      },
      y: {
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { font: { size: 10 }, color: '#71717a' },
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-mono badge-mono-black">Simulation Control</span>
              <span className="text-xs text-zinc-500 font-mono">Day {day} • Active Cycle</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white mt-1">
              Store Operations Dashboard
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Live feedback on revenue, supplier cost of goods, conversion rate variations, and market events.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Speed pills */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs">
              <span className="px-2 text-zinc-500">Speed:</span>
              {simulationSpeeds.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSimulationSpeed(s.value)}
                  className={`px-2 py-0.5 rounded font-mono font-medium ${
                    simulationSpeed === s.value
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-zinc-600 dark:text-zinc-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Run One Day */}
            <button
              onClick={simulateDay}
              disabled={businessStats.inventory <= 0 || autoSimulate}
              className="btn btn-primary text-xs"
            >
              <FiPlay className="w-3.5 h-3.5 mr-1.5" /> Next Day
            </button>

            {/* Auto Run Toggle */}
            <button
              onClick={() => setAutoSimulate(!autoSimulate)}
              disabled={businessStats.inventory <= 0}
              className={`btn ${autoSimulate ? 'btn-primary' : 'btn-outline'} text-xs`}
            >
              {autoSimulate ? (
                <>
                  <FiPause className="w-3.5 h-3.5 mr-1.5" /> Pause Engine
                </>
              ) : (
                <>
                  <FiZap className="w-3.5 h-3.5 mr-1.5" /> Auto-Simulate
                </>
              )}
            </button>

            {/* Financial Statements (P&L & Cash Flow) */}
            <button
              onClick={() => setFinancialModalOpen(true)}
              className="btn btn-outline text-xs flex items-center gap-1.5 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white"
              title="Inspect 3-Statement P&L, Cash Flow, Balance Sheet, and Payout Clearing Ledger"
            >
              <FiFileText className="w-3.5 h-3.5" />
              <span>Financials</span>
            </button>

            {/* Option B: Multi-Channel Ad Engine */}
            <button
              onClick={() => setMarketingModalOpen(true)}
              className="btn btn-outline text-xs flex items-center gap-1.5 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white"
              title="Configure Meta, TikTok, and Google ad spend allocation & creative fatigue"
            >
              <FiTarget className="w-3.5 h-3.5" />
              <span>Ad Engine</span>
            </button>

            {/* Option C: Founder Monte Carlo Simulator */}
            <button
              onClick={() => setMonteCarloModalOpen(true)}
              className="btn btn-outline text-xs flex items-center gap-1.5 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white"
              title="Run 500 stochastic trials using real unit economics"
            >
              <FiTrendingUp className="w-3.5 h-3.5" />
              <span>Monte Carlo</span>
            </button>

            {/* Option D: Career Scenarios & Challenges */}
            <button
              onClick={() => setScenarioModalOpen(true)}
              className="btn btn-outline text-xs flex items-center gap-1.5 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white"
              title="Tackle structured founder challenges with victory/loss rules"
            >
              <FiAward className="w-3.5 h-3.5" />
              <span>Challenges</span>
            </button>

            {/* Gemini AI Advisor */}
            <button
              onClick={handleAskGemini}
              className="btn btn-outline text-xs flex items-center gap-1.5 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white"
              title="Get live strategy insights from Google Gemini AI"
            >
              <FiCpu className="w-3.5 h-3.5" />
              <span>AI Advisor</span>
            </button>
          </div>
        </div>

        {/* Challenge Directives Completed / Expired Status */}
        {challengeStatusMsg && (
          <div className="mb-6 p-4 rounded-xl border border-zinc-900 bg-zinc-900 text-white flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <FiAward className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-xs font-medium">{challengeStatusMsg}</div>
            </div>
            <button
              onClick={() => setChallengeStatusMsg(null)}
              className="px-2.5 py-1 text-[11px] bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 transition"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Active Mission Banner (Option D) */}
        {activeChallenge && (
          <div className="mb-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#161618] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 bg-black text-white dark:bg-white dark:text-black rounded-lg">
                <FiAward className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-zinc-900 dark:text-white">{activeChallenge.title}</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-200 dark:bg-zinc-800 rounded">
                    Day {day} / {activeChallenge.maxDays}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Target: {activeChallenge.targetMetric} ≥ {activeChallenge.targetValue} (Current Profit: ${businessStats.profit.toFixed(2)}, Orders: {businessStats.orders})
                </p>
              </div>
            </div>
            <button
              onClick={() => setScenarioModalOpen(true)}
              className="text-xs text-zinc-600 dark:text-zinc-300 hover:underline text-left sm:text-right"
            >
              Switch Mission →
            </button>
          </div>
        )}

        {/* Working Capital & Cash Warning Banner */}
        {cashWarning && (
          <div className="mb-6 p-4 rounded-xl border border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-950 dark:text-rose-200 flex items-start justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="font-semibold block mb-0.5">Cash Flow Friction Warning</strong>
                <span>{cashWarning}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setFinancialModalOpen(true)}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg transition"
              >
                Open Ledger
              </button>
              {!merchantAdvance.active && (
                <button
                  onClick={() => handleRequestAdvance(500)}
                  className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-lg transition"
                >
                  Draw $500 Advance
                </button>
              )}
            </div>
          </div>
        )}

        {/* Market Event Banner */}
        {currentEvent && (
          <div className="mb-6 p-4 rounded-xl border border-black dark:border-white bg-zinc-50 dark:bg-[#161618] flex items-start gap-3">
            <FiAlertCircle className="w-5 h-5 text-black dark:text-white mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-black dark:text-white">
                  Market Event: {currentEvent.title}
                </h3>
                <span className="badge-mono badge-mono-outline text-[10px]">Active Now</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">{currentEvent.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs font-mono">
                {currentEvent.impact.sales !== 0 && (
                  <span className="font-semibold text-black dark:text-white">
                    Sales Impact: {currentEvent.impact.sales > 0 ? '+' : ''}{currentEvent.impact.sales}%
                  </span>
                )}
                {currentEvent.impact.expenses !== 0 && (
                  <span className="font-semibold text-black dark:text-white">
                    Expense Shift: {currentEvent.impact.expenses > 0 ? '+' : ''}{currentEvent.impact.expenses}%
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Low Inventory Alert */}
        {businessStats.inventory <= 5 && (
          <div className="mb-6 p-3.5 rounded-xl border border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <FiPackage className="w-4 h-4 text-black dark:text-white" />
              <span>
                <strong>Stock Alert:</strong> Only {businessStats.inventory} units remain in store inventory. Orders will stall if exhausted.
              </span>
            </div>
            <button
              onClick={() => restockInventory(25)}
              className="btn btn-primary text-xs py-1 px-3"
            >
              Restock +25 Units ($400)
            </button>
          </div>
        )}

        {/* Business Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-medium tracking-wider text-zinc-500">Gross Revenue</span>
              <FiDollarSign className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-2xl font-bold text-black dark:text-white mt-2">${businessStats.revenue.toFixed(2)}</p>
            <span className="text-[11px] text-zinc-500 font-mono">Cumulative customer sales</span>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-medium tracking-wider text-zinc-500">Spendable Cash in Bank</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${liquidCash > 50 ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300' : 'bg-rose-100 text-rose-700'}`}>
                {payoutBatches.filter(b => b.status === 'clearing').reduce((acc, b) => acc + b.netPayout, 0) > 0 
                  ? `+$${payoutBatches.filter(b => b.status === 'clearing').reduce((acc, b) => acc + b.netPayout, 0).toFixed(0)} clearing` 
                  : 'T+2 settlement'}
              </span>
            </div>
            <p className={`text-2xl font-bold mt-2 ${liquidCash >= 0 ? 'text-black dark:text-white' : 'text-rose-600'}`}>
              ${liquidCash.toFixed(2)}
            </p>
            <button 
              onClick={() => setFinancialModalOpen(true)}
              className="text-[11px] text-zinc-500 hover:text-black dark:hover:text-white underline mt-0.5 block text-left"
            >
              View 3-statement P&L & Cash Flow →
            </button>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-medium tracking-wider text-zinc-500">Net Business Profit</span>
              <FiTrendingUp className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-2xl font-bold text-black dark:text-white mt-2">${businessStats.profit.toFixed(2)}</p>
            <span className="text-[11px] text-zinc-500 font-mono">
              Margin: {businessStats.revenue > 0 ? ((businessStats.profit / businessStats.revenue) * 100).toFixed(1) : 0}%
            </span>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-medium tracking-wider text-zinc-500">Orders Processed</span>
              <FiShoppingCart className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-2xl font-bold text-black dark:text-white mt-2">{businessStats.orders}</p>
            <Link href="/orders" className="text-[11px] underline text-zinc-500 hover:text-black dark:hover:text-white">
              View fulfillment breakdown →
            </Link>
          </div>
        </div>

        {/* Real-World E-Commerce Benchmarks */}
        <div className="card mb-8">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-2">
              <FiActivity className="w-4 h-4" /> Live Store Conversion Benchmarks
            </h2>
            <span className="text-xs font-mono text-zinc-400">Dynamic Industry Standard</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="p-3 border border-zinc-100 dark:border-zinc-800 rounded-xl">
              <span className="text-xs text-zinc-500 font-medium">Conversion Rate</span>
              <p className="text-2xl font-bold text-black dark:text-white mt-1">{metrics.conversionRate.toFixed(2)}%</p>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Industry avg: 1.8% – 3.2%</p>
            </div>

            <div className="p-3 border border-zinc-100 dark:border-zinc-800 rounded-xl">
              <span className="text-xs text-zinc-500 font-medium">Cart Abandonment</span>
              <p className="text-2xl font-bold text-black dark:text-white mt-1">{metrics.abandonmentRate.toFixed(1)}%</p>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Industry avg: 65% – 72%</p>
            </div>

            <div className="p-3 border border-zinc-100 dark:border-zinc-800 rounded-xl">
              <span className="text-xs text-zinc-500 font-medium">Avg. Order Value (AOV)</span>
              <p className="text-2xl font-bold text-black dark:text-white mt-1">${metrics.averageOrderValue.toFixed(2)}</p>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Adjust via product bundling</p>
            </div>

            <div className="p-3 border border-zinc-100 dark:border-zinc-800 rounded-xl">
              <span className="text-xs text-zinc-500 font-medium">Return / Dispute Rate</span>
              <p className="text-2xl font-bold text-black dark:text-white mt-1">{metrics.returnRate.toFixed(1)}%</p>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Industry avg: 6% – 12%</p>
            </div>
          </div>
        </div>

        {/* Operational Actions & Presets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="font-bold text-sm text-black dark:text-white flex items-center gap-2 mb-3">
              <FiPackage className="w-4 h-4" /> Inventory Management
            </h3>
            <p className="text-xs text-zinc-500 mb-1">
              Active Stock: <strong className="font-mono text-black dark:text-white text-sm">{businessStats.inventory} units</strong>
            </p>
            <p className="text-[11px] text-zinc-400 mb-4">Replenish stock before customer checkouts deplete inventory.</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => restockInventory(25)}
                className="btn btn-outline text-xs"
              >
                +25 ($400)
              </button>
              <button
                onClick={() => restockInventory(100)}
                className="btn btn-outline text-xs"
              >
                +100 ($1,600)
              </button>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-black dark:text-white flex items-center gap-2">
                <FiTarget className="w-4 h-4" /> Multi-Channel Ads
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">
                ${adChannels.reduce((a, c) => a + c.dailyBudget, 0)}/day
              </span>
            </div>
            <p className="text-xs text-zinc-500 mb-2">
              Meta: <strong className="text-zinc-900 dark:text-white font-mono">${adChannels.find(c => c.id === 'meta')?.dailyBudget || 0}</strong> • 
              TikTok: <strong className="text-zinc-900 dark:text-white font-mono">${adChannels.find(c => c.id === 'tiktok')?.dailyBudget || 0}</strong> • 
              Google: <strong className="text-zinc-900 dark:text-white font-mono">${adChannels.find(c => c.id === 'google')?.dailyBudget || 0}</strong>
            </p>
            <p className="text-[11px] text-zinc-400 mb-3">Manage diminishing ROAS and refresh fatigued ad creatives.</p>
            <button
              onClick={() => setMarketingModalOpen(true)}
              className="btn btn-outline text-xs w-full flex items-center justify-center gap-1.5"
            >
              <FiTarget className="w-3.5 h-3.5" /> Configure Channels & Creatives
            </button>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-black dark:text-white flex items-center gap-2">
                <FiZap className="w-4 h-4" /> Career Missions & Presets
              </h3>
              {activeChallenge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-black text-white dark:bg-white dark:text-black rounded">
                  Mission Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 mb-3">Tackle realistic founder milestones or simulate extreme shocks.</p>
            <button
              onClick={() => setScenarioModalOpen(true)}
              className="btn btn-primary text-xs w-full mb-2 flex items-center justify-center gap-1.5"
            >
              <FiAward className="w-3.5 h-3.5" /> Founder Challenges ({activeChallenge ? '1 Active' : 'Select'})
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => applyPresetScenario('viral')}
                className="btn btn-outline text-xs text-left"
              >
                Viral Surge
              </button>
              <button
                onClick={() => applyPresetScenario('reset')}
                className="btn btn-outline text-xs text-zinc-400"
              >
                Reset Stats
              </button>
            </div>
          </div>
        </div>

        {/* Profit Trend Chart */}
        <div className="card mb-8">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">
                Cumulative Profit & Revenue Trajectory
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">Tracking daily performance curve over operational timeline</p>
            </div>
          </div>
          <div className="h-64 sm:h-80 w-full">
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>

        {/* Real-World Insights Component */}
        <BusinessInsights />

        {/* Gemini AI Advisor Modal */}
        {aiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-left">
              <button
                onClick={() => setAiModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-black dark:hover:text-white"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="badge-mono badge-mono-black">Gemini 1.5 Flash</span>
                <span className="text-xs text-zinc-500 font-mono">Store Optimization Strategist</span>
              </div>

              {showKeyPrompt ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-black dark:text-white">
                      Enter Google Gemini API Key
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      To run live AI intelligence, enter your Google Gemini API key below. You can get one for free at <span className="font-semibold text-black dark:text-white">aistudio.google.com</span>.
                    </p>
                  </div>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={aiKeyInput}
                    onChange={(e) => setAiKeyInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs font-mono focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setAiModalOpen(false)}
                      className="btn btn-outline text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveGeminiKeyAndProceed}
                      disabled={!aiKeyInput.trim()}
                      className="btn btn-primary text-xs"
                    >
                      Save Key & Generate Strategy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                      <FiCpu className="w-5 h-5" /> Strategic Operations Audit
                    </h3>
                    <button
                      onClick={fetchAiAdvice}
                      disabled={aiLoading}
                      className="text-xs text-zinc-500 hover:text-black dark:hover:text-white flex items-center gap-1 font-mono"
                    >
                      <FiRefreshCw className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
                      Regenerate
                    </button>
                  </div>

                  {aiLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-3">
                      <FiRefreshCw className="w-6 h-6 animate-spin text-black dark:text-white" />
                      <p className="text-xs text-zinc-500 font-mono">Analyzing margins, inventory, and conversion trends...</p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-obsidian border border-zinc-100 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-200 whitespace-pre-line leading-relaxed max-h-96 overflow-y-auto font-mono">
                      {aiAdvice}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      onClick={() => {
                        setShowKeyPrompt(true);
                        setAiKeyInput('');
                      }}
                      className="text-[11px] text-zinc-400 hover:text-black dark:hover:text-white hover:underline"
                    >
                      Change / Update Gemini Key
                    </button>
                    <button
                      onClick={() => setAiModalOpen(false)}
                      className="btn btn-primary text-xs"
                    >
                      Close Strategy Plan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Option A: Financial Statements (3-Statement P&L, Cash Flow, Balance Sheet & Ledger) */}
        <FinancialStatementsModal
          isOpen={financialModalOpen}
          onClose={() => setFinancialModalOpen(false)}
          ledger={cashLedger}
          payoutBatches={payoutBatches}
          liquidCash={liquidCash}
          initialCash={initialCash}
          merchantAdvance={merchantAdvance}
          onRequestAdvance={handleRequestAdvance}
          inventoryUnits={businessStats.inventory}
        />

        {/* Option B: Multi-Channel Marketing Engine Modal */}
        <MarketingChannelsModal
          isOpen={marketingModalOpen}
          onClose={() => setMarketingModalOpen(false)}
          channels={adChannels}
          onUpdateChannels={setAdChannels}
          liquidCash={liquidCash}
        />

        {/* Option C: Founder Monte Carlo Forecasting Modal */}
        <MonteCarloModal
          isOpen={monteCarloModalOpen}
          onClose={() => setMonteCarloModalOpen(false)}
        />

        {/* Option D: Founder Career Scenarios & Challenges Modal */}
        <ScenarioChallengesModal
          isOpen={scenarioModalOpen}
          onClose={() => setScenarioModalOpen(false)}
          onSelectChallenge={handleSelectChallenge}
          activeChallengeId={activeChallenge?.id || null}
        />
      </main>
    </div>
  );
}