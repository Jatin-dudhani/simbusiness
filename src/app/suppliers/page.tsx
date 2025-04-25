'use client';

import { useState } from 'react';
import { Supplier } from '@/types';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { 
      id: 1, 
      name: 'Tech Innovations Ltd', 
      location: 'China', 
      category: 'Electronics',
      rating: 4.8,
      lead_time: '8-12 days',
      price_level: 'Medium',
      min_order: 5
    },
    { 
      id: 2, 
      name: 'EcoHome Goods', 
      location: 'Vietnam', 
      category: 'Home & Garden',
      rating: 4.5,
      lead_time: '10-14 days',
      price_level: 'Low',
      min_order: 10
    },
    { 
      id: 3, 
      name: 'FashionForward', 
      location: 'India', 
      category: 'Fashion',
      rating: 4.2,
      lead_time: '7-10 days',
      price_level: 'Medium',
      min_order: 8
    },
    { 
      id: 4, 
      name: 'Active Life', 
      location: 'USA', 
      category: 'Sports',
      rating: 4.9,
      lead_time: '3-5 days',
      price_level: 'High',
      min_order: 3
    },
    { 
      id: 5, 
      name: 'Beauty Essentials', 
      location: 'South Korea', 
      category: 'Beauty',
      rating: 4.7,
      lead_time: '7-9 days',
      price_level: 'Medium',
      min_order: 5
    },
  ]);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  const handleSupplierSelect = (id: number) => {
    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
      setSelectedSupplier(supplier);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Suppliers List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Suppliers</h2>
                <button className="btn btn-primary">Add New Supplier</button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2">Supplier</th>
                      <th className="pb-2">Location</th>
                      <th className="pb-2">Category</th>
                      <th className="pb-2">Rating</th>
                      <th className="pb-2">Lead Time</th>
                      <th className="pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((supplier) => (
                      <tr key={supplier.id} className="border-b">
                        <td className="py-2 font-medium">{supplier.name}</td>
                        <td className="py-2">{supplier.location}</td>
                        <td className="py-2">{supplier.category}</td>
                        <td className="py-2">
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span>{supplier.rating}</span>
                          </div>
                        </td>
                        <td className="py-2">{supplier.lead_time}</td>
                        <td className="py-2">
                          <button 
                            onClick={() => handleSupplierSelect(supplier.id)}
                            className="text-primary hover:underline mr-3"
                          >
                            View
                          </button>
                          <button className="text-gray-600 hover:underline">
                            Order
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Supplier Details */}
          <div>
            <div className="card">
              <h2 className="text-xl font-bold mb-4">
                {selectedSupplier ? 'Supplier Details' : 'Select a Supplier'}
              </h2>
              
              {selectedSupplier ? (
                <div>
                  <div className="mb-4 pb-4 border-b">
                    <h3 className="text-lg font-medium mb-1">{selectedSupplier.name}</h3>
                    <p className="text-gray-600">{selectedSupplier.location} • {selectedSupplier.category}</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-medium flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        {selectedSupplier.rating}/5.0
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lead Time:</span>
                      <span className="font-medium">{selectedSupplier.lead_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price Level:</span>
                      <span className="font-medium">{selectedSupplier.price_level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Minimum Order:</span>
                      <span className="font-medium">{selectedSupplier.min_order} units</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="btn btn-primary w-full">Place Order</button>
                    <button className="btn btn-outline w-full">Contact Supplier</button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Select a supplier from the list to view details.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 