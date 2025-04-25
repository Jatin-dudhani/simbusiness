export interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  url: string;
  currency: string;
  language: string;
  contactEmail: string;
  contactPhone: string;
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    pinterest?: string;
    tiktok?: string;
  };
  paymentMethods: string[];
  shippingMethods: ShippingMethod[];
  taxSettings: {
    applyTax: boolean;
    taxRate: number;
    taxIncluded: boolean;
  };
  markupSettings: {
    defaultMarkupPercentage: number;
    categoryMarkups: Record<string, number>;
    supplierMarkups: Record<string, number>;
  };
  automationSettings: {
    autoAcceptOrders: boolean;
    autoUpdateInventory: boolean;
    lowStockThreshold: number;
    outOfStockAction: 'hide' | 'showAsSoldOut' | 'backorder';
  };
  themeSettings: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    logoPosition: 'left' | 'center' | 'right';
    bannerImages: string[];
  };
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  estimatedDeliveryTime: string;
  flatRate?: number;
  conditionBasedRates?: {
    condition: 'weight' | 'price' | 'items';
    ranges: {
      min: number;
      max: number;
      rate: number;
    }[];
  };
  countries: string[];
  isActive: boolean;
}

export interface StoreProduct {
  id: string;
  originalSupplierProductId: string;
  supplierId: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  comparePriceAt?: number;
  costPrice: number;
  sku: string;
  barcode?: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  categories: string[];
  tags: string[];
  variants: StoreProductVariant[];
  attributes: Record<string, string>;
  metaTitle?: string;
  metaDescription?: string;
  status: 'active' | 'draft' | 'archived';
  vendor: string;
  inventoryTracking: boolean;
  inventoryQuantity: number;
  lowStockThreshold: number;
  hasUnlimitedInventory: boolean;
  seoHandle: string;
  shippingRequired: boolean;
  taxable: boolean;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreProductVariant {
  id: string;
  title: string;
  sku: string;
  barcode?: string;
  price: number;
  costPrice: number;
  inventoryQuantity: number;
  attributes: Record<string, string>;
  image?: string;
  weight?: number;
} 