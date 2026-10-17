'use client';

import React, { useState } from 'react';
import { 
  CashLedgerEntry, 
  PayoutBatch, 
  MerchantAdvance,
  IncomeStatement,
  CashFlowStatement,
  BalanceSheet 
} from '@/types';
import { 
  generateIncomeStatement, 
  generateCashFlowStatement, 
  generateBalanceSheet,
  exportLedgerToCsv 
} from '@/services/financialEngine';
import { 
  FiX, 
  FiDownload, 
  FiDollarSign, 
  FiClock, 
  FiPieChart, 
  FiFileText, 
  FiAlertTriangle,
  FiCheckCircle,
  FiTrendingUp,
  FiArrowUpRight,
  FiArrowDownRight
} from 'react-icons/fi';

interface FinancialStatementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ledger: CashLedgerEntry[];
  payoutBatches: PayoutBatch[];
  liquidCash: number;
  initialCash: number;
  merchantAdvance: MerchantAdvance;
  onRequestAdvance: (amount: number) => void;
  inventoryUnits: number;
}

export default function FinancialStatementsModal({
  isOpen,
  onClose,
  ledger,
  payoutBatches,
  liquidCash,
  initialCash,
  merchantAdvance,
  onRequestAdvance,
  inventoryUnits,
}: FinancialStatementsModalProps) {
  const [activeTab, setActiveTab] = useState<'pnl' | 'cashflow' | 'balancesheet' | 'payouts'>('pnl');

  if (!isOpen) return null;

  const costPerUnit = 16.0;
  const inTransitPayouts = payoutBatches
    .filter(b => b.status === 'clearing')
    .reduce((acc, b) => acc + b.netPayout, 0);

  const rollingReserve = payoutBatches
    .reduce((acc, b) => acc + b.rollingReserve, 0);

  const incomeStatement: IncomeStatement = generateIncomeStatement(ledger);
  const cashFlow: CashFlowStatement = generateCashFlowStatement(ledger, initialCash);
  const balanceSheet: BalanceSheet = generateBalanceSheet(
    liquidCash,
    inTransitPayouts,
    rollingReserve,
    inventoryUnits,
    costPerUnit,
    merchantAdvance.remainingBalance
  );

  const handleDownloadCsv = () => {
    const csvContent = exportLedgerToCsv(ledger);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `simbusiness-financial-ledger-d${ledger.length}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl">
              <FiFileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Financial Statements & Cash Ledger</h2>
              <p className="text-xs text-zinc-500">GAAP-aligned 3-statement modeling, working capital, and payout clearing</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition shadow-sm"
              title="Download full daily ledger in CSV format for Excel"
            >
              <FiDownload className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-6 bg-white dark:bg-[#121214] gap-2">
          <button
            onClick={() => setActiveTab('pnl')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'pnl'
                ? 'border-black dark:border-white text-zinc-900 dark:text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <FiPieChart className="w-3.5 h-3.5" />
            Income Statement (P&L)
          </button>
          <button
            onClick={() => setActiveTab('cashflow')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'cashflow'
                ? 'border-black text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <FiDollarSign className="w-3.5 h-3.5" />
            Cash Flow Statement
          </button>
          <button
            onClick={() => setActiveTab('balancesheet')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'balancesheet'
                ? 'border-black text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <FiTrendingUp className="w-3.5 h-3.5" />
            Balance Sheet & Equity
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`py-3 px-3 text-xs font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'payouts'
                ? 'border-black text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <FiClock className="w-3.5 h-3.5" />
            Payout Clearing Pipeline ({payoutBatches.filter(b => b.status === 'clearing').length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: INCOME STATEMENT */}
          {activeTab === 'pnl' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div className="text-xs text-zinc-500 font-medium">Gross Revenue</div>
                  <div className="text-xl font-bold text-zinc-900 mt-1">${incomeStatement.grossSales.toFixed(2)}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Top-line customer billing</div>
                </div>
                <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div className="text-xs text-zinc-500 font-medium">Gross Margin</div>
                  <div className="text-xl font-bold text-zinc-900 mt-1">{incomeStatement.grossMarginPct}%</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">${incomeStatement.grossProfit.toFixed(2)} gross profit</div>
                </div>
                <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div className="text-xs text-zinc-500 font-medium">Net Margin</div>
                  <div className={`text-xl font-bold mt-1 ${incomeStatement.netProfit >= 0 ? 'text-zinc-900' : 'text-rose-600'}`}>
                    {incomeStatement.netMarginPct}%
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">${incomeStatement.netProfit.toFixed(2)} net profit</div>
                </div>
              </div>

              {/* P&L Breakdown Table */}
              <div className="border border-zinc-200 rounded-xl overflow-hidden text-xs">
                <div className="bg-zinc-50 px-4 py-2.5 font-semibold text-zinc-700 border-b border-zinc-200 uppercase tracking-wider text-[10px]">
                  Accounting Period Breakdown
                </div>
                <div className="divide-y divide-zinc-100">
                  <div className="flex justify-between px-4 py-2.5 font-medium text-zinc-900">
                    <span>Gross Sales Volume</span>
                    <span>${incomeStatement.grossSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2 text-zinc-600 pl-8">
                    <span>Less: Merchant Gateway Fees (Stripe 2.9% + 30¢)</span>
                    <span className="text-zinc-500">-${incomeStatement.processingFees.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2 text-zinc-600 pl-8">
                    <span>Less: Customer Returns & Disputes</span>
                    <span className="text-zinc-500">-${incomeStatement.refunds.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2.5 font-semibold text-zinc-900 bg-zinc-50/50">
                    <span>Net Sales</span>
                    <span>${incomeStatement.netSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2 text-zinc-600 pl-8">
                    <span>Less: Cost of Goods Sold (COGS Landed)</span>
                    <span className="text-zinc-500">-${incomeStatement.cogs.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2.5 font-semibold text-zinc-900 bg-zinc-50/50">
                    <span>Gross Profit</span>
                    <span>${incomeStatement.grossProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2 text-zinc-600 pl-8">
                    <span>Operating Expenses: Ad Spend (Meta / TikTok / Google)</span>
                    <span className="text-zinc-500">-${incomeStatement.operatingExpenses.adSpend.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2 text-zinc-600 pl-8">
                    <span>Operating Expenses: Carrier Freight & Shipping</span>
                    <span className="text-zinc-500">-${incomeStatement.operatingExpenses.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-3 font-bold text-sm bg-zinc-900 text-white">
                    <span>Net Operating Profit</span>
                    <span>${incomeStatement.netProfit.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CASH FLOW STATEMENT */}
          {activeTab === 'cashflow' && (
            <div className="space-y-4">
              {/* Working Capital Reality Alert */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex items-start gap-3">
                <FiAlertTriangle className="w-5 h-5 text-zinc-800 shrink-0 mt-0.5" />
                <div className="text-xs text-zinc-600 leading-relaxed">
                  <strong className="text-zinc-900 font-semibold block mb-0.5">The Working Capital Friction Rule:</strong>
                  In real e-commerce, customer card transactions take <strong>2 business days (T+2)</strong> to settle into liquid cash, and payment gateways hold a <strong>10% rolling reserve</strong>. You may be profitable on paper, but if your liquid cash runs to $0 before payouts clear, you cannot fund new inventory restocks or ads.
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div className="text-xs text-zinc-500 font-medium">Beginning Cash</div>
                  <div className="text-xl font-bold text-zinc-900 mt-1">${cashFlow.beginningCash.toFixed(2)}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Seed capital balance</div>
                </div>
                <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div className="text-xs text-zinc-500 font-medium">Net Cash Flow</div>
                  <div className={`text-xl font-bold mt-1 ${cashFlow.netCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    ${cashFlow.netCashFlow.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Operating delta</div>
                </div>
                <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div className="text-xs text-zinc-500 font-medium">Liquid Cash in Bank</div>
                  <div className={`text-xl font-bold mt-1 ${liquidCash < 100 ? 'text-amber-700' : 'text-zinc-900'}`}>
                    ${liquidCash.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Spendable funds today</div>
                </div>
              </div>

              <div className="border border-zinc-200 rounded-xl overflow-hidden text-xs">
                <div className="bg-zinc-50 px-4 py-2.5 font-semibold text-zinc-700 border-b border-zinc-200 uppercase tracking-wider text-[10px]">
                  Cash Flow Statement (Direct Method)
                </div>
                <div className="divide-y divide-zinc-100">
                  <div className="flex justify-between px-4 py-2.5 font-semibold text-zinc-900 bg-zinc-50/40">
                    <span className="flex items-center gap-1.5"><FiArrowUpRight className="text-emerald-600" /> Cash Inflows (Operating)</span>
                    <span className="text-emerald-700">+${cashFlow.operatingInflows.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2 text-zinc-600 pl-8">
                    <span>Settled Payouts Collected (Released from Stripe)</span>
                    <span>+${cashFlow.operatingInflows.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2.5 font-semibold text-zinc-900 bg-zinc-50/40">
                    <span className="flex items-center gap-1.5"><FiArrowDownRight className="text-rose-600" /> Cash Outflows (Operating)</span>
                    <span className="text-rose-700">-${cashFlow.operatingOutflows.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2 text-zinc-600 pl-8">
                    <span>Inventory Restock Cash Payments</span>
                    <span>-${(ledger.reduce((acc, r) => acc + (r.orders * 16.0), 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2 text-zinc-600 pl-8">
                    <span>Paid Marketing Disbursements</span>
                    <span>-${incomeStatement.operatingExpenses.adSpend.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2 text-zinc-600 pl-8">
                    <span>Carrier Outbound Freight</span>
                    <span>-${incomeStatement.operatingExpenses.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-3 font-bold text-sm bg-zinc-900 text-white">
                    <span>Ending Spendable Bank Balance</span>
                    <span>${liquidCash.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BALANCE SHEET */}
          {activeTab === 'balancesheet' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Assets */}
                <div className="border border-zinc-200 rounded-xl overflow-hidden text-xs">
                  <div className="bg-zinc-50 px-4 py-2.5 font-semibold text-zinc-800 border-b border-zinc-200 uppercase tracking-wider text-[10px]">
                    Current Assets
                  </div>
                  <div className="divide-y divide-zinc-100 p-1">
                    <div className="flex justify-between px-3 py-2 text-zinc-700">
                      <span>Liquid Cash (Bank Balance)</span>
                      <span className="font-semibold text-zinc-900">${balanceSheet.assets.liquidCash.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between px-3 py-2 text-zinc-700">
                      <span>In-Transit Payouts (T+2 Clearing)</span>
                      <span className="font-semibold text-zinc-900">${balanceSheet.assets.inTransitPayouts.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between px-3 py-2 text-zinc-700">
                      <span>Gateway Rolling Reserves (10% Held)</span>
                      <span className="font-semibold text-zinc-900">${balanceSheet.assets.processorReserves.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between px-3 py-2 text-zinc-700">
                      <span>Inventory on Hand ({inventoryUnits} units @ $16 cost)</span>
                      <span className="font-semibold text-zinc-900">${balanceSheet.assets.inventoryValuation.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between px-3 py-2.5 font-bold text-zinc-900 bg-zinc-50 rounded-lg">
                      <span>Total Current Assets</span>
                      <span>${balanceSheet.assets.totalAssets.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Liabilities & Equity */}
                <div className="space-y-4">
                  <div className="border border-zinc-200 rounded-xl overflow-hidden text-xs">
                    <div className="bg-zinc-50 px-4 py-2.5 font-semibold text-zinc-800 border-b border-zinc-200 uppercase tracking-wider text-[10px]">
                      Liabilities
                    </div>
                    <div className="divide-y divide-zinc-100 p-1">
                      <div className="flex justify-between px-3 py-2 text-zinc-700">
                        <span>Merchant Advance Balance (Stripe Capital)</span>
                        <span className="font-semibold text-zinc-900">${balanceSheet.liabilities.merchantAdvanceBalance.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between px-3 py-2 text-zinc-700">
                        <span>Accounts Payable & Pending Fulfillment</span>
                        <span className="font-semibold text-zinc-900">$0.00</span>
                      </div>
                      <div className="flex justify-between px-3 py-2.5 font-bold text-zinc-900 bg-zinc-50 rounded-lg">
                        <span>Total Liabilities</span>
                        <span>${balanceSheet.liabilities.totalLiabilities.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-zinc-200 rounded-xl overflow-hidden text-xs">
                    <div className="bg-zinc-50 px-4 py-2.5 font-semibold text-zinc-800 border-b border-zinc-200 uppercase tracking-wider text-[10px]">
                      Shareholder Equity
                    </div>
                    <div className="divide-y divide-zinc-100 p-1">
                      <div className="flex justify-between px-3 py-2 text-zinc-700">
                        <span>Retained Earnings & Working Capital</span>
                        <span className="font-semibold text-zinc-900">${balanceSheet.equity.retainedEarnings.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between px-3 py-2.5 font-bold text-zinc-900 bg-zinc-50 rounded-lg">
                        <span>Total Store Equity</span>
                        <span>${balanceSheet.equity.totalEquity.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PAYOUT CLEARING PIPELINE */}
          {activeTab === 'payouts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-zinc-900">Payment Processor Clearing Schedule (T+2 Settlement)</h3>
                  <p className="text-[11px] text-zinc-500">Track daily gross batches, 2.9% fee deductions, and 10% rolling reserve escrow</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-500">Unsettled In-Transit:</div>
                  <div className="text-sm font-bold text-zinc-900">${inTransitPayouts.toFixed(2)}</div>
                </div>
              </div>

              {payoutBatches.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-zinc-200 rounded-xl text-zinc-400 text-xs">
                  No sales batches have been queued yet. Run simulation days to process customer transactions.
                </div>
              ) : (
                <div className="border border-zinc-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-zinc-50 text-zinc-600 uppercase text-[10px] tracking-wider border-b border-zinc-200">
                      <tr>
                        <th className="px-3.5 py-2.5">Batch ID</th>
                        <th className="px-3.5 py-2.5">Created</th>
                        <th className="px-3.5 py-2.5">Clearing Date</th>
                        <th className="px-3.5 py-2.5 text-right">Gross Sales</th>
                        <th className="px-3.5 py-2.5 text-right">Fee (2.9%+30¢)</th>
                        <th className="px-3.5 py-2.5 text-right">10% Reserve</th>
                        <th className="px-3.5 py-2.5 text-right font-semibold">Net Payout</th>
                        <th className="px-3.5 py-2.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {payoutBatches.slice(-8).reverse().map(b => (
                        <tr key={b.id} className="hover:bg-zinc-50/50">
                          <td className="px-3.5 py-2 font-mono text-[11px] text-zinc-500">{b.id}</td>
                          <td className="px-3.5 py-2 text-zinc-600">Day {b.createdDay}</td>
                          <td className="px-3.5 py-2 text-zinc-600">Day {b.settleDay}</td>
                          <td className="px-3.5 py-2 text-right font-medium text-zinc-900">${b.grossAmount.toFixed(2)}</td>
                          <td className="px-3.5 py-2 text-right text-zinc-500">-${b.processingFee.toFixed(2)}</td>
                          <td className="px-3.5 py-2 text-right text-zinc-500">-${b.rollingReserve.toFixed(2)}</td>
                          <td className="px-3.5 py-2 text-right font-semibold text-zinc-900">${b.netPayout.toFixed(2)}</td>
                          <td className="px-3.5 py-2 text-center">
                            {b.status === 'settled' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <FiCheckCircle className="w-3 h-3" /> Settled
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                <FiClock className="w-3 h-3" /> Clearing (T+2)
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Merchant Cash Advance Bridge Section */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-900">Working Capital Bridge (Stripe Capital Simulator)</h4>
                    <p className="text-[11px] text-zinc-500">
                      Low on cash while waiting for payouts? Borrow $500 working capital with an 8% flat fee ($540 total repayable), repaid automatically via 10% deduction on future daily payouts.
                    </p>
                  </div>
                  {merchantAdvance.active ? (
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 bg-zinc-900 text-white text-[10px] font-semibold rounded">
                        Active Advance
                      </span>
                      <div className="text-[11px] text-zinc-500 mt-0.5">Remaining: ${merchantAdvance.remainingBalance.toFixed(2)}</div>
                    </div>
                  ) : (
                    <button
                      onClick={() => onRequestAdvance(500)}
                      className="px-3.5 py-1.5 bg-black hover:bg-zinc-800 text-white text-xs font-medium rounded-lg transition shadow-sm"
                    >
                      Draw $500 Advance
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 bg-zinc-50/50">
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-zinc-500">Liquid Cash: </span>
              <strong className="text-zinc-900 font-semibold">${liquidCash.toFixed(2)}</strong>
            </div>
            <div>
              <span className="text-zinc-500">In-Transit Payouts: </span>
              <strong className="text-zinc-900 font-semibold">${inTransitPayouts.toFixed(2)}</strong>
            </div>
            <div>
              <span className="text-zinc-500">Rolling Reserves: </span>
              <strong className="text-zinc-900 font-semibold">${rollingReserve.toFixed(2)}</strong>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
