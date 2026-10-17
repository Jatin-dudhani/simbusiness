'use client';

import React, { useState, useEffect } from 'react';
import { Supplier } from '../services/SupplierService';
import { SupplierService } from '../services/SupplierService';
import { FiStar, FiTruck, FiChevronRight } from 'react-icons/fi';

interface SupplierListProps {
  onSelectSupplier?: (supplier: Supplier) => void;
}

const SupplierList: React.FC<SupplierListProps> = ({ onSelectSupplier }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const data = await SupplierService.getSuppliers();
        setSuppliers(data);
        setError(null);
      } catch (err) {
        setError('Failed to load suppliers.');
        console.error('Error fetching suppliers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const handleSupplierClick = (supplier: Supplier) => {
    setSelectedSupplierId(supplier.id);
    if (onSelectSupplier) {
      onSelectSupplier(supplier);
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-xs text-zinc-500 font-mono">Loading suppliers...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-xs text-zinc-500 font-mono">{error}</div>;
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
          Verified Supplier Directory
        </h2>
      </div>
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {suppliers.map((supplier) => (
          <li
            key={supplier.id}
            className={`p-3.5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors ${
              selectedSupplierId === supplier.id ? 'bg-zinc-100 dark:bg-zinc-800/60' : ''
            }`}
            onClick={() => handleSupplierClick(supplier)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-black dark:text-white">{supplier.name}</h3>
                  <span className="badge-mono badge-mono-outline text-[10px]">
                    {supplier.active ? 'Active' : 'Standby'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">{supplier.description}</p>
                <div className="mt-1.5 flex items-center gap-3 text-[10px] font-mono text-zinc-400">
                  <span>Reliability: <strong>{supplier.reliabilityScore}%</strong></span>
                  <span>Transit: <strong>{supplier.averageShippingTime}d</strong></span>
                </div>
              </div>

              <FiChevronRight className="w-4 h-4 text-zinc-400" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupplierList;