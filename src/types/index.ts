// Supplier interfaces
export interface Supplier {
  id: number;
  name: string;
  location: string;
  category: string;
  rating: number;
  lead_time: string;
  price_level: string;
  min_order: number;
}

// Product interface
export interface Product {
  id: string;
  name: string;
  category: string;
  cost: number;
  potentialPrice: number;
  rating: number;
  imageUrl: string;
  description?: string;
}

// Market interfaces
export interface MarketTrend {
  category: string;
  growth: number;
  demand: 'High' | 'Medium' | 'Low';
}

export interface ProductRecommendation {
  name: string;
  category: string;
  price: number;
  margin: number;
  popularity: number;
}

export interface MarketData {
  trends: MarketTrend[];
  recommendations: ProductRecommendation[];
}

// Business stats interfaces
export interface BusinessStats {
  revenue: number;
  expenses: number;
  profit: number;
  orders: number;
  inventory: number;
  marketing: number;
}

// Settings interfaces
export interface BusinessSettings {
  businessName: string;
  email: string;
  currency: string;
  taxRate: number;
  shippingFee: number;
  profitMargin: number;
  notificationsEnabled: boolean;
  darkMode: boolean;
}

// Event interface for activity logs
export interface BusinessEvent {
  id: number;
  date: string;
  activity: string;
  amount: number;
} 