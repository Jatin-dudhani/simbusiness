import axios from 'axios';
import { Product } from '@/types';
import { apiConfig } from '@/config/site';

/**
 * Robust API Client with configured timeout, safety headers, and interceptors
 */
const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeoutMs,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Response interceptor for error handling and logging without leaking sensitive data
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log sanitized error message
    const url = error.config?.url || 'unknown';
    console.warn(`[SimBusiness API] Request failed for ${url}:`, error.message);
    return Promise.reject(error);
  }
);

// Interface for Fake Store API product format
interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

// Transform Fake Store API data to application's Product format
const transformProduct = (product: FakeStoreProduct): Product => {
  // Realistic supplier unit cost: ~65% of potential retail selling price
  const costPercentage = 0.65;
  const cost = parseFloat((product.price * costPercentage).toFixed(2));
  
  return {
    id: `P${product.id}`,
    name: sanitizeString(product.title),
    category: sanitizeString(product.category),
    cost: cost > 0 ? cost : 5.0,
    potentialPrice: Number(product.price) > 0 ? Number(product.price) : 9.99,
    rating: product.rating?.rate ? Number(product.rating.rate) : 4.5,
    imageUrl: product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    description: sanitizeString(product.description || 'High quality dropshipping product ready for store listing.'),
  };
};

/**
 * Sanitize strings to prevent XSS and malformed text
 */
function sanitizeString(str: string): string {
  if (!str) return '';
  return str.replace(/[<>]/g, '').trim();
}

/**
 * Resilient Fallback Catalog (Used when FakeStoreAPI is offline, times out, or rate-limited)
 */
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'P101',
    name: 'Minimalist Wireless Noise-Cancelling Headphones',
    category: 'electronics',
    cost: 48.50,
    potentialPrice: 89.99,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'High-fidelity audio with active noise cancellation and 40-hour battery life.',
  },
  {
    id: 'P102',
    name: 'Obsidian Smart Fitness Tracker Watch',
    category: 'electronics',
    cost: 32.00,
    potentialPrice: 69.99,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    description: 'Track daily steps, heart rate, sleep quality, and workouts with waterproof AMOLED display.',
  },
  {
    id: 'P103',
    name: 'Ultra-Slim Mechanical Ergonomic Keyboard',
    category: 'electronics',
    cost: 54.00,
    potentialPrice: 119.99,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    description: 'Low-profile mechanical switches with wireless Bluetooth connectivity and monochrome white backlight.',
  },
  {
    id: 'P104',
    name: 'Matte Black Ceramic Coffee Dripper & Carafe',
    category: 'home & kitchen',
    cost: 16.50,
    potentialPrice: 38.00,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    description: 'Handcrafted ceramic pour-over coffee maker designed for steady brewing and maximum extraction.',
  },
  {
    id: 'P105',
    name: 'Monochrome Heavyweight Cotton Oversized Tee',
    category: "men's clothing",
    cost: 12.00,
    potentialPrice: 34.00,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    description: '300 GSM combed cotton vintage drop-shoulder silhouette, pre-shrunk and durable.',
  },
  {
    id: 'P106',
    name: 'Structured Canvas Everyday Messenger Bag',
    category: 'accessories',
    cost: 26.00,
    potentialPrice: 65.00,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    description: 'Water-resistant waxed canvas with padded 16-inch laptop compartment and metal hardware.',
  },
  {
    id: 'P107',
    name: 'Minimalist Titanium Polarized Sunglasses',
    category: 'accessories',
    cost: 22.00,
    potentialPrice: 58.00,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    description: 'Featherlight aerospace-grade titanium frame with 100% UV400 anti-glare polarized lenses.',
  },
  {
    id: 'P108',
    name: 'Sleek Stainless Steel Insulated Tumbler 750ml',
    category: 'home & kitchen',
    cost: 11.50,
    potentialPrice: 29.99,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
    description: 'Double-wall vacuum insulation keeps cold for 24 hours, leakproof lid with removable silicone straw.',
  },
];

/**
 * Fetch products from API with automatic fallback
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get('/products');
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map(transformProduct);
    }
    return FALLBACK_PRODUCTS;
  } catch (error) {
    console.warn('[SimBusiness] Using resilient fallback products catalog');
    return FALLBACK_PRODUCTS;
  }
};

/**
 * Fetch products by category with automatic fallback
 */
export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const cleanCategory = sanitizeString(category);
  try {
    const response = await apiClient.get(`/products/category/${encodeURIComponent(cleanCategory)}`);
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map(transformProduct);
    }
    return FALLBACK_PRODUCTS.filter(p => p.category.toLowerCase() === cleanCategory.toLowerCase());
  } catch (error) {
    console.warn(`[SimBusiness] Using fallback for category "${cleanCategory}"`);
    const filtered = FALLBACK_PRODUCTS.filter(
      p => p.category.toLowerCase() === cleanCategory.toLowerCase()
    );
    return filtered.length > 0 ? filtered : FALLBACK_PRODUCTS;
  }
};

/**
 * Fetch all available categories
 */
export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get('/products/categories');
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
    return ['electronics', 'jewelery', "men's clothing", "women's clothing"];
  } catch (error) {
    return ['electronics', 'jewelery', "men's clothing", "women's clothing", 'home & kitchen', 'accessories'];
  }
};

/**
 * Check API Health Status
 */
export const checkApiHealth = async (): Promise<{ status: 'online' | 'fallback'; latencyMs: number; baseURL: string }> => {
  const startTime = Date.now();
  try {
    await apiClient.get('/products?limit=1');
    return {
      status: 'online',
      latencyMs: Date.now() - startTime,
      baseURL: apiConfig.baseURL,
    };
  } catch {
    return {
      status: 'fallback',
      latencyMs: Date.now() - startTime,
      baseURL: apiConfig.baseURL,
    };
  }
};

/**
 * Fetch Suppliers with metadata
 */
export const fetchSuppliers = async () => {
  return [
    { id: 1, name: 'GlobalTrade Logistics Ltd', location: 'Shenzhen, CN', rating: 4.8, lead_time: '5-8 days', price_level: 'Low', min_order: 25 },
    { id: 2, name: 'EuroPrecision Goods GmbH', location: 'Frankfurt, DE', rating: 4.9, lead_time: '3-5 days', price_level: 'Medium', min_order: 15 },
    { id: 3, name: 'AmeriFulfill Direct', location: 'California, US', rating: 4.9, lead_time: '2-3 days', price_level: 'High', min_order: 5 },
    { id: 4, name: 'Apex Pacific Manufacturing', location: 'Ho Chi Minh, VN', rating: 4.4, lead_time: '7-10 days', price_level: 'Low', min_order: 50 },
    { id: 5, name: 'Nordic Craft Co.', location: 'Stockholm, SE', rating: 4.7, lead_time: '4-6 days', price_level: 'Medium', min_order: 10 },
  ];
};

export default apiClient;