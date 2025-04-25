import { v4 as uuidv4 } from 'uuid';

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

// This is a simulation service - in a real app, this would connect to actual supplier APIs
export class SupplierService {
  // Get all suppliers
  static async getSuppliers(): Promise<Supplier[]> {
    // In a real app, this would fetch from an API or database
    return mockSuppliers;
  }

  // Get supplier by ID
  static async getSupplierById(id: string): Promise<Supplier | null> {
    return mockSuppliers.find(supplier => supplier.id === id) || null;
  }

  // Get products from a supplier
  static async getSupplierProducts(supplierId: string): Promise<SupplierProduct[]> {
    // Simulate API call to get products from the supplier
    return mockProducts.filter(product => product.supplierId === supplierId);
  }

  // Get a specific product from a supplier
  static async getSupplierProduct(supplierId: string, productId: string): Promise<SupplierProduct | null> {
    return mockProducts.find(product => product.supplierId === supplierId && product.id === productId) || null;
  }

  // Place an order with a supplier
  static async placeOrder(order: Omit<SupplierOrder, 'id' | 'status'>): Promise<SupplierOrder> {
    // Simulate placing an order with the supplier
    const newOrder: SupplierOrder = {
      ...order,
      id: `order-${Date.now()}`,
      status: 'pending',
    };
    
    // In a real app, this would send the order to the supplier's API
    console.log(`Order placed with supplier ${order.supplierId}`, newOrder);
    
    return newOrder;
  }

  // Check order status with a supplier
  static async checkOrderStatus(orderId: string): Promise<SupplierOrder | null> {
    // Simulate checking order status with the supplier
    const order = mockOrders.find(order => order.id === orderId);
    
    if (!order) return null;
    
    // Simulate random status updates based on time since order creation
    const orderDate = new Date(order.orderDate);
    const daysSinceOrder = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let status: SupplierOrder['status'] = 'pending';
    
    if (daysSinceOrder > 7) {
      status = 'delivered';
    } else if (daysSinceOrder > 3) {
      status = 'shipped';
    } else if (daysSinceOrder > 1) {
      status = 'processing';
    }
    
    return {
      ...order,
      status,
      trackingNumber: status === 'shipped' || status === 'delivered' ? 'TRACK123456789' : undefined,
      trackingUrl: status === 'shipped' || status === 'delivered' ? 'https://example.com/track/TRACK123456789' : undefined,
    };
  }

  // Check inventory levels with a supplier
  static async checkInventory(supplierId: string, productId: string): Promise<number> {
    // Simulate checking inventory with the supplier
    const product = mockProducts.find(p => p.supplierId === supplierId && p.id === productId);
    return product ? product.inventoryCount : 0;
  }

  // Calculate shipping cost
  static async calculateShipping(
    supplierId: string, 
    productIds: string[], 
    destination: { country: string; postalCode: string }
  ): Promise<number> {
    // Simulate shipping cost calculation
    const supplier = mockSuppliers.find(s => s.id === supplierId);
    
    if (!supplier) return 0;
    
    // Check if supplier ships to destination country
    if (!supplier.shippingCountries.includes(destination.country)) {
      throw new Error(`Supplier does not ship to ${destination.country}`);
    }
    
    // Calculate base shipping cost based on supplier
    let baseCost = 5 + (Math.random() * 10);
    
    // Add cost for each product
    const products = mockProducts.filter(p => 
      p.supplierId === supplierId && productIds.includes(p.id)
    );
    
    let totalWeight = 0;
    for (const product of products) {
      totalWeight += product.shippingWeight;
    }
    
    // Add weight-based cost
    const weightCost = totalWeight * 0.5;
    
    return parseFloat((baseCost + weightCost).toFixed(2));
  }
}

