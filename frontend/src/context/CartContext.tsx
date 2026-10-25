import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, Product } from '../types';
import { cartService } from '../services/cartService';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => { success: boolean; message: string };
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  subtotal: number;
  discount: number;
  couponCode: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  shippingFee: number;
  total: number;
  totalCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => cartService.getStoredItems());
  const [couponCode, setCouponCode] = useState<string | null>(() => cartService.getStoredCoupon());
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    cartService.saveStoredItems(items);
  }, [items]);

  useEffect(() => {
    cartService.saveStoredCoupon(couponCode);
  }, [couponCode]);

  const subtotal = useMemo(() => cartService.calculateSubtotal(items), [items]);
  const discount = useMemo(() => cartService.calculateDiscount(subtotal, couponCode), [subtotal, couponCode]);
  const shippingFee = useMemo(() => cartService.calculateShipping(subtotal), [subtotal]);
  const total = useMemo(() => Math.max(0, subtotal - discount + shippingFee), [subtotal, discount, shippingFee]);
  const totalCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const addItem = (product: Product, quantity = 1) => {
    const existingIndex = items.findIndex((i) => i.product.id === product.id);
    const currentQty = existingIndex > -1 ? items[existingIndex].quantity : 0;
    const requestedQty = currentQty + quantity;

    const validation = cartService.validateStock(product, requestedQty);
    if (!validation.valid) {
      return {
        success: false,
        message: `Only ${product.stock} units of ${product.name} are available in stock.`,
      };
    }

    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity = requestedQty;
      setItems(updated);
    } else {
      setItems([...items, { product, quantity }]);
    }

    setIsCartDrawerOpen(true);
    return { success: true, message: `Added ${product.name} to cart.` };
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return { success: true };
    }

    const item = items.find((i) => i.product.id === productId);
    if (!item) return { success: false, message: 'Item not found in cart.' };

    const validation = cartService.validateStock(item.product, quantity);
    if (!validation.valid) {
      return {
        success: false,
        message: `Maximum available demo stock is ${item.product.stock} units.`,
      };
    }

    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
    return { success: true };
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
  };

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      return { success: false, message: 'Please enter a coupon code.' };
    }
    const discountVal = cartService.calculateDiscount(subtotal, trimmed);
    if (discountVal > 0) {
      setCouponCode(trimmed);
      return {
        success: true,
        message: `Coupon "${trimmed}" applied! You saved ৳${discountVal.toLocaleString('en-BD')}.`,
      };
    }
    return {
      success: false,
      message: 'Invalid or expired coupon code. Try BDSOLAR5 or GREENBD.',
    };
  };

  const removeCoupon = () => {
    setCouponCode(null);
  };

  const openCart = () => setIsCartDrawerOpen(true);
  const closeCart = () => setIsCartDrawerOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        discount,
        couponCode,
        applyCoupon,
        removeCoupon,
        shippingFee,
        total,
        totalCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
