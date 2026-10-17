import {
  CashLedgerEntry,
  PayoutBatch,
  MerchantAdvance,
  IncomeStatement,
  CashFlowStatement,
  BalanceSheet,
} from '@/types';

/**
 * Standard Payment Gateway Fee Parameters (Stripe Benchmark)
 * 2.9% + $0.30 per successful customer transaction
 */
export const PROCESSING_FEE_RATE = 0.029;
export const PROCESSING_FEE_FIXED = 0.30;

/**
 * Rolling Reserve Rate (10% held for risk mitigation)
 * Standard for new high-volume dropshipping merchants
 */
export const ROLLING_RESERVE_RATE = 0.10;

/**
 * Payout lag in business days (T+2 standard clearing time)
 */
export const PAYOUT_SETTLEMENT_DAYS = 2;

/**
 * Days before rolling reserve is unlocked and credited back to merchant cash
 */
export const RESERVE_HOLD_DAYS = 30;

/**
 * Calculate payment gateway fees on gross sales volume
 */
export function calculateProcessingFees(grossAmount: number, ordersCount: number): number {
  if (grossAmount <= 0 || ordersCount <= 0) return 0;
  const fees = (grossAmount * PROCESSING_FEE_RATE) + (ordersCount * PROCESSING_FEE_FIXED);
  return parseFloat(fees.toFixed(2));
}

/**
 * Create a new clearing batch from a day's sales
 */
export function createDailyPayoutBatch(
  day: number,
  grossAmount: number,
  ordersCount: number
): PayoutBatch {
  const processingFee = calculateProcessingFees(grossAmount, ordersCount);
  const rollingReserve = parseFloat((grossAmount * ROLLING_RESERVE_RATE).toFixed(2));
  const netPayout = parseFloat(Math.max(0, grossAmount - processingFee - rollingReserve).toFixed(2));

  return {
    id: `batch_d${day}_${Date.now().toString().slice(-6)}`,
    createdDay: day,
    settleDay: day + PAYOUT_SETTLEMENT_DAYS,
    grossAmount: parseFloat(grossAmount.toFixed(2)),
    processingFee,
    rollingReserve,
    netPayout,
    status: 'clearing',
  };
}

/**
 * Settle payouts that have matured (settleDay <= currentDay)
 */
export function processDailySettlement(
  currentDay: number,
  batches: PayoutBatch[]
): {
  updatedBatches: PayoutBatch[];
  settledAmountToday: number;
  releasedReservesToday: number;
} {
  let settledAmountToday = 0;
  let releasedReservesToday = 0;

  const updatedBatches = batches.map(batch => {
    // Settle clearing payout if maturity reached
    if (batch.status === 'clearing' && currentDay >= batch.settleDay) {
      settledAmountToday += batch.netPayout;
      return { ...batch, status: 'settled' as const };
    }
    return batch;
  });

  // Release rolling reserves that have passed the hold duration
  batches.forEach(batch => {
    if (batch.status === 'settled' && currentDay === (batch.createdDay + RESERVE_HOLD_DAYS)) {
      releasedReservesToday += batch.rollingReserve;
    }
  });

  return {
    updatedBatches,
    settledAmountToday: parseFloat(settledAmountToday.toFixed(2)),
    releasedReservesToday: parseFloat(releasedReservesToday.toFixed(2)),
  };
}

/**
 * Apply automatic remittance to an active Merchant Cash Advance (e.g., Stripe Capital)
 */
export function remitMerchantAdvance(
  settledInflow: number,
  advance: MerchantAdvance
): {
  remittanceAmount: number;
  updatedAdvance: MerchantAdvance;
} {
  if (!advance.active || advance.remainingBalance <= 0 || settledInflow <= 0) {
    return { remittanceAmount: 0, updatedAdvance: advance };
  }

  const plannedDeduction = settledInflow * (advance.remittancePercent / 100);
  const actualDeduction = Math.min(plannedDeduction, advance.remainingBalance);
  const remaining = Math.max(0, advance.remainingBalance - actualDeduction);

  return {
    remittanceAmount: parseFloat(actualDeduction.toFixed(2)),
    updatedAdvance: {
      ...advance,
      remainingBalance: parseFloat(remaining.toFixed(2)),
      active: remaining > 0,
    },
  };
}

/**
 * Generate full Income Statement (P&L) from simulation ledger
 */
