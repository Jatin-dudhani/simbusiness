import { v4 as uuidv4 } from 'uuid';

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minimumOrderAmount?: number;
  appliesTo: 'entire_order' | 'products' | 'collections';
  targetIds?: string[]; // Product IDs or collection IDs
  excludedProductIds?: string[];
  usageLimit?: number;
  usageCount: number;
  customerLimit?: number;
  customerUsage: Record<string, number>;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'social' | 'abandoned_cart' | 'retargeting';
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';
  audience: 'all' | 'specific_customers';
  customerIds?: string[];
  content: {
    subject?: string;
    body: string;
    imageUrl?: string;
    ctaText?: string;
    ctaUrl?: string;
  };
  discountCodeId?: string;
  scheduledDate?: string;
  sentDate?: string;
  stats: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
    revenue: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AbandonedCart {
  id: string;
  customerId: string;
  customerEmail: string;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
  }[];
  totalValue: number;
  createdAt: string;
  updatedAt: string;
  lastReminderSent?: string;
  reminderCount: number;
  recoveredOrderId?: string;
  isRecovered: boolean;
}

// Marketing service for dropshipping store
export class MarketingService {
  // Discount Codes
  static async getDiscountCodes(): Promise<DiscountCode[]> {
    return mockDiscountCodes;
  }

  static async getDiscountCodeById(id: string): Promise<DiscountCode | null> {
    return mockDiscountCodes.find(discount => discount.id === id) || null;
  }

  static async getDiscountCodeByCode(code: string): Promise<DiscountCode | null> {
    return mockDiscountCodes.find(
      discount => discount.code.toLowerCase() === code.toLowerCase() && discount.isActive
    ) || null;
  }

  static async createDiscountCode(discountData: Omit<DiscountCode, 'id' | 'usageCount' | 'customerUsage' | 'createdAt'>): Promise<DiscountCode> {
    const now = new Date().toISOString();
    const newDiscount: DiscountCode = {
      ...discountData,
      id: uuidv4(),
      usageCount: 0,
      customerUsage: {},
      createdAt: now,
    };
    
    mockDiscountCodes.push(newDiscount);
    return newDiscount;
  }

  static async updateDiscountCode(id: string, updates: Partial<DiscountCode>): Promise<DiscountCode | null> {
    const index = mockDiscountCodes.findIndex(discount => discount.id === id);
    if (index === -1) return null;
    
    mockDiscountCodes[index] = { ...mockDiscountCodes[index], ...updates };
    return mockDiscountCodes[index];
  }

  static async deleteDiscountCode(id: string): Promise<boolean> {
    const index = mockDiscountCodes.findIndex(discount => discount.id === id);
    if (index === -1) return false;
    
    mockDiscountCodes.splice(index, 1);
    return true;
  }

  static async validateDiscountCode(
    code: string, 
    orderTotal: number, 
    productIds: string[], 
    customerId?: string
  ): Promise<{ 
    valid: boolean; 
    discount?: { type: DiscountCode['type']; value: number }; 
    message?: string; 
  }> {
    const discountCode = await MarketingService.getDiscountCodeByCode(code);
    
    if (!discountCode) {
      return { valid: false, message: 'Invalid discount code.' };
    }
    
    // Check if code is active
    if (!discountCode.isActive) {
      return { valid: false, message: 'This discount code is no longer active.' };
    }
    
    // Check date range
    const now = new Date();
    const startDate = new Date(discountCode.startDate);
    if (now < startDate) {
      return { valid: false, message: `This discount code is not valid until ${startDate.toLocaleDateString()}.` };
    }
    
    if (discountCode.endDate) {
      const endDate = new Date(discountCode.endDate);
      if (now > endDate) {
        return { valid: false, message: 'This discount code has expired.' };
      }
    }
    
    // Check minimum order amount
    if (discountCode.minimumOrderAmount && orderTotal < discountCode.minimumOrderAmount) {
      return { 
        valid: false, 
        message: `This discount requires a minimum order of $${discountCode.minimumOrderAmount.toFixed(2)}.` 
      };
    }
    
    // Check usage limit
    if (discountCode.usageLimit && discountCode.usageCount >= discountCode.usageLimit) {
      return { valid: false, message: 'This discount code has reached its usage limit.' };
    }
    
    // Check customer limit
    if (customerId && discountCode.customerLimit) {
      const customerUsage = discountCode.customerUsage[customerId] || 0;
      if (customerUsage >= discountCode.customerLimit) {
        return { valid: false, message: 'You have already used this discount code the maximum number of times.' };
      }
    }
    
    // Check product restrictions
    if (discountCode.appliesTo === 'products' && discountCode.targetIds) {
      const hasValidProduct = productIds.some(id => discountCode.targetIds!.includes(id));
      if (!hasValidProduct) {
        return { valid: false, message: 'This discount code is not valid for any products in your cart.' };
      }
    }
    
    // Check excluded products
    if (discountCode.excludedProductIds) {
      const allExcluded = productIds.every(id => discountCode.excludedProductIds!.includes(id));
      if (allExcluded) {
        return { valid: false, message: 'This discount code cannot be used with the products in your cart.' };
      }
    }
    
    return { 
      valid: true, 
      discount: { 
        type: discountCode.type, 
        value: discountCode.value 
      } 
    };
  }

