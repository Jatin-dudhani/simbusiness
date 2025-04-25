import { Order, OrderItem, OrderStatus, FulfillmentStatus, SupplierOrderReference } from '../models/Order';
import { StoreService } from './StoreService';
import { SupplierService } from './SupplierService';
import { v4 as uuidv4 } from 'uuid';

// This service simulates order management similar to Shopify/WooCommerce
export class OrderService {
  // Get all orders
  static async getOrders(): Promise<Order[]> {
    return mockOrders;
  }

  // Get order by ID
  static async getOrderById(id: string): Promise<Order | null> {
    return mockOrders.find(order => order.id === id) || null;
  }

  // Create a new order
  static async createOrder(
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'fulfillmentStatus' | 'supplierOrders'>
  ): Promise<Order> {
    const now = new Date().toISOString();
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    
    const newOrder: Order = {
      ...orderData,
      id: uuidv4(),
      orderNumber,
      createdAt: now,
      updatedAt: now,
      fulfillmentStatus: 'unfulfilled',
      supplierOrders: [],
    };
    
    mockOrders.push(newOrder);
    
    // If store settings have auto-accept orders enabled, process the order immediately
    const storeSettings = await StoreService.getStoreSettings();
    if (storeSettings.automationSettings.autoAcceptOrders) {
      await OrderService.processOrder(newOrder.id);
    }
    
    return newOrder;
  }

  // Update an order
  static async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    const index = mockOrders.findIndex(order => order.id === id);
    if (index === -1) return null;
    
