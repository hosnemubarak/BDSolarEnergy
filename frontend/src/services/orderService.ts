import { Order, CartItem, CustomerAddress } from '../types';
import { apiClient } from './apiClient';

const ORDERS_STORAGE_KEY = 'bdsolar_orders_history_v1';

export const orderService = {
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getOrderById(id: string): Order | null {
    const orders = this.getOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  async fetchRemoteOrders(): Promise<Order[]> {
    try {
      const res: any = await apiClient('/orders/');
      const remoteOrders: Order[] = Array.isArray(res) ? res : res.results || [];
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(remoteOrders));
      return remoteOrders;
    } catch {
      return this.getOrders();
    }
  },

  async fetchRemoteOrderById(orderNumber: string): Promise<Order | null> {
    try {
      const order: Order = await apiClient(`/orders/${encodeURIComponent(orderNumber)}/`);
      return order;
    } catch {
      // Try public tracking endpoint if authenticated detail is not accessible
      try {
        const tracked: Order = await apiClient(`/orders/track/${encodeURIComponent(orderNumber)}/`);
        return tracked;
      } catch {
        return this.getOrderById(orderNumber);
      }
    }
  },

  async createOrder(params: {
    items: CartItem[];
    subtotal: number;
    discount: number;
    couponCode?: string;
    shippingFee: number;
    total: number;
    shippingAddress: CustomerAddress;
    paymentMethod: 'COD' | 'BKASH' | 'NAGAD' | 'BANK_TRANSFER';
    notes?: string;
  }): Promise<Order> {
    // Call Django REST backend endpoint: POST /api/v1/orders/
    const payload = {
      fullName: params.shippingAddress.fullName,
      phone: params.shippingAddress.phone,
      alternatePhone: params.shippingAddress.alternatePhone || '',
      division: params.shippingAddress.division,
      district: params.shippingAddress.district,
      thanaArea: params.shippingAddress.thanaArea,
      fullAddress: params.shippingAddress.fullAddress,
      postalCode: params.shippingAddress.postalCode || '',
      paymentMethod: params.paymentMethod,
      couponCode: params.couponCode || '',
      notes: params.notes || '',
      items: params.items.map((it) => ({
        productId: it.product.id,
        quantity: it.quantity,
      })),
    };

    const newOrder: Order = await apiClient('/orders/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // Cache order in local storage for account view
    const existing = orderService.getOrders();
    const updated = [newOrder, ...existing.filter((o) => o.orderNumber !== newOrder.orderNumber)];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));

    return newOrder;
  },
};
