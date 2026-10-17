'use client';

import React, { useState, useEffect } from 'react';
import { SupplierProduct, SupplierService } from '../services/SupplierService';
import { StoreService } from '../services/StoreService';
import { FiCheck, FiSearch, FiSliders } from 'react-icons/fi';

interface ProductImporterProps {
  supplierId: string;
  onProductImported?: () => void;
}

const ProductImporter: React.FC<ProductImporterProps> = ({ supplierId, onProductImported }) => {
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [importing, setImporting] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [markupPercentage, setMarkupPercentage] = useState<number>(50);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!supplierId) return;
      try {
        setLoading(true);
        const data = await SupplierService.getSupplierProducts(supplierId);
        setProducts(data);
        
        const categories = Array.from(
          new Set(data.flatMap(product => product.categories))
        );
        setAvailableCategories(categories);
        setError(null);
      } catch (err) {
        setError('Failed to load supplier products.');
        console.error('Error fetching supplier products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [supplierId]);

  const handleImportProduct = async (product: SupplierProduct) => {
    try {
      setImporting(prev => ({ ...prev, [product.id]: true }));
      await StoreService.importProductFromSupplier(supplierId, product.id);
      
      if (onProductImported) {
        onProductImported();
      }
      setProducts(prev => prev.filter(p => p.id !== product.id));
    } catch (err) {
      console.error('Error importing product:', err);
      setError('Failed to import product.');
    } finally {
      setImporting(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    } else {
      setSelectedCategories(prev => [...prev, category]);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategories = 
      selectedCategories.length === 0 || 
      product.categories.some(category => selectedCategories.includes(category));
    
    return matchesSearch && matchesCategories;
  });

  if (loading) {
    return <div className="p-6 text-center text-xs text-zinc-500 font-mono">Loading supplier catalog...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-xs text-zinc-500 font-mono">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="p-6 text-center text-xs text-zinc-500 font-mono">All products from this supplier are currently imported.</div>;
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">
            Wholesale Catalog Importer
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Import vetted supplier inventory items into your active store listings with custom retail markup.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">
              Search Supplier SKUs
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none"
              placeholder="Search by title, SKU or keyword..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">
              Store Retail Markup (%)
            </label>
            <input
              type="number"
              min="0"
              max="500"
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none"
              value={markupPercentage}
              onChange={e => setMarkupPercentage(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
      
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[500px] overflow-y-auto">
        {filteredProducts.map(product => (
          <li key={product.id} className="p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold text-zinc-400">
                  SKU
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-black dark:text-white">{product.name}</h3>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                    Supplier Cost: ${product.basePrice.toFixed(2)} → Retail Price: ${(product.basePrice * (1 + markupPercentage / 100)).toFixed(2)} ({markupPercentage}% margin)
                  </p>
                  <span className="text-[10px] font-mono text-zinc-400 mt-1 block">
                    Available Stock: {product.inventoryCount} units | Weight: {product.shippingWeight} kg
                  </span>
                </div>
              </div>

              <button
                className="btn btn-primary text-xs py-1.5 px-3 self-end sm:self-center"
                onClick={() => handleImportProduct(product)}
                disabled={importing[product.id]}
              >
                {importing[product.id] ? 'Importing...' : '+ Import SKU'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductImporter;