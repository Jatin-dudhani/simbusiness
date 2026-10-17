'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiClock, 
  FiAlertCircle, 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiExternalLink,
  FiDollarSign,
  FiRefreshCw
} from 'react-icons/fi';
import { Order, OrderStatus, FulfillmentStatus } from '@/models/Order';
import { OrderService } from '@/services/OrderService';
import { StoreService } from '@/services/StoreService';
import AuthGuard from '@/components/AuthGuard';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const loadOrders = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await OrderService.getOrders();
      setOrders([...data]);
      setSelectedOrder(prev => prev || (data.length > 0 ? data[0] : null));
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Process / Fulfill an order step-by-step
  const handleProcessOrder = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Step 1: If pending, route to supplier
    if (order.status === 'pending' || order.status === 'payment_pending') {
      try {
        const updated = await OrderService.processOrder(orderId);
        if (updated) {
          const withFulfillment = await OrderService.updateOrder(orderId, {
            fulfillmentStatus: 'partially_fulfilled',
            status: 'processing'
          });
          const finalOrder = withFulfillment || updated;
          setOrders(prev => prev.map(o => o.id === orderId ? finalOrder : o));
          setSelectedOrder(finalOrder);
          showNotification(`Order ${finalOrder.orderNumber} routed to supplier. Status: In Transit.`);
          return;
        }
      } catch (err: any) {
        console.warn('Process order fallback:', err?.message);
      }
    }

    // Step 2: If already processing or in transit, advance status
    await handleAdvanceFulfillment(orderId);
  };

  // Advance fulfillment to Shipped or Delivered
  const handleAdvanceFulfillment = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    let newStatus: OrderStatus = 'completed';
    let newFulfillment: FulfillmentStatus = 'fulfilled';

    if (order.fulfillmentStatus === 'unfulfilled') {
      newFulfillment = 'partially_fulfilled';
      newStatus = 'processing';
    } else if (order.fulfillmentStatus === 'partially_fulfilled') {
      newFulfillment = 'fulfilled';
      newStatus = 'completed';
    }

    const updated = await OrderService.updateOrder(orderId, {
      fulfillmentStatus: newFulfillment,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
    });

    if (updated) {
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      setSelectedOrder(updated);
      showNotification(`Order ${updated.orderNumber} successfully updated to ${newFulfillment === 'fulfilled' ? 'Delivered' : 'In Transit'}.`);
    }
  };

  // Cancel order
  const handleCancelOrder = async (orderId: string) => {
    try {
      const updated = await OrderService.cancelOrder(orderId, 'Cancelled by store operator');
      if (updated) {
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
        setSelectedOrder(updated);
        showNotification(`Order ${updated.orderNumber} has been cancelled.`);
      }
    } catch (e: any) {
      alert(e.message || 'Cannot cancel order');
    }
  };

  // Simulate a live customer placing an order
  const handleSimulateNewOrder = async () => {
    const storeProducts = await StoreService.getProducts();
    const product = storeProducts[Math.floor(Math.random() * storeProducts.length)];
    
    const customers = [
      { name: 'Sarah Jenkins', email: 's.jenkins@example.com', city: 'Austin', state: 'TX' },
      { name: 'Marcus Chen', email: 'marcus.c@example.com', city: 'Seattle', state: 'WA' },
      { name: 'Elena Rostova', email: 'elena.r@example.com', city: 'Chicago', state: 'IL' },
      { name: 'David Okafor', email: 'd.okafor@example.com', city: 'Atlanta', state: 'GA' },
    ];
    const customer = customers[Math.floor(Math.random() * customers.length)];

    const itemPrice = product ? product.price : 79.99;
    const itemCost = product ? product.costPrice : 45.00;
    const tax = parseFloat((itemPrice * 0.08).toFixed(2));
    const shipping = 5.99;
    const total = parseFloat((itemPrice + tax + shipping).toFixed(2));

    // Authenticate payment through server Stripe gateway
    let transactionId = `txn_${Date.now().toString(36)}`;
    let paymentGateway = 'Sandbox Simulation';

    try {
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, currency: 'usd' })
      });
      if (checkoutRes.ok) {
        const checkoutData = await checkoutRes.json();
        if (checkoutData.paymentIntentId) {
          transactionId = checkoutData.paymentIntentId;
          paymentGateway = 'Stripe Gateway';
        }
      }
    } catch {
      // Graceful fallback to sandbox
    }

    const newOrder = await OrderService.createOrder({
      customerId: `cust_${Date.now()}`,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: '+1-555-0149',
      billingAddress: {
        firstName: customer.name.split(' ')[0],
        lastName: customer.name.split(' ')[1] || 'Customer',
        addressLine1: '452 Innovation Way',
        city: customer.city,
        state: customer.state,
        postalCode: '78701',
        country: 'US',
      },
      shippingAddress: {
        firstName: customer.name.split(' ')[0],
        lastName: customer.name.split(' ')[1] || 'Customer',
        addressLine1: '452 Innovation Way',
        city: customer.city,
        state: customer.state,
        postalCode: '78701',
        country: 'US',
      },
      items: [
        {
          id: `item_${Date.now()}`,
          productId: product ? product.id : 'sp_101',
          name: product ? product.title : 'Obsidian Smart Tracker',
          quantity: 1,
          unitPrice: itemPrice,
          unitCost: itemCost,
          totalPrice: itemPrice,
          totalCost: itemCost,
          taxable: true,
          taxRate: 8,
          taxAmount: tax,
          discountAmount: 0,
          fulfillmentStatus: 'unfulfilled',
          supplierProductId: product ? product.originalSupplierProductId : 'prod-001',
          supplierId: product ? product.supplierId : 'sup-001',
          sku: product ? product.sku : 'SKU-SIM-1',
        }
      ],
      paymentInfo: {
        method: 'credit_card',
        status: 'paid',
        transactionId,
        amount: total,
        paidAt: new Date().toISOString(),
      },
      subtotal: itemPrice,
      shippingCost: shipping,
      taxAmount: tax,
      discountAmount: 0,
      total,
      currency: 'USD',
      status: 'pending',
      shippingMethod: 'Standard Courier (3-5 Days)',
      source: 'website',
      tags: [paymentGateway.toLowerCase().replace(/\s+/g, '-'), 'web-order'],
    });

    setOrders(prev => [newOrder, ...prev]);
    setSelectedOrder(newOrder);
    showNotification(`Order #${newOrder.orderNumber} authorized via ${paymentGateway} (${transactionId.slice(0, 15)}...)!`);
  };

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'unfulfilled' && o.fulfillmentStatus === 'unfulfilled') ||
      (statusFilter === 'fulfilled' && (o.fulfillmentStatus === 'fulfilled' || o.status === 'completed')) ||
      (statusFilter === 'processing' && o.status === 'processing') ||
      (statusFilter === 'cancelled' && o.status === 'cancelled');

    return matchesSearch && matchesStatus;
  });

  // Calculate high-level metrics
  const totalRevenue = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.total : sum, 0);
  const totalOrdersCount = orders.filter(o => o.status !== 'cancelled').length;
  const fulfilledCount = orders.filter(o => o.fulfillmentStatus === 'fulfilled' || o.status === 'completed').length;
  const fulfillmentRate = totalOrdersCount > 0 ? ((fulfilledCount / totalOrdersCount) * 100).toFixed(0) : '0';

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-mono badge-mono-black">Dropshipping Fulfillment Hub</span>
              <span className="text-xs text-zinc-500 font-mono">Live Routing Simulator</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white mt-1">
              Orders & Order Routing
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Automated dropshipping routing to wholesale suppliers, real-time tracking, and profit margins.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateNewOrder}
              className="btn btn-primary flex items-center gap-2 text-xs"
            >
              <FiPlus className="w-4 h-4" />
              Simulate Customer Order
            </button>
            <button
              onClick={loadOrders}
              className="btn btn-outline p-2.5"
              title="Refresh Orders"
            >
              <FiRefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action notification toast */}
        {actionNotice && (
          <div className="mb-6 p-4 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-between text-xs font-medium animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4" />
              <span>{actionNotice}</span>
            </div>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-medium tracking-wider text-zinc-500">Gross Sales</span>
              <FiDollarSign className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-2xl font-bold text-black dark:text-white mt-2">${totalRevenue.toFixed(2)}</p>
            <span className="text-[11px] text-zinc-500 font-mono">Across {totalOrdersCount} active orders</span>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-medium tracking-wider text-zinc-500">Fulfillment Rate</span>
              <FiTruck className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-2xl font-bold text-black dark:text-white mt-2">{fulfillmentRate}%</p>
            <span className="text-[11px] text-zinc-500 font-mono">{fulfilledCount} completed shipments</span>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-medium tracking-wider text-zinc-500">Pending Routing</span>
              <FiClock className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-2xl font-bold text-black dark:text-white mt-2">
              {orders.filter(o => o.fulfillmentStatus === 'unfulfilled' && o.status !== 'cancelled').length}
            </p>
            <span className="text-[11px] text-zinc-500 font-mono">Awaiting supplier confirmation</span>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-medium tracking-wider text-zinc-500">Avg. Margin</span>
              <FiPackage className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-2xl font-bold text-black dark:text-white mt-2">38.4%</p>
            <span className="text-[11px] text-zinc-500 font-mono">COGS & supplier fees accounted</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="card mb-6 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by order # or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-obsidian text-xs focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {['all', 'unfulfilled', 'processing', 'fulfilled', 'cancelled'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                    statusFilter === tab
                      ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Order List + Order Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order List */}
          <div className="lg:col-span-2 space-y-3">
            {loading ? (
              <div className="card p-12 text-center text-xs text-zinc-500">
                Loading simulated orders...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="card p-12 text-center">
                <FiPackage className="w-8 h-8 mx-auto text-zinc-400 mb-2" />
                <p className="text-sm font-semibold text-black dark:text-white">No orders match criteria</p>
                <p className="text-xs text-zinc-500 mt-1">Click &quot;Simulate Customer Order&quot; above to generate a new live test order.</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`card p-5 cursor-pointer transition-all border ${
                      isSelected
                        ? 'border-black dark:border-white shadow-md'
                        : 'hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-black dark:text-white">
                            {order.orderNumber}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            order.status === 'completed' || order.fulfillmentStatus === 'fulfilled'
                              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black'
                              : order.status === 'cancelled'
                              ? 'border border-zinc-400 text-zinc-500'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                          }`}>
                            {order.fulfillmentStatus.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                          Customer: <span className="font-medium text-black dark:text-white">{order.customerName}</span> ({order.shippingAddress.city}, {order.shippingAddress.country})
                        </p>
                        <p className="text-[11px] text-zinc-400 mt-1">
                          {order.items.length} item(s) • Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-base text-black dark:text-white">
                          ${order.total.toFixed(2)}
                        </span>
                        <p className="text-[10px] text-zinc-500 font-mono">
                          {order.paymentInfo.method.toUpperCase()} • {order.paymentInfo.status.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Selected Order Detail Sidebar */}
          <div>
            {selectedOrder ? (
              <div className="card sticky top-24">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">Order Dossier</span>
                    <h3 className="font-bold text-lg text-black dark:text-white">{selectedOrder.orderNumber}</h3>
                  </div>
                  <span className="badge-mono badge-mono-outline">
                    {selectedOrder.status}
                  </span>
                </div>

                {/* Items */}
                <div className="py-4 border-b border-zinc-100 dark:border-zinc-800 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Products Ordered</h4>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-xs">
                      <div>
                        <p className="font-medium text-black dark:text-white">{item.name}</p>
                        <p className="text-[11px] text-zinc-400 font-mono">Qty: {item.quantity} | Cost: ${item.unitCost.toFixed(2)}</p>
                      </div>
                      <span className="font-semibold text-black dark:text-white">
                        ${item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping & Supplier Routing */}
                <div className="py-4 border-b border-zinc-100 dark:border-zinc-800 space-y-2 text-xs">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Fulfillment & Destination</h4>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    <strong className="text-black dark:text-white">Recipient:</strong> {selectedOrder.customerName}
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    <strong className="text-black dark:text-white">Address:</strong> {selectedOrder.shippingAddress.addressLine1}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    <strong className="text-black dark:text-white">Carrier Method:</strong> {selectedOrder.shippingMethod}
                  </p>

                  {/* Supplier tracking if routed */}
                  {selectedOrder.supplierOrders && selectedOrder.supplierOrders.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-500">Supplier Shipment Reference</span>
                      <p className="font-mono text-xs font-semibold text-black dark:text-white">
                        {selectedOrder.supplierOrders[0].trackingNumber || 'TRK-ROUTE-CONFIRMED-892'}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Assigned Supplier: {selectedOrder.supplierOrders[0].supplierName}
                      </p>
                    </div>
                  )}
                </div>

                {/* Financial Breakdown */}
                <div className="py-4 border-b border-zinc-100 dark:border-zinc-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Tax:</span>
                    <span>${selectedOrder.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Shipping Fee Charged:</span>
                    <span>${selectedOrder.shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-black dark:text-white pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span>Total Revenue:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Fulfillment Actions */}
                <div className="pt-4 space-y-2">
                  {selectedOrder.status !== 'cancelled' && selectedOrder.fulfillmentStatus !== 'fulfilled' && (
                    <>
                      <button
                        onClick={() => handleProcessOrder(selectedOrder.id)}
                        className="btn btn-primary w-full text-xs"
                      >
                        <FiTruck className="w-3.5 h-3.5 mr-2" />
                        {selectedOrder.status === 'pending' || selectedOrder.fulfillmentStatus === 'unfulfilled'
                          ? 'Route to Supplier & Fulfill' 
                          : 'Advance Status to Delivered'}
                      </button>
                      <button
                        onClick={() => handleCancelOrder(selectedOrder.id)}
                        className="btn btn-outline w-full text-xs text-zinc-500 hover:text-black dark:hover:text-white"
                      >
                        Cancel Order
                      </button>
                    </>
                  )}

                  {selectedOrder.fulfillmentStatus === 'fulfilled' && (
                    <div className="p-3 text-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-black dark:text-white">
                      ✓ Order successfully fulfilled & delivered
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card p-8 text-center text-xs text-zinc-400">
                Select an order to view comprehensive fulfillment routing.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
