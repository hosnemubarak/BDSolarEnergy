import { CartItem, Product } from '../types';

const CART_STORAGE_KEY = 'bdsolar_cart_items_v1';
const APPLIED_COUPON_KEY = 'bdsolar_cart_coupon_v1';

export interface CouponDiscount {
  code: string;
  discountPercentage: number;
  maxDiscountBdt?: number;
  description: string;
}

export const VALID_COUPONS: Record<string, CouponDiscount> = {};

export const cartService = {
  getStoredItems(): CartItem[] {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveStoredItems(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('Could not persist cart to localStorage', err);
    }
  },

  getStoredCoupon(): string | null {
    try {
      return localStorage.getItem(APPLIED_COUPON_KEY);
    } catch {
      return null;
    }
  },

  saveStoredCoupon(code: string | null): void {
    try {
      if (code) {
        localStorage.setItem(APPLIED_COUPON_KEY, code);
      } else {
        localStorage.removeItem(APPLIED_COUPON_KEY);
      }
    } catch (err) {
      console.warn('Could not persist coupon', err);
    }
  },

  calculateSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },

  calculateDiscount(subtotal: number, couponCode?: string | null): number {
    if (!couponCode) return 0;
    const coupon = VALID_COUPONS[couponCode.toUpperCase()];
    if (!coupon) return 0;

    const discount = (subtotal * coupon.discountPercentage) / 100;
    if (coupon.maxDiscountBdt && discount > coupon.maxDiscountBdt) {
      return coupon.maxDiscountBdt;
    }
    return Math.round(discount);
  },

  calculateShipping(subtotal: number, division = 'Dhaka'): number {
    if (subtotal === 0) return 0;
    // Free delivery on orders 50,000 BDT or more
    if (subtotal >= 50000) return 0;
    // Inside Dhaka: 300 BDT; Outside Dhaka: 800 BDT for bulky electrical/solar equipment
    return division.toLowerCase().includes('dhaka') ? 300 : 800;
  },

  validateStock(product: Product, requestedQuantity: number): { valid: boolean; maxAllowed: number } {
    const max = Math.max(1, product.stock);
    return {
      valid: requestedQuantity <= max,
      maxAllowed: max,
    };
  },
};