    mockOrders[index] = { 
      ...mockOrders[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    
    return mockOrders[index];
  }

  // Cancel an order
  static async cancelOrder(id: string, reason?: string): Promise<Order | null> {
    const order = await OrderService.getOrderById(id);
    if (!order) return null;
    
    // Can't cancel an order that's already completed
    if (order.status === 'completed') {
      throw new Error('Cannot cancel a completed order');
    }
    
    // Update order status
    const updatedOrder = await OrderService.updateOrder(id, {
      status: 'cancelled',
      notes: reason ? `${order.notes || ''}\nCancellation reason: ${reason}` : order.notes,
      cancelledAt: new Date().toISOString(),
    });
    
    // Cancel supplier orders if any
    for (const supplierOrder of order.supplierOrders) {
      if (supplierOrder.status !== 'delivered' && supplierOrder.status !== 'cancelled') {
        // In a real app, this would call the supplier API to cancel the order
        console.log(`Cancelling supplier order ${supplierOrder.id} with ${supplierOrder.supplierName}`);
      }
    }
    
    return updatedOrder;
  }

  // Process an order (create supplier orders)
  static async processOrder(id: string): Promise<Order | null> {
    const order = await OrderService.getOrderById(id);
    if (!order) return null;
    
    // Can only process pending orders
    if (order.status !== 'pending' && order.status !== 'payment_pending') {
      throw new Error(`Cannot process order with status: ${order.status}`);
    }
    
    // Group order items by supplier
    const supplierItems: Record<string, OrderItem[]> = {};
    for (const item of order.items) {
      if (!supplierItems[item.supplierId]) {
        supplierItems[item.supplierId] = [];
      }
      supplierItems[item.supplierId].push(item);
    }
    
    // Create supplier orders
    const supplierOrders: SupplierOrderReference[] = [];
    for (const [supplierId, items] of Object.entries(supplierItems)) {
      const supplier = await SupplierService.getSupplierById(supplierId);
      if (!supplier) continue;
      
      // Format items for supplier order
      const supplierOrderItems = items.map(item => ({
        productId: item.supplierProductId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.unitCost * item.quantity,
      }));
      
      // Place order with supplier
      const supplierOrder = await SupplierService.placeOrder({
        supplierId,
        products: supplierOrderItems,
        customerAddress: {
          name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
          addressLine1: order.shippingAddress.addressLine1,
          addressLine2: order.shippingAddress.addressLine2,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          postalCode: order.shippingAddress.postalCode,
          country: order.shippingAddress.country,
          phone: order.shippingAddress.phone || order.customerPhone || '',
        },
        orderDate: new Date().toISOString(),
        shippingMethod: order.shippingMethod,
        shippingCost: 0, // Will be calculated by supplier
      });
      
      // Create reference to supplier order
      supplierOrders.push({
        id: supplierOrder.id,
        supplierId,
        supplierName: supplier.name,
        items: items.map(item => ({
          orderItemId: item.id,
          quantity: item.quantity,
        })),
        status: 'pending',
        createdAt: new Date().toISOString(),
        shippingMethod: order.shippingMethod,
        shippingCost: supplierOrder.shippingCost,
      });
    }
    
    // Update order with supplier orders and change status
    const updatedOrder = await OrderService.updateOrder(id, {
      status: 'processing',
      supplierOrders,
    });
    
    return updatedOrder;
  }

  // Update order fulfillment status based on supplier orders
  static async updateFulfillmentStatus(id: string): Promise<Order | null> {
    const order = await OrderService.getOrderById(id);
    if (!order) return null;
    
    // Skip if no supplier orders
    if (order.supplierOrders.length === 0) return order;
    
    // Check status of all supplier orders
    for (let i = 0; i < order.supplierOrders.length; i++) {
      const supplierOrder = order.supplierOrders[i];
      
      // Check status with supplier
      const updatedSupplierOrder = await SupplierService.checkOrderStatus(supplierOrder.id);
      if (updatedSupplierOrder) {
        // Update the supplier order status
        order.supplierOrders[i] = {
          ...order.supplierOrders[i],
          status: updatedSupplierOrder.status,
          trackingNumber: updatedSupplierOrder.trackingNumber,
          trackingUrl: updatedSupplierOrder.trackingUrl,
        };
      }
    }
    
    // Calculate overall fulfillment status
    let fulfillmentStatus: FulfillmentStatus = 'unfulfilled';
    const allShipped = order.supplierOrders.every(so => 
      so.status === 'shipped' || so.status === 'delivered'
    );
    const allDelivered = order.supplierOrders.every(so => 
      so.status === 'delivered'
    );
    const someFulfilled = order.supplierOrders.some(so => 
      so.status === 'shipped' || so.status === 'delivered'
    );
    
    if (allDelivered) {
      fulfillmentStatus = 'fulfilled';
    } else if (allShipped) {
      fulfillmentStatus = 'fulfilled';
    } else if (someFulfilled) {
      fulfillmentStatus = 'partially_fulfilled';
    }
    
    // Calculate order status
    let orderStatus: OrderStatus = order.status;
    if (fulfillmentStatus === 'fulfilled' && order.status === 'processing') {
      orderStatus = 'completed';
    }
    
    // Update order
    const updatedOrder = await OrderService.updateOrder(id, {
      fulfillmentStatus,
      status: orderStatus,
      supplierOrders: order.supplierOrders,
      completedAt: orderStatus === 'completed' ? new Date().toISOString() : order.completedAt,
    });
    
    return updatedOrder;
  }

  // Calculate order profit
  static calculateOrderProfit(order: Order): {
    revenue: number;
    cost: number;
    profit: number;
    profitMargin: number;
  } {
    // Calculate total revenue and cost
    const revenue = order.total;
    
    // Sum up the cost of all items
    let cost = 0;
    for (const item of order.items) {
      cost += item.totalCost;
    }
    
    // Add shipping costs paid to suppliers
    for (const supplierOrder of order.supplierOrders) {
      cost += supplierOrder.shippingCost;
    }
    
    const profit = revenue - cost;
    const profitMargin = (profit / revenue) * 100;
    
    return {
      revenue: parseFloat(revenue.toFixed(2)),
      cost: parseFloat(cost.toFixed(2)),
      profit: parseFloat(profit.toFixed(2)),
      profitMargin: parseFloat(profitMargin.toFixed(2)),
    };
  }

  // Generate order analytics
  static async getOrderAnalytics(
    dateRange: { startDate: string; endDate: string }
  ): Promise<{
    totalOrders: number;
    totalRevenue: number;
    totalProfit: number;
    averageOrderValue: number;
    topProducts: { productId: string; name: string; quantity: number; revenue: number }[];
    fulfillmentRate: number;
  }> {
    const orders = await OrderService.getOrders();
    
    // Filter orders by date range
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return orderDate >= startDate && orderDate <= endDate;
    });
    
