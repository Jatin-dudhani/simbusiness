'use client';

import { useState, useEffect } from 'react';
import { BusinessStats } from '@/types';
import { FiDollarSign, FiShoppingCart, FiTrendingUp, FiPackage, FiTarget, FiPlay, FiPlus, FiRefreshCw } from 'react-icons/fi';
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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [businessStats, setBusinessStats] = useState<BusinessStats>({
    revenue: 0,
    expenses: 0,
    profit: 0,
    orders: 0,
    inventory: 15,
    marketing: 0
  });
  const [simulationHistory, setSimulationHistory] = useState<{ profit: number[] }>({ profit: [] });
  const [day, setDay] = useState(0);

  // Simulate business operations
  const simulateDay = () => {
    setDay(prevDay => prevDay + 1);
    // Generate random sales and expenses
    const marketingEffect = 1 + (businessStats.marketing / 500); // Basic marketing impact
    const newOrders = Math.max(0, Math.floor(Math.random() * 5 * marketingEffect) - Math.floor(Math.random() * 2));
    const availableInventory = businessStats.inventory;
    const actualOrders = Math.min(newOrders, availableInventory);

    const newRevenue = actualOrders * (Math.random() * 50 + 20); // Price per item
    const costOfGoods = actualOrders * (Math.random() * 15 + 10); // Cost per item
    const marketingSpend = businessStats.marketing * 0.05; // Daily marketing spend fraction
    const newExpenses = costOfGoods + marketingSpend;
    const newProfit = newRevenue - newExpenses;
    
    setBusinessStats(prev => ({
      revenue: prev.revenue + newRevenue,
      expenses: prev.expenses + newExpenses,
      profit: prev.profit + newProfit,
      orders: prev.orders + actualOrders,
      inventory: prev.inventory - actualOrders,
      marketing: prev.marketing - marketingSpend // Decrease marketing budget slowly
    }));

    setSimulationHistory(prev => ({
      profit: [...prev.profit, businessStats.profit + newProfit]
    }));
  };

  const increaseMarketing = () => {
    setBusinessStats(prev => ({
      ...prev,
      marketing: prev.marketing + 100,
      expenses: prev.expenses + 100 // Add marketing cost immediately
    }));
  };

  const restockInventory = () => {
    const restockAmount = 20;
    const restockCost = restockAmount * 15; // Average cost per item
    setBusinessStats(prev => ({
      ...prev,
      inventory: prev.inventory + restockAmount,
      expenses: prev.expenses + restockCost
    }));
  };

  const chartData = {
    labels: Array.from({ length: simulationHistory.profit.length }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Profit Over Time',
        data: simulationHistory.profit,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Business Profit Simulation',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Business Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Revenue" value={`$${businessStats.revenue.toFixed(2)}`} icon={<FiDollarSign className="text-green-500" />} />
          <StatCard title="Total Expenses" value={`$${businessStats.expenses.toFixed(2)}`} icon={<FiDollarSign className="text-red-500" />} />
          <StatCard title="Total Profit" value={`$${businessStats.profit.toFixed(2)}`} icon={<FiTrendingUp className="text-blue-500" />} />
          <StatCard title="Orders Fulfilled" value={businessStats.orders.toString()} icon={<FiShoppingCart className="text-purple-500" />} />
        </div>

        {/* Actions Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-white">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FiPackage /> Inventory Management</h2>
            <p className="mb-4 text-gray-600">Current Stock: <span className="font-bold text-lg">{businessStats.inventory}</span> units</p>
            <button 
              onClick={restockInventory}
              className="btn btn-secondary w-full flex items-center justify-center gap-2"
              disabled={businessStats.inventory > 50} // Example disable condition
            >
              <FiRefreshCw /> Restock (20 units)
            </button>
          </div>

          <div className="card bg-white">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FiTarget /> Marketing</h2>
            <p className="mb-4 text-gray-600">Current Budget: <span className="font-bold text-lg">${businessStats.marketing.toFixed(2)}</span></p>
            <button 
              onClick={increaseMarketing}
              className="btn btn-secondary w-full flex items-center justify-center gap-2"
            >
              <FiPlus /> Increase Budget ($100)
            </button>
          </div>

          <div className="card bg-white">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FiPlay /> Simulation Control</h2>
            <p className="mb-4 text-gray-600">Current Day: <span className="font-bold text-lg">{day}</span></p>
            <button 
              onClick={simulateDay}
              className="btn btn-accent w-full flex items-center justify-center gap-2"
              disabled={businessStats.inventory <= 0} // Disable if no inventory
            >
              <FiPlay /> Simulate Next Day
            </button>
          </div>
        </div>

        {/* Profit Chart */}
        {simulationHistory.profit.length > 0 && (
          <div className="card bg-white mb-8">
            <h2 className="text-xl font-semibold mb-4">Profit Trend</h2>
            <Line options={chartOptions} data={chartData} />
          </div>
        )}

        {/* Placeholder for Recent Activity - Can be implemented later */}
        {/* ... */}
      </main>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="card bg-white p-5 flex items-center gap-4">
      <div className="text-3xl p-3 bg-gray-100 rounded-lg">{icon}</div>
      <div>
        <h3 className="text-gray-500 text-sm uppercase tracking-wide">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
} 