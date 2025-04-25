export interface Supplier {
  id: string;
  name: string;
  description: string;
  logo: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  shippingCountries: string[];
  averageShippingTime: number; // in days
  reliabilityScore: number; // 0-100
  productCategories: string[];
  minimumOrderValue: number;
  hasAutomatedApi: boolean;
  processingTime: number; // in days
  returnPolicy: string;
  paymentTerms: string;
  active: boolean;
}

export interface SupplierProduct {
  id: string;
  supplierId: string;
  sku: string;
  name: string;
  description: string;
  images: string[];
  basePrice: number;
  currency: string;
  categories: string[];
  variants: ProductVariant[];
  attributes: Record<string, string>;
  inventoryCount: number;
  minOrderQuantity: number;
  shippingWeight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  isAvailable: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  additionalPrice: number;
  inventoryCount: number;
  attributes: Record<string, string>;
}

export interface SupplierOrder {
  id: string;
  supplierId: string;
  products: {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
  }[];
  customerAddress: {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  trackingUrl?: string;
  shippingMethod: string;
  shippingCost: number;
  notes?: string;
} 