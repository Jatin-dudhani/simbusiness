import React, { useState, useEffect } from 'react';
import { SupplierProduct, SupplierService } from '../services/SupplierService';
import { StoreService } from '../services/StoreService';

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
        
        // Extract all unique categories
        const categories = Array.from(
          new Set(data.flatMap(product => product.categories))
        );
        setAvailableCategories(categories);
        
        setError(null);
      } catch (err) {
        setError('Failed to load supplier products. Please try again later.');
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
      
      // Import the product with custom markup
      await StoreService.importProductFromSupplier(supplierId, product.id, {
        // Custom fields can be added here if needed
      });
      
      if (onProductImported) {
        onProductImported();
      }
      
      // Remove the imported product from the list
      setProducts(prev => prev.filter(p => p.id !== product.id));
      
    } catch (err) {
      console.error('Error importing product:', err);
      setError('Failed to import product. Please try again.');
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
    // Filter by search term
    const matchesSearch = 
      searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by selected categories
    const matchesCategories = 
      selectedCategories.length === 0 || 
      product.categories.some(category => selectedCategories.includes(category));
    
    return matchesSearch && matchesCategories;
  });

  if (loading) {
    return <div className="p-4 text-center">Loading supplier products...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="p-4 text-center">No products available from this supplier.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Import Products</h2>
        <p className="text-gray-500 mt-1">
          Browse and import products from this supplier to your store.
        </p>
        
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search Products
            </label>
            <input
              type="text"
              id="search"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Search by name, description or SKU"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex-1">
            <label htmlFor="markup" className="block text-sm font-medium text-gray-700">
              Markup Percentage
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="number"
                id="markup"
                min="0"
                max="500"
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={markupPercentage}
                onChange={e => setMarkupPercentage(Number(e.target.value))}
              />
              <span className="ml-2 text-gray-500">%</span>
            </div>
          </div>
        </div>
        
        {availableCategories.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Filter by Category
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              {availableCategories.map(category => (
                <button
                  key={category}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategories.includes(category)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {filteredProducts.map(product => (
          <li key={product.id} className="p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="flex-shrink-0 h-16 w-16 mb-2 md:mb-0">
                <img
                  className="h-16 w-16 rounded object-cover"
                  src={product.images[0] || 'https://via.placeholder.com/200?text=Product'}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/200?text=Product';
                  }}
                />
              </div>
              <div className="ml-0 md:ml-4 flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <div className="flex items-center mt-2 md:mt-0">
                    <span className="text-gray-500 mr-2">
                      Cost: ${product.basePrice.toFixed(2)}
                    </span>
                    <span className="text-green-600 font-medium">
                      Sell: ${(product.basePrice * (1 + markupPercentage / 100)).toFixed(2)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 gap-2">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    SKU: {product.sku}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    Stock: {product.inventoryCount}
                  </span>
                  {product.variants.length > 0 && (
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {product.variants.length} variants
                    </span>
                  )}
                  {product.categories.map(category => (
                    <span key={category} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:ml-4 w-full md:w-auto">
                <button
                  className={`w-full md:w-auto px-4 py-2 rounded-md text-white ${
                    importing[product.id]
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  onClick={() => handleImportProduct(product)}
                  disabled={importing[product.id]}
                >
                  {importing[product.id] ? 'Importing...' : 'Import Product'}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductImporter; 