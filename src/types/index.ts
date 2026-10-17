// Supplier interfaces
export interface Supplier {
  id: number;
  name: string;
  location: string;
  category: string;
  rating: number;
  lead_time: string;
  price_level: string;
  min_order: number;
}

// Product interface
export interface Product {
  id: string;
  name: string;
  category: string;
  cost: number;
  potentialPrice: number;
  rating: number;
  imageUrl: string;
  description?: string;
}

// Market interfaces
export interface MarketTrend {
  category: string;
  growth: number;
  demand: 'High' | 'Medium' | 'Low';
}

export interface ProductRecommendation {
  name: string;
  category: string;
  price: number;
  margin: number;
  popularity: number;
}

export interface MarketData {
  trends: MarketTrend[];
  recommendations: ProductRecommendation[];
}

// Business stats interfaces
export interface BusinessStats {
  revenue: number;
  expenses: number;
  profit: number;
  orders: number;
  inventory: number;
  marketing: number;
}

// Settings interfaces
export interface BusinessSettings {
  businessName: string;
  email: string;
  currency: string;
  taxRate: number;
  shippingFee: number;
  profitMargin: number;
  notificationsEnabled: boolean;
  darkMode: boolean;
}

// Event interface for activity logs
export interface BusinessEvent {
  id: number;
  date: string;
  activity: string;
  amount: number;
}

// -----------------------------------------------------------------------------
// Financial Engine Types (Option A)
// -----------------------------------------------------------------------------

export interface CashLedgerEntry {
  day: number;
  grossRevenue: number;
  processingFees: number;
  cogs: number;
  shippingFees: number;
  adSpend: number;
  refunds: number;
  netAccountingProfit: number;
  cashInflow: number;
  cashOutflow: number;
  cashBalance: number;
  inTransitPayouts: number;
  rollingReserve: number;
  inventoryValuation: number;
  orders: number;
}

export interface PayoutBatch {
  id: string;
  createdDay: number;
  settleDay: number;
  grossAmount: number;
  processingFee: number;
  rollingReserve: number;
  netPayout: number;
  status: 'clearing' | 'settled';
}

export interface MerchantAdvance {
  active: boolean;
  borrowedAmount: number;
  flatFee: number;
  totalRepayable: number;
  remainingBalance: number;
  remittancePercent: number; // e.g. 10%
}

export interface IncomeStatement {
  grossSales: number;
  processingFees: number;
  refunds: number;
  netSales: number;
  cogs: number;
  grossProfit: number;
  grossMarginPct: number;
  operatingExpenses: {
    adSpend: number;
    shipping: number;
    merchantAdvanceFees: number;
    overhead: number;
    total: number;
  };
  netProfit: number;
  netMarginPct: number;
}

export interface CashFlowStatement {
  operatingInflows: number;
  operatingOutflows: number;
  financingCashFlow: number;
  netCashFlow: number;
  beginningCash: number;
  endingCash: number;
}

export interface BalanceSheet {
  assets: {
    liquidCash: number;
    inTransitPayouts: number;
    processorReserves: number;
    inventoryValuation: number;
    totalAssets: number;
  };
  liabilities: {
    merchantAdvanceBalance: number;
    unfulfilledOrdersObligation: number;
    totalLiabilities: number;
  };
  equity: {
    retainedEarnings: number;
    totalEquity: number;
  };
}

// -----------------------------------------------------------------------------
// Marketing & Ad Saturation Types (Option B)
// -----------------------------------------------------------------------------

export type AdChannelId = 'meta' | 'tiktok' | 'google';

export interface AdChannelState {
  id: AdChannelId;
  name: string;
  dailyBudget: number;
  baseCpm: number;
  effectiveCpm: number;
  baseCtr: number;
  effectiveCtr: number;
  baseCvr: number;
  effectiveCvr: number;
  effectiveRoas: number;
  fatiguePct: number; // 0 to 100
  saturationFactor: number; // Diminishing returns scaling factor
  totalSpent: number;
  totalAttributedRevenue: number;
}

// -----------------------------------------------------------------------------
// Monte Carlo Forecasting Types (Option C)
// -----------------------------------------------------------------------------

export interface MonteCarloInputs {
  initialRunway: number;
  retailPrice: number;
  landedCost: number;
  shippingCost: number;
  dailyAdBudget: number;
  baseCpm: number;
  expectedCtrPct: number;
  expectedCvrPct: number;
  returnRatePct: number;
  simulationDays: number;
  runsCount: number;
}

export interface MonteCarloTrajectory {
  day: number;
  p10: number; // 10th percentile (bear case)
  p50: number; // 50th percentile (median)
  p90: number; // 90th percentile (bull case)
}

export interface MonteCarloSummary {
  runsCompleted: number;
  profitProbabilityPct: number;
  insolvencyRiskPct: number;
  medianFinalCash: number;
  bestCaseFinalCash: number;
  worstCaseFinalCash: number;
  medianRoas: number;
  breakevenCvrPct: number;
  breakevenRoas: number;
  recommendedMinimumRunway: number;
  cashTrajectories: MonteCarloTrajectory[];
  profitTrajectories: MonteCarloTrajectory[];
}

// -----------------------------------------------------------------------------
// Scenario / Career Mode Types (Option D)
// -----------------------------------------------------------------------------

export interface ScenarioChallenge {
  id: string;
  title: string;
  badge: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Hardcore';
  description: string;
  initialCash: number;
  initialInventory: number;
  targetMetric: string;
  targetValue: number;
  maxDays: number;
  rules: string[];
}
 