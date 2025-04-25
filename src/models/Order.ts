export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  billingAddress: Address;
  shippingAddress: Address;
  items: OrderItem[];
  paymentInfo: {
    method: string;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
    amount: number;
    paidAt?: string;
  };
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  fulfillmentStatus: FulfillmentStatus;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  supplierOrders: SupplierOrderReference[];
  shippingMethod: string;
  estimatedDeliveryDate?: string;
  source: 'website' | 'mobile' | 'marketplace' | 'manual';
  discountCodes?: string[];
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  totalPrice: number;
  totalCost: number;
  image?: string;
  attributes?: Record<string, string>;
  taxable: boolean;
  taxRate?: number;
  taxAmount: number;
  discountAmount: number;
  weight?: number;
  fulfillmentStatus: FulfillmentStatus;
  supplierProductId: string;
  supplierId: string;
}

export interface SupplierOrderReference {
  id: string;
  supplierId: string;
  supplierName: string;
  items: {
    orderItemId: string;
    quantity: number;
  }[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippingMethod: string;
  shippingCost: number;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'on_hold'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'failed'
  | 'payment_pending';

export type FulfillmentStatus = 
  | 'unfulfilled'
  | 'partially_fulfilled'
  | 'fulfilled'
  | 'restocked';

export interface OrderFulfillment {
  id: string;
  orderId: string;
  items: {
    orderItemId: string;
    quantity: number;
  }[];
  trackingNumber?: string;
  trackingUrl?: string;
  shippingMethod: string;
  shippingCarrier: string;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  notes?: string;
} 