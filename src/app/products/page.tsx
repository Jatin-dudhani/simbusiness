'use client';

import { useState } from 'react';
import { FiBox, FiDollarSign, FiTag, FiStar } from 'react-icons/fi';

// Mock product data - In a real app, this would come from an API or database
const initialProducts = [
  { id: 'P1', name: 'Wireless Earbuds', category: 'Electronics', cost: 15.50, potentialPrice: 39.99, rating: 4.5, imageUrl: '/placeholder.svg' },
  { id: 'P2', name: 'LED Strip Lights', category: 'Home Decor', cost: 8.20, potentialPrice: 19.99, rating: 4.2, imageUrl: '/placeholder.svg' },
  { id: 'P3', name: 'Yoga Mat', category: 'Sports & Outdoors', cost: 12.00, potentialPrice: 29.99, rating: 4.8, imageUrl: '/placeholder.svg' },
  { id: 'P4', name: 'Portable Blender', category: 'Kitchen', cost: 22.50, potentialPrice: 45.00, rating: 4.0, imageUrl: '/placeholder.svg' },
  { id: 'P5', name: 'Smartwatch', category: 'Electronics', cost: 45.00, potentialPrice: 99.99, rating: 4.6, imageUrl: '/placeholder.svg' },
  { id: 'P6', name: 'Resistance Bands Set', category: 'Sports & Outdoors', cost: 9.80, potentialPrice: 24.99, rating: 4.3, imageUrl: '/placeholder.svg' },
];

interface Product {
  id: string;
  name: string;
  category: string;
  cost: number;
  potentialPrice: number;
  rating: number;
  imageUrl: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]); // Store selected product IDs

  const handleProductSelect = (productId: string) => {
    setSelectedProducts(prevSelected => 
      prevSelected.includes(productId)
        ? prevSelected.filter(id => id !== productId)
        : [...prevSelected, productId]
    );
    // In a real app, you might save this selection to user state or backend
    console.log("Selected products:", selectedProducts);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Product Catalog</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isSelected={selectedProducts.includes(product.id)}
              onSelect={handleProductSelect}
            />
          ))}
        </div>
        {selectedProducts.length > 0 && (
           <div className="mt-8 p-4 bg-blue-100 border border-blue-300 rounded-lg text-center">
              <p className="text-blue-800 font-medium">
                  Selected {selectedProducts.length} product(s) for your store. 
                  (Note: Selection currently doesn't affect simulation)
              </p>
           </div>
        )}
      </main>
    </div>
  );
}

function ProductCard({ product, isSelected, onSelect }: { product: Product; isSelected: boolean; onSelect: (id: string) => void }) {
  return (
    <div className={`card bg-white overflow-hidden transition-all ${isSelected ? 'ring-2 ring-primary' : 'shadow-sm hover:shadow-md'}`}>
      <div className="bg-gray-200 h-40 flex items-center justify-center">
        {/* Placeholder for image - replace with actual Image component if needed */}
        <FiBox size={48} className="text-gray-400" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 truncate" title={product.name}>{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2 flex items-center gap-1"><FiTag size={14}/> {product.category}</p>
        
        <div className="flex justify-between items-center text-sm mb-3">
          <span className="text-green-600 font-medium flex items-center gap-1">
            <FiDollarSign size={14}/> Cost: ${product.cost.toFixed(2)}
          </span>
          <span className="text-blue-600 font-medium flex items-center gap-1">
             <FiDollarSign size={14}/> Price: ${product.potentialPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <span>Profit Margin: {(((product.potentialPrice - product.cost) / product.potentialPrice) * 100).toFixed(0)}%</span>
          <span className="flex items-center gap-1"><FiStar size={14} className="text-yellow-400"/> {product.rating}</span>
        </div>

        <button 
          onClick={() => onSelect(product.id)}
          className={`btn w-full text-sm ${isSelected ? 'btn-secondary' : 'btn-primary'}`}
        >
          {isSelected ? 'Remove from Store' : 'Add to Store'}
        </button>
      </div>
    </div>
  );
} 