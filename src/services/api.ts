import axios from 'axios';
import { Product } from '@/types';

// Create API client using environment variable
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://fakestoreapi.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interface for the Fake Store API product format
interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// Transform Fake Store API data to our application's format
const transformProduct = (product: FakeStoreProduct): Product => {
  // Calculate a realistic cost (60-75% of the selling price)
  const costPercentage = 0.6 + Math.random() * 0.15;
  const cost = product.price * costPercentage;
  
  return {
    id: `P${product.id}`,
    name: product.title,
    category: product.category,
    cost: parseFloat(cost.toFixed(2)),
    potentialPrice: product.price,
    rating: product.rating.rate,
    imageUrl: product.image,
    description: product.description
  };
};

// Example API functions
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get('/products');
    return response.data.map(transformProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const response = await apiClient.get(`/products/category/${category}`);
    return response.data.map(transformProduct);
  } catch (error) {
    console.error(`Error fetching ${category} products:`, error);
    return [];
  }
};

export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchSuppliers = async () => {
  try {
    // There's no suppliers API in FakeStore, so we'll create mock data
    // In a real app, you'd fetch this from your backend
    return [
      { id: 1, name: 'GlobalTrade Supplies', location: 'China', rating: 4.8, lead_time: '3-5 days', price_level: 'Low', min_order: 50 },
      { id: 2, name: 'EuroDistributors', location: 'Germany', rating: 4.5, lead_time: '5-7 days', price_level: 'Medium', min_order: 25 },
      { id: 3, name: 'AmeriSource', location: 'USA', rating: 4.9, lead_time: '2-3 days', price_level: 'High', min_order: 10 },
      { id: 4, name: 'AsiaManufacturing', location: 'Vietnam', rating: 4.3, lead_time: '4-6 days', price_level: 'Low', min_order: 100 },
    ];
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return [];
  }
};

export default apiClient; 