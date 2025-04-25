import React, { useState, useEffect } from 'react';
import { Supplier } from '../services/SupplierService';
import { SupplierService } from '../services/SupplierService';

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
        setError('Failed to load suppliers. Please try again later.');
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
    return <div className="p-4 text-center">Loading suppliers...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  if (suppliers.length === 0) {
    return <div className="p-4 text-center">No suppliers found.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold p-4 border-b">Suppliers</h2>
      <ul className="divide-y divide-gray-200">
        {suppliers.map((supplier) => (
          <li
            key={supplier.id}
            className={`p-4 cursor-pointer hover:bg-gray-50 ${
              selectedSupplierId === supplier.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => handleSupplierClick(supplier)}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12">
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={supplier.logo}
                  alt={supplier.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/200?text=Supplier';
                  }}
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{supplier.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      supplier.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {supplier.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{supplier.description}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span className="mr-4">
                    <span className="font-medium">Reliability:</span>{' '}
                    {supplier.reliabilityScore}%
                  </span>
                  <span>
                    <span className="font-medium">Shipping:</span>{' '}
                    {supplier.averageShippingTime} days
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupplierList; 