export function generateIncomeStatement(ledger: CashLedgerEntry[]): IncomeStatement {
  const grossSales = ledger.reduce((acc, row) => acc + row.grossRevenue, 0);
  const processingFees = ledger.reduce((acc, row) => acc + row.processingFees, 0);
  const refunds = ledger.reduce((acc, row) => acc + row.refunds, 0);
  const cogs = ledger.reduce((acc, row) => acc + row.cogs, 0);
  const shipping = ledger.reduce((acc, row) => acc + row.shippingFees, 0);
  const adSpend = ledger.reduce((acc, row) => acc + row.adSpend, 0);

  const netSales = grossSales - refunds - processingFees;
  const grossProfit = netSales - cogs;
  const grossMarginPct = netSales > 0 ? (grossProfit / netSales) * 100 : 0;

  const totalOpex = shipping + adSpend;
  const netProfit = grossProfit - totalOpex;
  const netMarginPct = grossSales > 0 ? (netProfit / grossSales) * 100 : 0;

  return {
    grossSales: parseFloat(grossSales.toFixed(2)),
    processingFees: parseFloat(processingFees.toFixed(2)),
    refunds: parseFloat(refunds.toFixed(2)),
    netSales: parseFloat(netSales.toFixed(2)),
    cogs: parseFloat(cogs.toFixed(2)),
    grossProfit: parseFloat(grossProfit.toFixed(2)),
    grossMarginPct: parseFloat(grossMarginPct.toFixed(1)),
    operatingExpenses: {
      adSpend: parseFloat(adSpend.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      merchantAdvanceFees: 0,
      overhead: 0,
      total: parseFloat(totalOpex.toFixed(2)),
    },
    netProfit: parseFloat(netProfit.toFixed(2)),
    netMarginPct: parseFloat(netMarginPct.toFixed(1)),
  };
}

/**
 * Generate Cash Flow Statement from ledger entries
 */
export function generateCashFlowStatement(
  ledger: CashLedgerEntry[],
  initialCash: number
): CashFlowStatement {
  const operatingInflows = ledger.reduce((acc, row) => acc + row.cashInflow, 0);
  const operatingOutflows = ledger.reduce((acc, row) => acc + row.cashOutflow, 0);
  const netCashFlow = operatingInflows - operatingOutflows;
  const endingCash = initialCash + netCashFlow;

  return {
    operatingInflows: parseFloat(operatingInflows.toFixed(2)),
    operatingOutflows: parseFloat(operatingOutflows.toFixed(2)),
    financingCashFlow: 0,
    netCashFlow: parseFloat(netCashFlow.toFixed(2)),
    beginningCash: parseFloat(initialCash.toFixed(2)),
    endingCash: parseFloat(endingCash.toFixed(2)),
  };
}

/**
 * Generate Balance Sheet
 */
export function generateBalanceSheet(
  liquidCash: number,
  inTransitPayouts: number,
  processorReserves: number,
  inventoryUnits: number,
  costPerUnit: number,
  advanceBalance: number
): BalanceSheet {
  const inventoryValuation = inventoryUnits * costPerUnit;
  const totalAssets = liquidCash + inTransitPayouts + processorReserves + inventoryValuation;
  const totalLiabilities = advanceBalance;
  const totalEquity = totalAssets - totalLiabilities;

  return {
    assets: {
      liquidCash: parseFloat(liquidCash.toFixed(2)),
      inTransitPayouts: parseFloat(inTransitPayouts.toFixed(2)),
      processorReserves: parseFloat(processorReserves.toFixed(2)),
      inventoryValuation: parseFloat(inventoryValuation.toFixed(2)),
      totalAssets: parseFloat(totalAssets.toFixed(2)),
    },
    liabilities: {
      merchantAdvanceBalance: parseFloat(advanceBalance.toFixed(2)),
      unfulfilledOrdersObligation: 0,
      totalLiabilities: parseFloat(totalLiabilities.toFixed(2)),
    },
    equity: {
      retainedEarnings: parseFloat(totalEquity.toFixed(2)),
      totalEquity: parseFloat(totalEquity.toFixed(2)),
    },
  };
}

/**
 * Format Cash Ledger into CSV for Excel/Google Sheets export
 */
export function exportLedgerToCsv(ledger: CashLedgerEntry[]): string {
  const headers = [
    'Day',
    'Gross Revenue ($)',
    'Processing Fees ($)',
    'COGS ($)',
    'Shipping ($)',
    'Ad Spend ($)',
    'Refunds ($)',
    'Net Accounting Profit ($)',
    'Settled Inflow ($)',
    'Cash Outflow ($)',
    'Cash in Bank ($)',
    'In-Transit Payouts ($)',
    'Rolling Reserve ($)',
    'Inventory Value ($)',
    'Orders Completed'
  ];

  const rows = ledger.map(r => [
    r.day,
    r.grossRevenue.toFixed(2),
    r.processingFees.toFixed(2),
    r.cogs.toFixed(2),
    r.shippingFees.toFixed(2),
    r.adSpend.toFixed(2),
    r.refunds.toFixed(2),
    r.netAccountingProfit.toFixed(2),
    r.cashInflow.toFixed(2),
    r.cashOutflow.toFixed(2),
    r.cashBalance.toFixed(2),
    r.inTransitPayouts.toFixed(2),
    r.rollingReserve.toFixed(2),
    r.inventoryValuation.toFixed(2),
    r.orders
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