  static async applyDiscount(
    discountCode: DiscountCode,
    orderTotal: number,
    productIds: string[],
    customerId?: string
  ): Promise<{
    discountAmount: number;
    discountedTotal: number;
  }> {
    let discountAmount = 0;
    
    switch (discountCode.type) {
      case 'percentage':
        discountAmount = orderTotal * (discountCode.value / 100);
        break;
      case 'fixed':
        discountAmount = Math.min(discountCode.value, orderTotal); // Can't discount more than order total
        break;
      case 'free_shipping':
        // Assuming shipping cost is calculated elsewhere and passed in the order total
        discountAmount = discountCode.value;
        break;
    }
    
    // Update usage stats
    discountCode.usageCount += 1;
    if (customerId) {
      discountCode.customerUsage[customerId] = (discountCode.customerUsage[customerId] || 0) + 1;
    }
    
    await MarketingService.updateDiscountCode(discountCode.id, {
      usageCount: discountCode.usageCount,
      customerUsage: discountCode.customerUsage,
    });
    
    return {
      discountAmount,
      discountedTotal: orderTotal - discountAmount,
    };
  }

  // Campaigns
  static async getCampaigns(): Promise<Campaign[]> {
    return mockCampaigns;
  }

  static async getCampaignById(id: string): Promise<Campaign | null> {
    return mockCampaigns.find(campaign => campaign.id === id) || null;
  }

  static async createCampaign(campaignData: Omit<Campaign, 'id' | 'stats' | 'createdAt' | 'updatedAt'>): Promise<Campaign> {
    const now = new Date().toISOString();
    const newCampaign: Campaign = {
      ...campaignData,
      id: uuidv4(),
      stats: {
        sent: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        revenue: 0,
      },
      createdAt: now,
      updatedAt: now,
    };
    
    mockCampaigns.push(newCampaign);
    return newCampaign;
  }

  static async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
    const index = mockCampaigns.findIndex(campaign => campaign.id === id);
    if (index === -1) return null;
    
    const now = new Date().toISOString();
    mockCampaigns[index] = { 
      ...mockCampaigns[index], 
      ...updates, 
      updatedAt: now 
    };
    
