import { MonteCarloInputs, MonteCarloSummary, MonteCarloTrajectory } from '@/types';

/**
 * Standard Default Parameters for E-Commerce Product Launch
 */
export const DEFAULT_MONTE_CARLO_INPUTS: MonteCarloInputs = {
  initialRunway: 1500,
  retailPrice: 49.99,
  landedCost: 16.50,
  shippingCost: 4.99,
  dailyAdBudget: 60,
  baseCpm: 24.0,
  expectedCtrPct: 1.8,
  expectedCvrPct: 2.6,
  returnRatePct: 6.5,
  simulationDays: 60,
  runsCount: 500, // 500 stochastic trials for rapid, responsive browser execution
};

/**
 * Run Monte Carlo Simulation across N independent market trajectories
 */
export function runMonteCarloSimulation(inputs: MonteCarloInputs): MonteCarloSummary {
  const {
    initialRunway,
    retailPrice,
    landedCost,
    shippingCost,
    dailyAdBudget,
    baseCpm,
    expectedCtrPct,
    expectedCvrPct,
    returnRatePct,
    simulationDays,
    runsCount,
  } = inputs;

  const grossUnitMargin = retailPrice - landedCost - shippingCost;
  const breakevenRoas = grossUnitMargin > 0 ? parseFloat((retailPrice / grossUnitMargin).toFixed(2)) : 999;
  const breakevenCvrPct = parseFloat(((dailyAdBudget / (dailyAdBudget / (baseCpm / 1000) * (expectedCtrPct / 100) * grossUnitMargin)) * 100).toFixed(2));

  // Trajectories matrix: [runIndex][dayIndex] -> cash balance
  const cashRuns: number[][] = [];
  const profitRuns: number[][] = [];

  let profitableRuns = 0;
  let insolventRuns = 0;

  for (let r = 0; r < runsCount; r++) {
    let currentCash = initialRunway;
    let cumulativeProfit = 0;
    const runCashTrajectory: number[] = [currentCash];
    const runProfitTrajectory: number[] = [0];

    let hasInsolvent = false;

    // Simulate day by day
    for (let d = 1; d <= simulationDays; d++) {
      // Stochastic variance in daily CPM, CTR, and CVR
      const cpmNoise = 1 + (Math.random() - 0.5) * 0.25; // +/- 12.5%
      const ctrNoise = 1 + (Math.random() - 0.5) * 0.30; // +/- 15%
      const cvrNoise = 1 + (Math.random() - 0.5) * 0.35; // +/- 17.5%

      const effectiveCpm = Math.max(8, baseCpm * cpmNoise);
      const effectiveCtr = Math.max(0.5, expectedCtrPct * ctrNoise);
      const effectiveCvr = Math.max(0.4, expectedCvrPct * cvrNoise);

      const impressions = (dailyAdBudget / effectiveCpm) * 1000;
      const clicks = impressions * (effectiveCtr / 100);
      const orders = Math.round(clicks * (effectiveCvr / 100));

      const grossSales = orders * retailPrice;
      const gatewayFees = (grossSales * 0.029) + (orders * 0.30);
      const returnsCost = grossSales * (returnRatePct / 100) * 0.5;
      const cogs = orders * landedCost;
      const shipping = orders * shippingCost;

      const dailyExpenses = dailyAdBudget + cogs + shipping + gatewayFees + returnsCost;
      const dailyProfit = grossSales - dailyExpenses;

      cumulativeProfit += dailyProfit;
      currentCash += dailyProfit; // Net change in cash

      if (currentCash <= 0) {
        hasInsolvent = true;
      }

      runCashTrajectory.push(parseFloat(currentCash.toFixed(2)));
      runProfitTrajectory.push(parseFloat(cumulativeProfit.toFixed(2)));
    }

    if (cumulativeProfit > 0) profitableRuns++;
    if (hasInsolvent) insolventRuns++;

    cashRuns.push(runCashTrajectory);
    profitRuns.push(runProfitTrajectory);
  }

  // Calculate percentiles day by day
  const cashTrajectories: MonteCarloTrajectory[] = [];
  const profitTrajectories: MonteCarloTrajectory[] = [];

  for (let d = 0; d <= simulationDays; d++) {
    const dayCashValues = cashRuns.map(run => run[d]).sort((a, b) => a - b);
    const dayProfitValues = profitRuns.map(run => run[d]).sort((a, b) => a - b);

    const p10Idx = Math.floor(runsCount * 0.10);
    const p50Idx = Math.floor(runsCount * 0.50);
    const p90Idx = Math.floor(runsCount * 0.90);

    cashTrajectories.push({
      day: d,
      p10: parseFloat(dayCashValues[p10Idx].toFixed(2)),
      p50: parseFloat(dayCashValues[p50Idx].toFixed(2)),
      p90: parseFloat(dayCashValues[p90Idx].toFixed(2)),
    });

    profitTrajectories.push({
      day: d,
      p10: parseFloat(dayProfitValues[p10Idx].toFixed(2)),
      p50: parseFloat(dayProfitValues[p50Idx].toFixed(2)),
      p90: parseFloat(dayProfitValues[p90Idx].toFixed(2)),
    });
  }

  const finalCashValues = cashRuns.map(run => run[simulationDays]).sort((a, b) => a - b);
  const medianFinalCash = finalCashValues[Math.floor(runsCount * 0.5)];
  const worstCaseFinalCash = finalCashValues[0];
  const bestCaseFinalCash = finalCashValues[runsCount - 1];

  const profitProbabilityPct = parseFloat(((profitableRuns / runsCount) * 100).toFixed(1));
  const insolvencyRiskPct = parseFloat(((insolventRuns / runsCount) * 100).toFixed(1));

  // Recommended runway: Buffer needed to withstand bear case 10th percentile drawdown
  const maxDrawdown = Math.max(0, ...cashTrajectories.map(t => initialRunway - t.p10));
  const recommendedMinimumRunway = parseFloat((maxDrawdown * 1.25).toFixed(0));

  return {
    runsCompleted: runsCount,
    profitProbabilityPct,
    insolvencyRiskPct,
    medianFinalCash,
    bestCaseFinalCash,
    worstCaseFinalCash,
    medianRoas: parseFloat(((grossUnitMargin * (expectedCvrPct / 100) * 10) / (baseCpm / 100)).toFixed(2)) || 2.2,
    breakevenCvrPct,
    breakevenRoas,
    recommendedMinimumRunway: Math.max(recommendedMinimumRunway, dailyAdBudget * 14),
    cashTrajectories,
    profitTrajectories,
  };
}
