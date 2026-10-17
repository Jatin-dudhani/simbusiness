'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiBox, 
  FiDollarSign, 
  FiTag, 
  FiStar, 
  FiFilter, 
  FiCheck, 
  FiSearch,
  FiTrendingUp,
  FiLayers,
  FiExternalLink
} from 'react-icons/fi';
import { fetchProducts, fetchCategories, fetchProductsByCategory } from '@/services/api';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { apiConfig } from '@/config/site';
import AuthGuard from '@/components/AuthGuard';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [importedProductIds, setImportedProductIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  // Load imported products from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('simbusiness_imported_products');
      if (stored) {
        setImportedProductIds(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not read imported products:', e);
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load catalog data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Filter by category
  const handleCategorySelect = async (cat: string) => {
    setSelectedCategory(cat);
    setIsLoading(true);
    try {
      if (cat === 'all') {
        const prods = await fetchProducts();
        setProducts(prods);
      } else {
        const prods = await fetchProductsByCategory(cat);
        setProducts(prods);
      }
    } catch (e) {
      console.error('Category load error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle product in active store
  const handleToggleStoreImport = (product: Product) => {
    const isImported = importedProductIds.includes(product.id);
    let updated: string[];

    if (isImported) {
      updated = importedProductIds.filter(id => id !== product.id);
      showNotice(`Removed "${product.name.slice(0, 30)}..." from your store catalog.`);
    } else {
      updated = [...importedProductIds, product.id];
      showNotice(`Imported "${product.name.slice(0, 30)}..." into active store inventory.`);
    }

    setImportedProductIds(updated);
    try {
      localStorage.setItem('simbusiness_imported_products', JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  };

  const showNotice = (text: string) => {
    setNotice(text);
    setTimeout(() => setNotice(null), 3000);
  };

  // Filter products by search
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-mono badge-mono-black">Wholesale Sourcing</span>
              <span className="text-xs text-zinc-500 font-mono">Catalog Engine</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white mt-1">
              Supplier Product Catalog
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Select verified wholesale products to import directly into your dropshipping store.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/calculator"
              className="btn btn-outline text-xs"
            >
              <FiTrendingUp className="w-3.5 h-3.5 mr-1.5" /> Calculate Profitability
            </Link>
            <div className="px-3.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono">
              Imported: <strong>{importedProductIds.length}</strong> Products
            </div>
          </div>
        </div>

        {/* Dynamic Toast Notice */}
        {notice && (
          <div className="mb-6 p-3.5 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-between text-xs font-medium animate-in fade-in slide-in-from-top-2">
            <span>{notice}</span>
            <span className="text-[10px] uppercase font-mono opacity-80">Catalog Synced</span>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="card mb-8 p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="card p-16 text-center">
            <div className="w-8 h-8 mx-auto border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs text-zinc-500 font-mono">Synchronizing wholesale catalog items...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="card p-16 text-center">
            <FiBox className="w-10 h-10 mx-auto text-zinc-400 mb-3" />
            <h3 className="text-sm font-bold text-black dark:text-white">No products found</h3>
            <p className="text-xs text-zinc-500 mt-1">Try clearing your search query or switching categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isImported = importedProductIds.includes(product.id);
              const margin = (((product.potentialPrice - product.cost) / product.potentialPrice) * 100).toFixed(0);

              return (
                <div
                  key={product.id}
                  className={`card p-4 flex flex-col justify-between transition-all border ${
                    isImported
                      ? 'border-black dark:border-white shadow-md'
                      : 'hover:border-zinc-400 dark:hover:border-zinc-700'
                  }`}
                >
                  <div>
                    {/* Image Box */}
                    <div className="w-full h-48 rounded-xl bg-zinc-100 dark:bg-zinc-900 relative overflow-hidden flex items-center justify-center mb-4">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-contain p-3 hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <FiBox className="w-8 h-8 text-zinc-400" />
                      )}
                      <span className="absolute top-2.5 right-2.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/80 text-white backdrop-blur-sm">
                        {margin}% Margin
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5">
                      <span className="capitalize">{product.category}</span>
                      <span className="flex items-center gap-1 font-mono">
                        <FiStar className="w-3 h-3 text-black dark:text-white fill-current" />
                        {product.rating.toFixed(1)}
                      </span>
                    </div>

                    <h3 className="font-semibold text-sm text-black dark:text-white line-clamp-2 mb-2" title={product.name}>
                      {product.name}
                    </h3>
                  </div>

                  <div>
                    {/* Financial Breakdown */}
                    <div className="flex items-center justify-between py-2.5 my-2 border-t border-b border-zinc-100 dark:border-zinc-800 text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-mono block">Wholesale Cost</span>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                          ${product.cost.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-400 uppercase font-mono block">Retail Price</span>
                        <span className="font-bold text-black dark:text-white">
                          ${product.potentialPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Action button */}
                    <button
                      onClick={() => handleToggleStoreImport(product)}
                      className={`btn w-full text-xs py-2 mt-2 ${
                        isImported
                          ? 'btn-outline border-black dark:border-white font-semibold'
                          : 'btn-primary'
                      }`}
                    >
                      {isImported ? (
                        <>
                          <FiCheck className="w-3.5 h-3.5 mr-1.5" /> In Your Store
                        </>
                      ) : (
                        '+ Import to Store'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
    </AuthGuard>
  );
}