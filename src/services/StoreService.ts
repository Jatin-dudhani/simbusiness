import { Store, StoreProduct, StoreProductVariant } from '../models/Store';
import { SupplierProduct, SupplierService } from './SupplierService';
import { v4 as uuidv4 } from 'uuid';

// This service simulates store management functionality similar to Shopify/WooCommerce
export class StoreService {
  // Get store settings
  static async getStoreSettings(): Promise<Store> {
    return mockStore;
  }

  // Update store settings
  static async updateStoreSettings(settings: Partial<Store>): Promise<Store> {
    mockStore = { ...mockStore, ...settings };
    return mockStore;
  }

  // Get all products in the store
  static async getProducts(): Promise<StoreProduct[]> {
    return mockStoreProducts;
  }

  // Get a specific product
  static async getProductById(id: string): Promise<StoreProduct | null> {
    return mockStoreProducts.find(product => product.id === id) || null;
  }

  // Create a new product
  static async createProduct(product: Omit<StoreProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<StoreProduct> {
    const now = new Date().toISOString();
    const newProduct: StoreProduct = {
      ...product,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    mockStoreProducts.push(newProduct);
    return newProduct;
  }

  // Update a product
  static async updateProduct(id: string, updates: Partial<StoreProduct>): Promise<StoreProduct | null> {
    const index = mockStoreProducts.findIndex(product => product.id === id);
    if (index === -1) return null;
    
    mockStoreProducts[index] = { 
      ...mockStoreProducts[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    
    return mockStoreProducts[index];
  }

  // Delete a product
  static async deleteProduct(id: string): Promise<boolean> {
    const index = mockStoreProducts.findIndex(product => product.id === id);
    if (index === -1) return false;
    
    mockStoreProducts.splice(index, 1);
    return true;
  }

  // Import a product from a supplier
  static async importProductFromSupplier(
    supplierId: string, 
    supplierProductId: string, 
    customizations: Partial<StoreProduct> = {}
  ): Promise<StoreProduct | null> {
    // Get the supplier product
    const supplierProduct = await SupplierService.getSupplierProduct(supplierId, supplierProductId);
    if (!supplierProduct) return null;
    
    // Get store markup settings
    const { markupSettings } = mockStore;
    
    // Calculate markup percentage (use category-specific, supplier-specific, or default)
    let markupPercentage = markupSettings.defaultMarkupPercentage;
    
    if (supplierProduct.categories.some(cat => cat in markupSettings.categoryMarkups)) {
      // Use the highest category markup if multiple categories match
      markupPercentage = Math.max(
        ...supplierProduct.categories
          .filter(cat => cat in markupSettings.categoryMarkups)
          .map(cat => markupSettings.categoryMarkups[cat])
      );
    } else if (supplierId in markupSettings.supplierMarkups) {
      markupPercentage = markupSettings.supplierMarkups[supplierId];
    }
    
    // Convert supplier product to store product
    const now = new Date().toISOString();
    const storeProduct: StoreProduct = {
      id: uuidv4(),
      originalSupplierProductId: supplierProduct.id,
      supplierId: supplierProduct.supplierId,
      title: supplierProduct.name,
      description: supplierProduct.description,
      images: supplierProduct.images,
      price: supplierProduct.basePrice * (1 + markupPercentage / 100),
      costPrice: supplierProduct.basePrice,
      sku: `STORE-${supplierProduct.sku}`,
      weight: supplierProduct.shippingWeight,
      dimensions: supplierProduct.dimensions,
      categories: supplierProduct.categories,
      tags: [],
      variants: supplierProduct.variants.map(variant => ({
        id: uuidv4(),
        title: variant.name,
        sku: `STORE-${variant.sku}`,
        price: (supplierProduct.basePrice + variant.additionalPrice) * (1 + markupPercentage / 100),
        costPrice: supplierProduct.basePrice + variant.additionalPrice,
        inventoryQuantity: variant.inventoryCount,
        attributes: variant.attributes,
      })),
      attributes: supplierProduct.attributes,
      status: 'draft',
      vendor: (await SupplierService.getSupplierById(supplierId))?.name || 'Unknown Supplier',
      inventoryTracking: true,
      inventoryQuantity: supplierProduct.inventoryCount,
      lowStockThreshold: 10,
      hasUnlimitedInventory: false,
      seoHandle: supplierProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shippingRequired: true,
      taxable: true,
      publishDate: now,
      createdAt: now,
      updatedAt: now,
      ...customizations,
    };
    
    // Add to store products
    mockStoreProducts.push(storeProduct);
    
    return storeProduct;
  }

  // Sync inventory with supplier
  static async syncInventoryWithSupplier(productId: string): Promise<StoreProduct | null> {
    const product = await StoreService.getProductById(productId);
    if (!product) return null;
    
    // Get the supplier product
    const supplierProduct = await SupplierService.getSupplierProduct(
      product.supplierId, 
      product.originalSupplierProductId
    );
    
    if (!supplierProduct) return null;
    
    // Update inventory quantities
    const updatedProduct = await StoreService.updateProduct(productId, {
      inventoryQuantity: supplierProduct.inventoryCount,
      variants: product.variants.map(variant => {
        const supplierVariant = supplierProduct.variants.find(
          sv => sv.sku === variant.sku.replace('STORE-', '')
        );
        
        return {
          ...variant,
          inventoryQuantity: supplierVariant?.inventoryCount || variant.inventoryQuantity,
        };
      }),
      updatedAt: new Date().toISOString(),
    });
    
    return updatedProduct;
  }

  // Bulk sync inventory with suppliers
  static async bulkSyncInventory(): Promise<number> {
    const products = await StoreService.getProducts();
    let syncedCount = 0;
    
    for (const product of products) {
      const updated = await StoreService.syncInventoryWithSupplier(product.id);
      if (updated) syncedCount++;
    }
    
    return syncedCount;
  }

  // Calculate profit margins
  static calculateProfitMargin(product: StoreProduct): {
    margin: number;
    marginPercentage: number;
  } {
    const profit = product.price - product.costPrice;
    const marginPercentage = (profit / product.price) * 100;
    
    return {
      margin: parseFloat(profit.toFixed(2)),
      marginPercentage: parseFloat(marginPercentage.toFixed(2)),
    };
  }
}

// Sample store data for simulation
let mockStore: Store = {
  id: 'store-001',
  name: 'EcomSimulate Shop',
  description: 'Your one-stop shop for all products',
  logo: 'https://example.com/store-logo.png',
  url: 'https://ecomsimulate.shop',
  currency: 'USD',
  language: 'en-US',
  contactEmail: 'contact@ecomsimulate.shop',
  contactPhone: '+1-555-123-4567',
  address: {
    addressLine1: '789 Commerce St',
    city: 'E-Commerce City',
    state: 'CA',
    postalCode: '67890',
    country: 'US',
  },
  socialMedia: {
    facebook: 'https://facebook.com/ecomsimulate',
    instagram: 'https://instagram.com/ecomsimulate',
    twitter: 'https://twitter.com/ecomsimulate',
  },
  paymentMethods: ['credit_card', 'paypal', 'stripe'],
  shippingMethods: [
    {
      id: 'shipping-001',
      name: 'Standard Shipping',
      description: 'Delivery in 5-7 business days',
      estimatedDeliveryTime: '5-7 business days',
      flatRate: 5.99,
      countries: ['US', 'CA'],
      isActive: true,
    },
    {
      id: 'shipping-002',
      name: 'Express Shipping',
      description: 'Delivery in 2-3 business days',
      estimatedDeliveryTime: '2-3 business days',
      flatRate: 12.99,
      countries: ['US', 'CA'],
      isActive: true,
    },
    {
      id: 'shipping-003',
      name: 'International Shipping',
      description: 'Delivery in 7-14 business days',
      estimatedDeliveryTime: '7-14 business days',
      conditionBasedRates: {
        condition: 'weight',
        ranges: [
          { min: 0, max: 1, rate: 15.99 },
          { min: 1, max: 3, rate: 24.99 },
          { min: 3, max: 10, rate: 39.99 },
        ],
      },
      countries: ['UK', 'AU', 'DE', 'FR', 'IT', 'ES'],
      isActive: true,
    },
  ],
  taxSettings: {
    applyTax: true,
    taxRate: 8.5,
    taxIncluded: false,
  },
  markupSettings: {
    defaultMarkupPercentage: 50,
    categoryMarkups: {
      Electronics: 40,
      Clothing: 80,
      Accessories: 100,
      Wearables: 60,
    },
    supplierMarkups: {
      'sup-001': 45,
      'sup-002': 75,
      'sup-003': 60,
    },
  },
  automationSettings: {
    autoAcceptOrders: true,
    autoUpdateInventory: true,
    lowStockThreshold: 10,
    outOfStockAction: 'showAsSoldOut',
  },
  themeSettings: {
    primaryColor: '#4A90E2',
    secondaryColor: '#F5A623',
    fontFamily: 'Roboto, sans-serif',
    logoPosition: 'left',
    bannerImages: [
      'https://example.com/banner1.jpg',
      'https://example.com/banner2.jpg',
      'https://example.com/banner3.jpg',
    ],
  },
};

// Sample store products for simulation
const mockStoreProducts: StoreProduct[] = [
  {
    id: 'sp-001',
    originalSupplierProductId: 'prod-001',
    supplierId: 'sup-001',
    title: 'XPhone Pro - Latest Smartphone',
    description: 'The latest smartphone with advanced features and cutting-edge technology.',
    images: ['https://example.com/phone1.png', 'https://example.com/phone2.png'],
    price: 499,
    costPrice: 350,
    sku: 'STORE-GG-PHONE-001',
    barcode: '1234567890123',
    weight: 0.5,
    dimensions: {
      length: 16,
      width: 8,
      height: 2,
      unit: 'cm',
    },
    categories: ['Electronics', 'Smartphones'],
    tags: ['featured', 'new-arrival', 'best-seller'],
    variants: [
      {
        id: 'spv-001',
        title: 'Black / 64GB',
        sku: 'STORE-GG-PHONE-001-BLK-64',
        price: 499,
        costPrice: 350,
        inventoryQuantity: 120,
        attributes: { color: 'Black', storage: '64GB' },
      },
      {
        id: 'spv-002',
        title: 'Black / 128GB',
        sku: 'STORE-GG-PHONE-001-BLK-128',
        price: 569,
        costPrice: 400,
        inventoryQuantity: 85,
        attributes: { color: 'Black', storage: '128GB' },
      },
      {
        id: 'spv-003',
        title: 'Blue / 64GB',
        sku: 'STORE-GG-PHONE-001-BLU-64',
        price: 499,
        costPrice: 350,
        inventoryQuantity: 95,
        attributes: { color: 'Blue', storage: '64GB' },
      },
      {
        id: 'spv-004',
        title: 'Blue / 128GB',
        sku: 'STORE-GG-PHONE-001-BLU-128',
        price: 569,
        costPrice: 400,
        inventoryQuantity: 75,
        attributes: { color: 'Blue', storage: '128GB' },
      },
    ],
    attributes: {
      brand: 'TechX',
      model: 'X Pro',
      screen: '6.5 inches',
      camera: 'Triple 48MP',
    },
    metaTitle: 'Buy XPhone Pro - The Latest Smartphone | EcomSimulate',
    metaDescription: 'Get the latest XPhone Pro smartphone with advanced features. Available in different colors and storage options. Fast shipping!',
    status: 'active',
    vendor: 'Global Gadgets Supply',
    inventoryTracking: true,
    inventoryQuantity: 375,
    lowStockThreshold: 20,
    hasUnlimitedInventory: false,
    seoHandle: 'xphone-pro-latest-smartphone',
    shippingRequired: true,
    taxable: true,
    publishDate: '2023-01-15T00:00:00Z',
    createdAt: '2023-01-10T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 'sp-002',
    originalSupplierProductId: 'prod-002',
    supplierId: 'sup-001',
    title: 'SmartFit Watch - Health & Fitness Tracker',
    description: 'Premium smartwatch with health tracking features for fitness enthusiasts.',
    images: ['https://example.com/watch1.png', 'https://example.com/watch2.png'],
    price: 179.99,
    costPrice: 120,
    sku: 'STORE-GG-WATCH-001',
    barcode: '1234567890124',
    weight: 0.3,
    dimensions: {
      length: 5,
      width: 5,
      height: 2,
      unit: 'cm',
    },
    categories: ['Electronics', 'Wearables', 'Accessories'],
    tags: ['best-seller', 'fitness'],
    variants: [
      {
        id: 'spv-005',
        title: 'Black / Plastic',
        sku: 'STORE-GG-WATCH-001-BLK-P',
        price: 179.99,
        costPrice: 120,
        inventoryQuantity: 150,
        attributes: { color: 'Black', material: 'Plastic' },
      },
      {
        id: 'spv-006',
        title: 'Black / Metal',
        sku: 'STORE-GG-WATCH-001-BLK-M',
        price: 219.99,
        costPrice: 150,
        inventoryQuantity: 100,
        attributes: { color: 'Black', material: 'Metal' },
      },
      {
        id: 'spv-007',
        title: 'Silver / Plastic',
        sku: 'STORE-GG-WATCH-001-SIL-P',
        price: 179.99,
        costPrice: 120,
        inventoryQuantity: 125,
        attributes: { color: 'Silver', material: 'Plastic' },
      },
      {
        id: 'spv-008',
        title: 'Silver / Metal',
        sku: 'STORE-GG-WATCH-001-SIL-M',
        price: 219.99,
        costPrice: 150,
        inventoryQuantity: 85,
        attributes: { color: 'Silver', material: 'Metal' },
      },
    ],
    attributes: {
      brand: 'TechX',
      model: 'Elite',
      display: 'AMOLED',
      waterproof: 'Yes',
    },
    metaTitle: 'SmartFit Watch - Health & Fitness Tracker | EcomSimulate',
    metaDescription: 'Track your health and fitness with SmartFit Watch. Features heart rate monitoring, step tracking, and more. Shop now!',
    status: 'active',
    vendor: 'Global Gadgets Supply',
    inventoryTracking: true,
    inventoryQuantity: 460,
    lowStockThreshold: 30,
    hasUnlimitedInventory: false,
    seoHandle: 'smartfit-watch-health-fitness-tracker',
    shippingRequired: true,
    taxable: true,
    publishDate: '2023-01-20T00:00:00Z',
    createdAt: '2023-01-18T00:00:00Z',
    updatedAt: '2023-01-20T00:00:00Z',
  },
]; 