import { Order, CartItem, CustomerAddress } from '../types';
import { apiClient, isDemoMode } from './apiClient';

const ORDERS_STORAGE_KEY = 'bdsolar_orders_history_v1';

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'BDS-2026-94812',
    createdAt: '2026-03-12T14:32:00Z',
    items: [
      {
        productId: 'prod-sp-01',
        name: 'Trina Solar Vertex S+ 585W Dual Glass Bifacial Solar Panel',
        sku: 'TS-TSM-NEG19RC.20-585',
        price: 18500,
        quantity: 4,
        image: '/images/solar-panel.svg',
        subtotal: 74000,
      },
      {
        productId: 'prod-cb-01',
        name: 'BRB Solar DC Cable 6mm² Tinned Copper (100 Meter Coil)',
        sku: 'BRB-PV-6MM2-100M-RED',
        price: 14500,
        quantity: 1,
        image: '/images/solar-cable.svg',
        subtotal: 14500,
      },
    ],
    subtotal: 88500,
    discount: 4425,
    couponCode: 'BDSOLAR5',
    shippingFee: 0,
    total: 84075,
    status: 'DELIVERED',
    paymentMethod: 'BKASH',
    paymentStatus: 'PAID',
    courierName: 'Steadfast Courier',
    trackingNumber: 'ST-BD-8821947',
    estimatedDeliveryDate: '2026-03-15',
    shippingAddress: {
      fullName: 'Md. Tanvir Hossain',
      phone: '+880 1712-345678',
      division: 'Dhaka',
      district: 'Dhaka',
      thanaArea: 'Dhanmondi, Road 27',
      fullAddress: 'House 42, Flat 5B, Road 27, Dhanmondi, Dhaka-1209',
      postalCode: '1209',
    },
  },
  {
    id: 'ord-1002',
    orderNumber: 'BDS-2026-95240',
    createdAt: '2026-04-02T09:15:00Z',
    items: [
      {
        productId: 'prod-prot-01',
        name: 'Schneider Electric Acti9 iC60N 32A Double Pole (2P) MCB',
        sku: 'SCH-A9F74232-2P-32A',
        price: 1850,
        quantity: 2,
        image: '/images/circuit-breaker.svg',
        subtotal: 3700,
      },
    ],
    subtotal: 3700,
    discount: 0,
    shippingFee: 300,
    total: 4000,
    status: 'SHIPPED',
    paymentMethod: 'COD',
    paymentStatus: 'UNPAID',
    courierName: 'Pathao Courier',
    trackingNumber: 'PTH-741920',
    estimatedDeliveryDate: '2026-04-05',
    shippingAddress: {
      fullName: 'Md. Tanvir Hossain',
      phone: '+880 1712-345678',
      division: 'Dhaka',
      district: 'Dhaka',
      thanaArea: 'Dhanmondi, Road 27',
      fullAddress: 'House 42, Flat 5B, Road 27, Dhanmondi, Dhaka-1209',
      postalCode: '1209',
    },
  },
];

export const orderService = {
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
        return INITIAL_DEMO_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  },

  getOrderById(id: string): Order | null {
    const orders = this.getOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  async fetchRemoteOrders(): Promise<Order[]> {
    if (isDemoMode()) {
      return this.getOrders();
    }
    try {
      const res: any = await apiClient('/orders/');
      const remoteOrders: Order[] = Array.isArray(res) ? res : res.results || [];
      if (remoteOrders.length > 0) {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(remoteOrders));
        return remoteOrders;
      }
      return this.getOrders();
    } catch {
      return this.getOrders();
    }
  },

  async fetchRemoteOrderById(orderNumber: string): Promise<Order | null> {
    if (isDemoMode()) {
      return this.getOrderById(orderNumber);
    }
    try {
      const order: Order = await apiClient(`/orders/${encodeURIComponent(orderNumber)}/`);
      return order;
    } catch {
      return this.getOrderById(orderNumber);
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
    if (isDemoMode()) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const orderNumber = `BDS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
          const newOrder: Order = {
            id: `ord-${Date.now()}`,
            orderNumber,
            createdAt: new Date().toISOString(),
            items: params.items.map((it) => ({
              productId: it.product.id,
              name: it.product.name,
              sku: it.product.sku,
              price: it.product.price,
              quantity: it.quantity,
              image: it.product.image,
              subtotal: it.product.price * it.quantity,
            })),
            subtotal: params.subtotal,
            discount: params.discount,
            couponCode: params.couponCode,
            shippingFee: params.shippingFee,
            total: params.total,
            status: 'CONFIRMED',
            shippingAddress: params.shippingAddress,
            paymentMethod: params.paymentMethod,
            paymentStatus: params.paymentMethod === 'COD' ? 'UNPAID' : 'PAID',
            courierName: params.shippingAddress.division.toLowerCase().includes('dhaka') ? 'Steadfast Express' : 'Sundarban Courier Service',
            trackingNumber: `BD-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
            estimatedDeliveryDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
            notes: params.notes,
          };

          const existing = orderService.getOrders();
          const updated = [newOrder, ...existing];
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));

          resolve(newOrder);
        }, 500);
      });
    }

    // Call DRF backend endpoint: POST /api/v1/orders/
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
