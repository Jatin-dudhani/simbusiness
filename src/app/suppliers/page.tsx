'use client';

import React, { useState } from 'react';
import { Supplier } from '@/types';
import { 
  FiGlobe, 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiStar, 
  FiClock, 
  FiDollarSign, 
  FiPackage, 
  FiAlertTriangle, 
  FiCheckCircle,
  FiX
} from 'react-icons/fi';
import { fetchSuppliers } from '@/services/api';
import Link from 'next/link';

const supplierRiskFactors = {
  high: [
    "Unpredictable shipment timelines (>35% variance against delivery estimates)",
    "Product photography does not match physical unboxed merchandise",
    "Slow vendor support latency (>48 hours to answer ticket)",
    "No pre-shipment Quality Assurance (QA) inspection protocol",
    "No refund or return policy for defective units"
  ],
  medium: [
    "Single shipping carrier dependence without redundant logistics routes",
    "Occasional inventory discrepancies between warehouse and API",
    "Seasonal price surges during peak manufacturing quarters",
    "Manual invoice processing rather than instant API webhooks"
  ],
  low: [
    "Real-time EDI / API inventory synchronization",
    "Consistent factory QA inspection before export clearance",
    "Pre-negotiated expedited air freight shipping rates",
    "Dedicated key account manager for fast issue resolution"
  ]
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { 
      id: 1, 
      name: 'Tech Innovations Logistics Ltd', 
      location: 'Shenzhen, CN', 
      category: 'Electronics',
      rating: 4.8,
      lead_time: '6-9 days',
      price_level: 'Low',
      min_order: 5
    },
    { 
      id: 2, 
      name: 'EcoHome Crafts Manufacturing', 
      location: 'Ho Chi Minh, VN', 
      category: 'Home & Garden',
      rating: 4.6,
      lead_time: '8-12 days',
      price_level: 'Low',
      min_order: 10
    },
    { 
      id: 3, 
      name: 'Nordic Apparel Partners', 
      location: 'Stockholm, SE', 
      category: 'Fashion',
      rating: 4.9,
      lead_time: '3-5 days',
      price_level: 'High',
      min_order: 5
    },
    { 
      id: 4, 
      name: 'Pacific Core Athletics', 
      location: 'California, US', 
      category: 'Sports',
      rating: 4.9,
      lead_time: '2-4 days',
      price_level: 'High',
      min_order: 3
    },
    { 
      id: 5, 
      name: 'Seoul Pure Skincare Co.', 
      location: 'Seoul, KR', 
      category: 'Beauty',
      rating: 4.7,
      lead_time: '5-8 days',
      price_level: 'Medium',
      min_order: 5
    },
    { 
      id: 6, 
      name: 'Direct Precision Components', 
      location: 'Frankfurt, DE', 
      category: 'Electronics',
      rating: 4.8,
      lead_time: '4-7 days',
      price_level: 'Medium',
      min_order: 15
    },
  ]);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(suppliers[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [riskFactorType, setRiskFactorType] = useState<'high' | 'medium' | 'low'>('medium');
  const [showAddModal, setShowAddModal] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // New supplier form state
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    location: '',
    category: 'Electronics',
    rating: 4.8,
    lead_time: '5-8 days',
    price_level: 'Medium',
    min_order: 10,
  });

  const categories = Array.from(new Set(suppliers.map(s => s.category)));
  const locations = Array.from(new Set(suppliers.map(s => s.location)));

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? s.category === filterCategory : true;
    const matchesLocation = filterLocation ? s.location === filterLocation : true;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name || !newSupplier.location) return;

    const created: Supplier = {
      id: Date.now(),
      name: newSupplier.name.trim(),
      location: newSupplier.location.trim(),
      category: newSupplier.category,
      rating: Number(newSupplier.rating),
      lead_time: newSupplier.lead_time,
      price_level: newSupplier.price_level,
      min_order: Number(newSupplier.min_order),
    };

    setSuppliers(prev => [created, ...prev]);
    setSelectedSupplier(created);
    setShowAddModal(false);
    showNotice(`Supplier "${created.name}" added to verified directory.`);
  };

  const handlePlaceWholesaleOrder = () => {
    setOrderModalOpen(false);
    showNotice(`Wholesale batch purchase order submitted to ${selectedSupplier?.name}. Lead time: ${selectedSupplier?.lead_time}.`);
  };

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-mono badge-mono-black">Supply Chain Management</span>
              <span className="text-xs text-zinc-500 font-mono">Wholesale Directory</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white mt-1">
              Supplier Directory & Risk Assessment
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Audit supplier performance, reliability metrics, minimum order quantities (MOQ), and delivery lead times.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary text-xs"
            >
              <FiPlus className="w-3.5 h-3.5 mr-1.5" /> Add Supplier Partner
            </button>
          </div>
        </div>

        {/* Notice Toast */}
        {notice && (
          <div className="mb-6 p-3.5 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-between text-xs font-medium animate-in fade-in">
            <span>{notice}</span>
            <span className="text-[10px] font-mono uppercase opacity-80">Directory Updated</span>
          </div>
        )}

        {/* Risk Assessment Box */}
        <div className="card mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 gap-3">
            <div className="flex items-center gap-2">
              <FiAlertTriangle className="w-4 h-4 text-black dark:text-white" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">
                Supplier Due Diligence & Risk Factors
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              {(['high', 'medium', 'low'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setRiskFactorType(level)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium uppercase font-mono transition-colors ${
                    riskFactorType === level
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {level} Risk
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              {supplierRiskFactors[riskFactorType].map((factor, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white mt-1.5 flex-shrink-0" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Suppliers Table (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Search & Filter Bar */}
            <div className="card p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-64">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>

                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
                  >
                    <option value="">All Locations</option>
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="card p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                    <tr className="text-left font-mono uppercase tracking-wider text-zinc-400">
                      <th className="py-3 px-4">Supplier Partner</th>
                      <th className="py-3 px-4">Origin Hub</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4">Lead Time</th>
                      <th className="py-3 px-4 text-right">Dossier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {filteredSuppliers.map((s) => {
                      const isSelected = selectedSupplier?.id === s.id;
                      return (
                        <tr
                          key={s.id}
                          onClick={() => setSelectedSupplier(s)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-zinc-100/70 dark:bg-zinc-800/60 font-semibold'
                              : 'hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40'
                          }`}
                        >
                          <td className="py-3.5 px-4 text-black dark:text-white font-medium">{s.name}</td>
                          <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400">{s.location}</td>
                          <td className="py-3.5 px-4">
                            <span className="badge-mono badge-mono-outline">{s.category}</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            <span className="flex items-center gap-1 font-bold">
                              <FiStar className="w-3 h-3 fill-current text-black dark:text-white" />
                              {s.rating}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-zinc-600 dark:text-zinc-400">{s.lead_time}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedSupplier(s)}
                              className="text-xs underline text-zinc-500 hover:text-black dark:hover:text-white"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Supplier Detail Panel (4 Cols) */}
          <div className="lg:col-span-4">
            {selectedSupplier ? (
              <div className="card sticky top-24 space-y-4">
                <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">Supplier Profile</span>
                  <h3 className="font-bold text-lg text-black dark:text-white mt-1">{selectedSupplier.name}</h3>
                  <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                    <FiGlobe className="w-3.5 h-3.5" /> {selectedSupplier.location} • {selectedSupplier.category}
                  </p>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-500">Quality Score:</span>
                    <span className="font-mono font-bold text-black dark:text-white">{selectedSupplier.rating} / 5.0</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-500">Transit Lead Time:</span>
                    <span className="font-mono text-black dark:text-white">{selectedSupplier.lead_time}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-500">Wholesale Price Tier:</span>
                    <span className="font-mono text-black dark:text-white">{selectedSupplier.price_level} Tier</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-500">Minimum Order Qty (MOQ):</span>
                    <span className="font-mono font-bold text-black dark:text-white">{selectedSupplier.min_order} units</span>
                  </div>
                </div>

                {/* Score bar */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-zinc-500">Fulfillment Reliability:</span>
                    <span className="font-bold text-black dark:text-white">{((selectedSupplier.rating / 5) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-black dark:bg-white h-1.5 rounded-full"
                      style={{ width: `${(selectedSupplier.rating / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <button
                    onClick={() => setOrderModalOpen(true)}
                    className="btn btn-primary w-full text-xs"
                  >
                    Place Wholesale Restock Order
                  </button>
                  <Link
                    href="/orders"
                    className="btn btn-outline w-full text-xs text-center"
                  >
                    View Assigned Orders
                  </Link>
                </div>
              </div>
            ) : (
              <div className="card p-8 text-center text-xs text-zinc-400">
                Select a supplier partner to inspect metrics.
              </div>
            )}
          </div>
        </div>

        {/* Modal: Place Wholesale Order */}
        {orderModalOpen && selectedSupplier && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="font-bold text-base text-black dark:text-white">Wholesale Purchase Order</h3>
                <button onClick={() => setOrderModalOpen(false)}>
                  <FiX className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs">
                <p className="text-zinc-600 dark:text-zinc-400">
                  Submit an automated wholesale replenishment request to <strong>{selectedSupplier.name}</strong>.
                </p>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
                  <div className="flex justify-between font-mono">
                    <span>Batch Quantity:</span>
                    <strong>{selectedSupplier.min_order * 2} Units</strong>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>Estimated Landed Cost:</span>
                    <strong>${(selectedSupplier.min_order * 2 * 18.5).toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>Estimated Transit:</span>
                    <span>{selectedSupplier.lead_time}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setOrderModalOpen(false)}
                  className="btn btn-outline text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePlaceWholesaleOrder}
                  className="btn btn-primary text-xs"
                >
                  Confirm & Route PO
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add New Supplier */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="font-bold text-base text-black dark:text-white">Add New Supplier Partner</h3>
                <button onClick={() => setShowAddModal(false)}>
                  <FiX className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              <form onSubmit={handleAddSupplier} className="py-4 space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Global Supply"
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Origin City/Country</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tokyo, JP"
                      value={newSupplier.location}
                      onChange={(e) => setNewSupplier({ ...newSupplier, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Category</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Electronics"
                      value={newSupplier.category}
                      onChange={(e) => setNewSupplier({ ...newSupplier, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Transit Lead Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 4-7 days"
                      value={newSupplier.lead_time}
                      onChange={(e) => setNewSupplier({ ...newSupplier, lead_time: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Min Order Qty (MOQ)</label>
                    <input
                      type="number"
                      min="1"
                      value={newSupplier.min_order}
                      onChange={(e) => setNewSupplier({ ...newSupplier, min_order: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn btn-outline text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary text-xs"
                  >
                    Save Supplier
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}