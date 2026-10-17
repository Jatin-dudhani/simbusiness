'use client';

import React, { useState } from 'react';
import { MonteCarloInputs, MonteCarloSummary } from '@/types';
import { DEFAULT_MONTE_CARLO_INPUTS, runMonteCarloSimulation } from '@/services/monteCarloEngine';
import { Line } from 'react-chartjs-2';
import { 
  FiX, 
  FiTrendingUp, 
  FiShield, 
  FiAlertTriangle, 
  FiRefreshCw, 
  FiCheckCircle, 
  FiCpu,
  FiHelpCircle
} from 'react-icons/fi';

interface MonteCarloModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MonteCarloModal({ isOpen, onClose }: MonteCarloModalProps) {
  const [inputs, setInputs] = useState<MonteCarloInputs>(DEFAULT_MONTE_CARLO_INPUTS);
  const [summary, setSummary] = useState<MonteCarloSummary>(() => runMonteCarloSimulation(DEFAULT_MONTE_CARLO_INPUTS));
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isOpen) return null;

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const res = runMonteCarloSimulation(inputs);
      setSummary(res);
      setIsSimulating(false);
    }, 150);
  };

  const chartLabels = summary.cashTrajectories.map(t => `D${t.day}`);
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Bull Case (90th Percentile)',
        data: summary.cashTrajectories.map(t => t.p90),
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.2,
      },
      {
        label: 'Median Path (50th Percentile)',
        data: summary.cashTrajectories.map(t => t.p50),
        borderColor: '#09090b',
        backgroundColor: 'rgba(9, 9, 11, 0.05)',
        fill: true,
        borderWidth: 2.5,
        tension: 0.2,
      },
      {
        label: 'Bear Case (10th Percentile)',
        data: summary.cashTrajectories.map(t => t.p10),
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        borderDash: [4, 4],
        borderWidth: 1.5,
        tension: 0.2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { boxWidth: 12, font: { size: 11 }, color: '#52525b' },
      },
      tooltip: {
        backgroundColor: '#09090b',
        titleFont: { size: 11 },
        bodyFont: { size: 11 },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#71717a' } },
      y: { grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { font: { size: 10 }, color: '#71717a' } },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl">
              <FiTrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Founder Monte Carlo Simulator</h2>
              <p className="text-xs text-zinc-500">Run 500 stochastic trials using your real unit economics to forecast runway and solvency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Probability KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Profit Probability</span>
                <FiCheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-zinc-900 mt-1">{summary.profitProbabilityPct}%</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Across {summary.runsCompleted} trajectories</div>
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Insolvency Risk</span>
                <FiAlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <div className={`text-2xl font-bold mt-1 ${summary.insolvencyRiskPct > 20 ? 'text-rose-600' : 'text-zinc-900'}`}>
                {summary.insolvencyRiskPct}%
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Probability of hitting $0</div>
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Breakeven ROAS</span>
                <FiShield className="w-4 h-4 text-zinc-600" />
              </div>
              <div className="text-2xl font-bold text-zinc-900 mt-1">{summary.breakevenRoas}x</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Min required to profit</div>
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Safe Runway Buffer</span>
                <FiTrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-zinc-900 mt-1">${summary.recommendedMinimumRunway}</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Recommended initial capital</div>
            </div>
          </div>

          {/* Interactive Trajectory Chart */}
          <div className="border border-zinc-200 rounded-xl p-5 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                  Forecasted Cash Trajectory (Percentile Fan)
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Visualizing median path vs 10th percentile worst-case drawdown over {inputs.simulationDays} days
                </p>
              </div>
            </div>
            <div className="h-64 w-full">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Input Controls Grid */}
          <div className="border border-zinc-200 rounded-xl p-5 bg-zinc-50/50 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              Your Product Unit Economics Parameters
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-zinc-600 font-medium block mb-1">Retail Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={inputs.retailPrice}
                  onChange={(e) => setInputs({ ...inputs, retailPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 font-mono text-xs focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-medium block mb-1">Landed Product Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={inputs.landedCost}
                  onChange={(e) => setInputs({ ...inputs, landedCost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 font-mono text-xs focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-medium block mb-1">Outbound Shipping ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={inputs.shippingCost}
                  onChange={(e) => setInputs({ ...inputs, shippingCost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 font-mono text-xs focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-medium block mb-1">Daily Ad Budget ($)</label>
                <input
                  type="number"
                  step="5"
                  value={inputs.dailyAdBudget}
                  onChange={(e) => setInputs({ ...inputs, dailyAdBudget: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 font-mono text-xs focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-medium block mb-1">Expected Ad CPM ($)</label>
                <input
                  type="number"
                  step="1"
                  value={inputs.baseCpm}
                  onChange={(e) => setInputs({ ...inputs, baseCpm: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 font-mono text-xs focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-medium block mb-1">Expected CTR (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.expectedCtrPct}
                  onChange={(e) => setInputs({ ...inputs, expectedCtrPct: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 font-mono text-xs focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-medium block mb-1">Expected Store CVR (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.expectedCvrPct}
                  onChange={(e) => setInputs({ ...inputs, expectedCvrPct: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 font-mono text-xs focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-zinc-600 font-medium block mb-1">Starting Bank Runway ($)</label>
                <input
                  type="number"
                  step="100"
                  value={inputs.initialRunway}
                  onChange={(e) => setInputs({ ...inputs, initialRunway: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 font-mono text-xs focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="btn btn-primary text-xs flex items-center gap-1.5"
              >
                <FiRefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                <span>Rerun 500 Stochastic Iterations</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 bg-zinc-50/50 text-xs">
          <span className="text-zinc-500">
            Median Ending Cash: <strong className="text-zinc-900">${summary.medianFinalCash.toFixed(2)}</strong> (Worst: ${summary.worstCaseFinalCash.toFixed(2)}, Best: ${summary.bestCaseFinalCash.toFixed(2)})
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
}