    return mockCampaigns[index];
  }

  static async deleteCampaign(id: string): Promise<boolean> {
    const index = mockCampaigns.findIndex(campaign => campaign.id === id);
    if (index === -1) return false;
    
    mockCampaigns.splice(index, 1);
    return true;
  }

  static async executeCampaign(id: string): Promise<Campaign | null> {
    const campaign = await MarketingService.getCampaignById(id);
    if (!campaign) return null;
    
    // Check if campaign can be executed
    if (campaign.status !== 'scheduled' && campaign.status !== 'draft') {
      throw new Error(`Cannot execute campaign with status: ${campaign.status}`);
    }
    
    const now = new Date().toISOString();
    
    // In a real app, this would send emails/SMS/etc.
    console.log(`Executing campaign: ${campaign.name}`);
    
    // Simulate sending to audience
    let sentCount = 0;
    if (campaign.audience === 'all') {
      sentCount = 100; // Simulating 100 customers
    } else if (campaign.customerIds) {
      sentCount = campaign.customerIds.length;
    }
    
    // Update campaign stats
    const updatedCampaign = await MarketingService.updateCampaign(id, {
      status: 'completed',
      sentDate: now,
      stats: {
        ...campaign.stats,
        sent: sentCount,
        // Simulate some engagement stats
        opened: Math.floor(sentCount * 0.6), // 60% open rate
        clicked: Math.floor(sentCount * 0.2), // 20% click rate
        converted: Math.floor(sentCount * 0.05), // 5% conversion rate
        revenue: Math.floor(sentCount * 0.05 * 50), // Assuming $50 average order value
      },
    });
    
    return updatedCampaign;
  }

  // Abandoned Carts
  static async getAbandonedCarts(): Promise<AbandonedCart[]> {
    return mockAbandonedCarts;
  }

  static async getAbandonedCartById(id: string): Promise<AbandonedCart | null> {
    return mockAbandonedCarts.find(cart => cart.id === id) || null;
  }

  static async getAbandonedCartsByCustomer(customerId: string): Promise<AbandonedCart[]> {
    return mockAbandonedCarts.filter(cart => cart.customerId === customerId && !cart.isRecovered);
  }

  static async createAbandonedCart(cartData: Omit<AbandonedCart, 'id' | 'reminderCount' | 'isRecovered' | 'createdAt' | 'updatedAt'>): Promise<AbandonedCart> {
    const now = new Date().toISOString();
    const newCart: AbandonedCart = {
      ...cartData,
      id: uuidv4(),
      reminderCount: 0,
      isRecovered: false,
      createdAt: now,
      updatedAt: now,
    };
    
    mockAbandonedCarts.push(newCart);
    return newCart;
  }

  static async updateAbandonedCart(id: string, updates: Partial<AbandonedCart>): Promise<AbandonedCart | null> {
    const index = mockAbandonedCarts.findIndex(cart => cart.id === id);
    if (index === -1) return null;
    
    const now = new Date().toISOString();
    mockAbandonedCarts[index] = { 
      ...mockAbandonedCarts[index], 
      ...updates, 
      updatedAt: now 
    };
    
    return mockAbandonedCarts[index];
  }

  static async markCartAsRecovered(id: string, orderId: string): Promise<AbandonedCart | null> {
    return MarketingService.updateAbandonedCart(id, {
      isRecovered: true,
      recoveredOrderId: orderId,
    });
  }

  static async sendAbandonedCartReminder(id: string): Promise<AbandonedCart | null> {
    const cart = await MarketingService.getAbandonedCartById(id);
    if (!cart) return null;
    
    // Don't send reminders for recovered carts
    if (cart.isRecovered) {
      return cart;
    }
    
    const now = new Date().toISOString();
    
    // In a real app, this would send an email
    console.log(`Sending abandoned cart reminder to: ${cart.customerEmail}`);
    
    const updatedCart = await MarketingService.updateAbandonedCart(id, {
      lastReminderSent: now,
      reminderCount: cart.reminderCount + 1,
    });
    
    return updatedCart;
  }

  // Process all abandoned carts that need reminders
  static async processAbandonedCarts(): Promise<number> {
    const carts = await MarketingService.getAbandonedCarts();
    let remindersSent = 0;
    
    for (const cart of carts) {
      // Skip recovered carts
      if (cart.isRecovered) continue;
      
      // Skip carts that have had 3 or more reminders
      if (cart.reminderCount >= 3) continue;
      
      const cartCreatedDate = new Date(cart.createdAt);
      const now = new Date();
      
      // Time intervals for reminders
      const hoursSinceCreation = (now.getTime() - cartCreatedDate.getTime()) / (1000 * 60 * 60);
      
      // First reminder: 1 hour after abandonment
      // Second reminder: 24 hours after abandonment
      // Third reminder: 72 hours after abandonment
      let shouldSendReminder = false;
      
      if (cart.reminderCount === 0 && hoursSinceCreation >= 1) {
        shouldSendReminder = true;
      } else if (cart.reminderCount === 1 && hoursSinceCreation >= 24) {
        shouldSendReminder = true;
      } else if (cart.reminderCount === 2 && hoursSinceCreation >= 72) {
        shouldSendReminder = true;
      }
      
      if (shouldSendReminder) {
        await MarketingService.sendAbandonedCartReminder(cart.id);
        remindersSent++;
      }
    }
    
    return remindersSent;
  }
}