// Mock data for simulation
const mockSuppliers: Supplier[] = [
  {
    id: 'sup-001',
    name: 'Global Gadgets Supply',
    description: 'Leading supplier of electronics and gadgets',
    logo: 'https://example.com/logo1.png',
    contactEmail: 'contact@globalgadgets.com',
    contactPhone: '+1-555-123-4567',
    websiteUrl: 'https://globalgadgets.com',
    shippingCountries: ['US', 'CA', 'UK', 'AU', 'DE', 'FR'],
    averageShippingTime: 5,
    reliabilityScore: 92,
    productCategories: ['Electronics', 'Smartphones', 'Accessories'],
    minimumOrderValue: 100,
    hasAutomatedApi: true,
    processingTime: 1,
    returnPolicy: '30-day return for defective items',
    paymentTerms: 'Net 30',
    active: true,
  },
  {
    id: 'sup-002',
    name: 'Fashion Forward',
    description: 'Trendy clothing and accessories supplier',
    logo: 'https://example.com/logo2.png',
    contactEmail: 'suppliers@fashionforward.com',
    contactPhone: '+1-555-987-6543',
    websiteUrl: 'https://fashionforward.com',
    shippingCountries: ['US', 'CA', 'UK', 'DE', 'FR', 'IT', 'ES'],
    averageShippingTime: 7,
    reliabilityScore: 87,
    productCategories: ['Clothing', 'Shoes', 'Accessories', 'Jewelry'],
    minimumOrderValue: 50,
    hasAutomatedApi: true,
    processingTime: 2,
    returnPolicy: '14-day return policy, customer pays return shipping',
    paymentTerms: 'Net 15',
    active: true,
  },
  {
    id: 'sup-003',
    name: 'Home Essentials Co',
    description: 'Quality home goods and decorations',
    logo: 'https://example.com/logo3.png',
    contactEmail: 'wholesale@homeessentials.com',
    contactPhone: '+1-555-456-7890',
    websiteUrl: 'https://homeessentials.com',
    shippingCountries: ['US', 'CA', 'UK', 'AU'],
    averageShippingTime: 8,
    reliabilityScore: 90,
    productCategories: ['Home Decor', 'Kitchen', 'Bedding', 'Bath'],
    minimumOrderValue: 75,
    hasAutomatedApi: false,
    processingTime: 3,
    returnPolicy: '30-day return policy for unused items',
    paymentTerms: 'Net 30',
    active: true,
  },
];