    // Calculate metrics
    const totalOrders = filteredOrders.length;
    let totalRevenue = 0;
    let totalProfit = 0;
    
    // Track product performance
    interface ProductPerformance {
      productId: string;
      name: string;
      quantity: number;
      revenue: number;
    }
    const productPerformance: Record<string, ProductPerformance> = {};
    
    // Count fulfilled orders
    let fulfilledOrders = 0;
    
    for (const order of filteredOrders) {
      // Skip cancelled orders
      if (order.status === 'cancelled') continue;
      
      totalRevenue += order.total;
      
      const { profit } = OrderService.calculateOrderProfit(order);
      totalProfit += profit;
      
      // Track product performance
      for (const item of order.items) {
        if (!productPerformance[item.productId]) {
          productPerformance[item.productId] = {
            productId: item.productId,
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }
        
        productPerformance[item.productId].quantity += item.quantity;
        productPerformance[item.productId].revenue += item.totalPrice;
      }
      
      // Count fulfilled orders
      if (order.status === 'completed' || order.fulfillmentStatus === 'fulfilled') {
        fulfilledOrders++;
      }
    }
    
    // Sort products by revenue
    const topProducts = Object.values(productPerformance)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Calculate fulfillment rate
    const fulfillmentRate = totalOrders > 0 ? (fulfilledOrders / totalOrders) * 100 : 0;
    
    return {
      totalOrders,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalProfit: parseFloat(totalProfit.toFixed(2)),
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      topProducts,
      fulfillmentRate: parseFloat(fulfillmentRate.toFixed(2)),
    };
  }
}