// Mock data for simulation
const mockDiscountCodes: DiscountCode[] = [
  {
    id: 'discount-001',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minimumOrderAmount: 0,
    appliesTo: 'entire_order',
    usageLimit: 1000,
    usageCount: 150,
    customerLimit: 1,
    customerUsage: {},
    startDate: '2023-01-01T00:00:00Z',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'discount-002',
    code: 'SPRING30',
    type: 'percentage',
    value: 30,
    minimumOrderAmount: 100,
    appliesTo: 'entire_order',
    usageLimit: 500,
    usageCount: 220,
    startDate: '2023-03-01T00:00:00Z',
    endDate: '2023-05-31T23:59:59Z',
    isActive: true,
    customerUsage: {},
    createdAt: '2023-02-15T00:00:00Z',
  },
  {
    id: 'discount-003',
    code: 'FREESHIP',
    type: 'free_shipping',
    value: 15,
    minimumOrderAmount: 75,
    appliesTo: 'entire_order',
    usageCount: 85,
    startDate: '2023-01-15T00:00:00Z',
    endDate: '2023-12-31T23:59:59Z',
    isActive: true,
    customerUsage: {},
    createdAt: '2023-01-15T00:00:00Z',
  },
];

const mockCampaigns: Campaign[] = [
  {
    id: 'campaign-001',
    name: 'Welcome Email Series',
    type: 'email',
    status: 'active',
    audience: 'all',
    content: {
      subject: 'Welcome to Our Store!',
      body: 'Thank you for signing up! Use code WELCOME10 for 10% off your first order.',
      ctaText: 'Shop Now',
      ctaUrl: 'https://ecomsimulate.shop/products',
    },
    discountCodeId: 'discount-001',
    stats: {
      sent: 500,
      opened: 300,
      clicked: 150,
      converted: 50,
      revenue: 2500,
    },
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-03-01T00:00:00Z',
  },
  {
    id: 'campaign-002',
    name: 'Spring Sale',
    type: 'email',
    status: 'scheduled',
    audience: 'all',
    content: {
      subject: 'Spring Sale - 30% Off Everything!',
      body: 'Our biggest sale of the season is here. Take 30% off sitewide!',
      imageUrl: 'https://example.com/spring-sale.jpg',
      ctaText: 'Shop Sale',
      ctaUrl: 'https://ecomsimulate.shop/sale',
    },
    discountCodeId: 'discount-002',
    scheduledDate: '2023-03-15T09:00:00Z',
    stats: {
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
    },
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2023-03-01T00:00:00Z',
  },
  {
    id: 'campaign-003',
    name: 'Abandoned Cart Recovery',
    type: 'abandoned_cart',
    status: 'active',
    audience: 'specific_customers',
    content: {
      subject: 'You left something in your cart!',
      body: 'We noticed you left some items in your cart. Come back and complete your purchase!',
      ctaText: 'Complete Purchase',
      ctaUrl: 'https://ecomsimulate.shop/cart',
    },
    discountCodeId: 'discount-003',
    stats: {
      sent: 120,
      opened: 80,
      clicked: 40,
      converted: 20,
      revenue: 1800,
    },
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2023-03-05T00:00:00Z',
  },
];

const mockAbandonedCarts: AbandonedCart[] = [
  {
    id: 'cart-001',
    customerId: 'cust-003',
    customerEmail: 'mark.johnson@example.com',
    items: [
      {
        productId: 'sp-001',
        variantId: 'spv-004',
        quantity: 1,
        price: 569,
      },
    ],
    totalValue: 569,
    createdAt: '2023-03-10T14:30:00Z',
    updatedAt: '2023-03-10T14:30:00Z',
    lastReminderSent: '2023-03-10T15:30:00Z',
    reminderCount: 1,
    isRecovered: false,
  },
  {
    id: 'cart-002',
    customerId: 'cust-004',
    customerEmail: 'sarah.williams@example.com',
    items: [
      {
        productId: 'sp-002',
        variantId: 'spv-005',
        quantity: 1,
        price: 179.99,
      },
      {
        productId: 'sp-001',
        variantId: 'spv-001',
        quantity: 1,
        price: 499,
      },
    ],
    totalValue: 678.99,
    createdAt: '2023-03-08T10:15:00Z',
    updatedAt: '2023-03-10T09:00:00Z',
    lastReminderSent: '2023-03-10T09:00:00Z',
    reminderCount: 2,
    isRecovered: false,
  },
  {
    id: 'cart-003',
    customerId: 'cust-005',
    customerEmail: 'david.brown@example.com',
    items: [
      {
        productId: 'sp-001',
        variantId: 'spv-003',
        quantity: 1,
        price: 499,
      },
    ],
    totalValue: 499,
    createdAt: '2023-03-05T16:45:00Z',
    updatedAt: '2023-03-08T10:00:00Z',
    lastReminderSent: '2023-03-08T10:00:00Z',
    reminderCount: 3,
    recoveredOrderId: 'order-003',
    isRecovered: true,
  },
]; 