// Sample products for simulation
const mockProducts: SupplierProduct[] = [
  {
    id: 'prod-001',
    supplierId: 'sup-001',
    sku: 'GG-PHONE-001',
    name: 'SmartPhone X Pro',
    description: 'Latest smartphone with advanced features',
    images: ['https://example.com/phone1.png', 'https://example.com/phone2.png'],
    basePrice: 350,
    currency: 'USD',
    categories: ['Electronics', 'Smartphones'],
    variants: [
      {
        id: 'var-001',
        name: 'Black / 64GB',
        sku: 'GG-PHONE-001-BLK-64',
        additionalPrice: 0,
        inventoryCount: 120,
        attributes: { color: 'Black', storage: '64GB' },
      },
      {
        id: 'var-002',
        name: 'Black / 128GB',
        sku: 'GG-PHONE-001-BLK-128',
        additionalPrice: 50,
        inventoryCount: 85,
        attributes: { color: 'Black', storage: '128GB' },
      },
      {
        id: 'var-003',
        name: 'Blue / 64GB',
        sku: 'GG-PHONE-001-BLU-64',
        additionalPrice: 0,
        inventoryCount: 95,
        attributes: { color: 'Blue', storage: '64GB' },
      },
      {
        id: 'var-004',
        name: 'Blue / 128GB',
        sku: 'GG-PHONE-001-BLU-128',
        additionalPrice: 50,
        inventoryCount: 75,
        attributes: { color: 'Blue', storage: '128GB' },
      },
    ],
    attributes: {
      brand: 'TechX',
      model: 'X Pro',
      screen: '6.5 inches',
      camera: 'Triple 48MP',
    },
    inventoryCount: 375,
    minOrderQuantity: 1,
    shippingWeight: 0.5,
    dimensions: {
      length: 16,
      width: 8,
      height: 2,
      unit: 'cm',
    },
    isAvailable: true,
  },
  {
    id: 'prod-002',
    supplierId: 'sup-001',
    sku: 'GG-WATCH-001',
    name: 'Smart Watch Elite',
    description: 'Premium smartwatch with health tracking features',
    images: ['https://example.com/watch1.png', 'https://example.com/watch2.png'],
    basePrice: 120,
    currency: 'USD',
    categories: ['Electronics', 'Wearables', 'Accessories'],
    variants: [
      {
        id: 'var-005',
        name: 'Black / Plastic',
        sku: 'GG-WATCH-001-BLK-P',
        additionalPrice: 0,
        inventoryCount: 150,
        attributes: { color: 'Black', material: 'Plastic' },
      },
      {
        id: 'var-006',
        name: 'Black / Metal',
        sku: 'GG-WATCH-001-BLK-M',
        additionalPrice: 30,
        inventoryCount: 100,
        attributes: { color: 'Black', material: 'Metal' },
      },
      {
        id: 'var-007',
        name: 'Silver / Plastic',
        sku: 'GG-WATCH-001-SIL-P',
        additionalPrice: 0,
        inventoryCount: 125,
        attributes: { color: 'Silver', material: 'Plastic' },
      },
      {
        id: 'var-008',
        name: 'Silver / Metal',
        sku: 'GG-WATCH-001-SIL-M',
        additionalPrice: 30,
        inventoryCount: 85,
        attributes: { color: 'Silver', material: 'Metal' },
      },
    ],
    attributes: {
      brand: 'TechX',
      model: 'Elite',
      display: 'AMOLED',
      waterproof: 'Yes',
    },
    inventoryCount: 460,
    minOrderQuantity: 1,
    shippingWeight: 0.3,
    dimensions: {
      length: 5,
      width: 5,
      height: 2,
      unit: 'cm',
    },
    isAvailable: true,
  },
  {
    id: 'prod-003',
    supplierId: 'sup-002',
    sku: 'FF-JACKET-001',
    name: 'Winter Parka Jacket',
    description: 'Warm winter jacket with waterproof exterior',
    images: ['https://example.com/jacket1.png', 'https://example.com/jacket2.png'],
    basePrice: 45,
    currency: 'USD',
    categories: ['Clothing', 'Outerwear'],
    variants: [
      {
        id: 'var-009',
        name: 'Black / S',
        sku: 'FF-JACKET-001-BLK-S',
        additionalPrice: 0,
        inventoryCount: 50,
        attributes: { color: 'Black', size: 'S' },
      },
      {
        id: 'var-010',
        name: 'Black / M',
        sku: 'FF-JACKET-001-BLK-M',
        additionalPrice: 0,
        inventoryCount: 75,
        attributes: { color: 'Black', size: 'M' },
      },
      {
        id: 'var-011',
        name: 'Black / L',
        sku: 'FF-JACKET-001-BLK-L',
        additionalPrice: 0,
        inventoryCount: 60,
        attributes: { color: 'Black', size: 'L' },
      },
      {
        id: 'var-012',
        name: 'Green / S',
        sku: 'FF-JACKET-001-GRN-S',
        additionalPrice: 0,
        inventoryCount: 45,
        attributes: { color: 'Green', size: 'S' },
      },
      {
        id: 'var-013',
        name: 'Green / M',
        sku: 'FF-JACKET-001-GRN-M',
        additionalPrice: 0,
        inventoryCount: 65,
        attributes: { color: 'Green', size: 'M' },
      },
      {
        id: 'var-014',
        name: 'Green / L',
        sku: 'FF-JACKET-001-GRN-L',
        additionalPrice: 0,
        inventoryCount: 55,
        attributes: { color: 'Green', size: 'L' },
      },
    ],
    attributes: {
      material: 'Polyester',
      waterproof: 'Yes',
      season: 'Winter',
    },
    inventoryCount: 350,
    minOrderQuantity: 3,
    shippingWeight: 1.2,
    dimensions: {
      length: 30,
      width: 25,
      height: 5,
      unit: 'cm',
    },
    isAvailable: true,
  },
];

// Sample orders for simulation
const mockOrders: SupplierOrder[] = [
  {
    id: 'order-001',
    supplierId: 'sup-001',
    products: [
      {
        productId: 'prod-001',
        variantId: 'var-002',
        quantity: 2,
        price: 400,
      },
      {
        productId: 'prod-002',
        variantId: 'var-006',
        quantity: 1,
        price: 150,
      }
    ],
    customerAddress: {
      name: 'John Doe',
      addressLine1: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
      country: 'US',
      phone: '555-123-4567',
    },
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: 'processing',
    shippingMethod: 'Standard',
    shippingCost: 12.50,
  },
  {
    id: 'order-002',
    supplierId: 'sup-002',
    products: [
      {
        productId: 'prod-003',
        variantId: 'var-010',
        quantity: 5,
        price: 225,
      },
    ],
    customerAddress: {
      name: 'Jane Smith',
      addressLine1: '456 Oak Ave',
      addressLine2: 'Apt 301',
      city: 'Other City',
      state: 'NY',
      postalCode: '54321',
      country: 'US',
      phone: '555-987-6543',
    },
    orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    status: 'shipped',
    trackingNumber: 'TRACK987654321',
    trackingUrl: 'https://example.com/track/TRACK987654321',
    shippingMethod: 'Express',
    shippingCost: 18.75,
  },
]; 