// Sample orders for simulation
const mockOrders: Order[] = [
  {
    id: 'order-001',
    orderNumber: 'ORD-123456',
    customerId: 'cust-001',
    customerEmail: 'john.doe@example.com',
    customerName: 'John Doe',
    customerPhone: '555-123-4567',
    billingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      company: 'Acme Inc',
      addressLine1: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
      country: 'US',
      phone: '555-123-4567',
    },
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      company: 'Acme Inc',
      addressLine1: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
      country: 'US',
      phone: '555-123-4567',
    },
    items: [
      {
        id: 'item-001',
        productId: 'sp-001',
        variantId: 'spv-002',
        sku: 'STORE-GG-PHONE-001-BLK-128',
        name: 'XPhone Pro - Black / 128GB',
        quantity: 1,
        unitPrice: 569,
        unitCost: 400,
        totalPrice: 569,
        totalCost: 400,
        image: 'https://example.com/phone1.png',
        attributes: { color: 'Black', storage: '128GB' },
        taxable: true,
        taxRate: 8.5,
        taxAmount: 48.37,
        discountAmount: 0,
        fulfillmentStatus: 'fulfilled',
        supplierProductId: 'prod-001',
        supplierId: 'sup-001',
      },
      {
        id: 'item-002',
        productId: 'sp-002',
        variantId: 'spv-006',
        sku: 'STORE-GG-WATCH-001-BLK-M',
        name: 'SmartFit Watch - Black / Metal',
        quantity: 1,
        unitPrice: 219.99,
        unitCost: 150,
        totalPrice: 219.99,
        totalCost: 150,
        image: 'https://example.com/watch1.png',
        attributes: { color: 'Black', material: 'Metal' },
        taxable: true,
        taxRate: 8.5,
        taxAmount: 18.7,
        discountAmount: 0,
        fulfillmentStatus: 'fulfilled',
        supplierProductId: 'prod-002',
        supplierId: 'sup-001',
      },
    ],
    paymentInfo: {
      method: 'credit_card',
      status: 'paid',
      transactionId: 'txn-123456',
      amount: 861.06,
      paidAt: '2023-03-15T14:30:00Z',
    },
    subtotal: 788.99,
    shippingCost: 5.99,
    taxAmount: 67.07,
    discountAmount: 0,
    total: 862.05,
    currency: 'USD',
    status: 'completed',
    fulfillmentStatus: 'fulfilled',
    notes: 'Customer requested gift wrapping',
    tags: ['phone', 'watch'],
    createdAt: '2023-03-15T14:15:00Z',
    updatedAt: '2023-03-15T16:45:00Z',
    completedAt: '2023-03-20T10:30:00Z',
    supplierOrders: [
      {
        id: 'order-001',
        supplierId: 'sup-001',
        supplierName: 'Global Gadgets Supply',
        items: [
          {
            orderItemId: 'item-001',
            quantity: 1,
          },
          {
            orderItemId: 'item-002',
            quantity: 1,
          },
        ],
        status: 'delivered',
        createdAt: '2023-03-15T14:35:00Z',
        trackingNumber: 'TRACK123456789',
        trackingUrl: 'https://example.com/track/TRACK123456789',
        shippingMethod: 'Standard Shipping',
        shippingCost: 12.50,
      },
    ],
    shippingMethod: 'Standard Shipping',
    estimatedDeliveryDate: '2023-03-22T00:00:00Z',
    source: 'website',
  },
  {
    id: 'order-002',
    orderNumber: 'ORD-654321',
    customerId: 'cust-002',
    customerEmail: 'jane.smith@example.com',
    customerName: 'Jane Smith',
    customerPhone: '555-987-6543',
    billingAddress: {
      firstName: 'Jane',
      lastName: 'Smith',
      addressLine1: '456 Oak Ave',
      addressLine2: 'Apt 301',
      city: 'Other City',
      state: 'NY',
      postalCode: '54321',
      country: 'US',
      phone: '555-987-6543',
    },
    shippingAddress: {
      firstName: 'Jane',
      lastName: 'Smith',
      addressLine1: '456 Oak Ave',
      addressLine2: 'Apt 301',
      city: 'Other City',
      state: 'NY',
      postalCode: '54321',
      country: 'US',
      phone: '555-987-6543',
    },
    items: [
      {
        id: 'item-003',
        productId: 'sp-001',
        variantId: 'spv-003',
        sku: 'STORE-GG-PHONE-001-BLU-64',
        name: 'XPhone Pro - Blue / 64GB',
        quantity: 1,
        unitPrice: 499,
        unitCost: 350,
        totalPrice: 499,
        totalCost: 350,
        image: 'https://example.com/phone2.png',
        attributes: { color: 'Blue', storage: '64GB' },
        taxable: true,
        taxRate: 8.5,
        taxAmount: 42.42,
        discountAmount: 50,
        fulfillmentStatus: 'unfulfilled',
        supplierProductId: 'prod-001',
        supplierId: 'sup-001',
      },
    ],
    paymentInfo: {
      method: 'paypal',
      status: 'paid',
      transactionId: 'txn-654321',
      amount: 504.41,
      paidAt: '2023-03-18T10:15:00Z',
    },
    subtotal: 499,
    shippingCost: 12.99,
    taxAmount: 42.42,
    discountAmount: 50,
    total: 504.41,
    currency: 'USD',
    status: 'processing',
    fulfillmentStatus: 'unfulfilled',
    tags: ['phone'],
    createdAt: '2023-03-18T10:00:00Z',
    updatedAt: '2023-03-18T10:20:00Z',
    supplierOrders: [
      {
        id: 'order-003',
        supplierId: 'sup-001',
        supplierName: 'Global Gadgets Supply',
        items: [
          {
            orderItemId: 'item-003',
            quantity: 1,
          },
        ],
        status: 'processing',
        createdAt: '2023-03-18T10:25:00Z',
        shippingMethod: 'Express Shipping',
        shippingCost: 15.00,
      },
    ],
    shippingMethod: 'Express Shipping',
    estimatedDeliveryDate: '2023-03-22T00:00:00Z',
    source: 'mobile',
    discountCodes: ['WELCOME10'],
  },
]; 