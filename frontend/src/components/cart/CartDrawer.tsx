import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Tag, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export const CartDrawer: React.FC = () => {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    subtotal, 
    discount, 
    couponCode, 
    applyCoupon, 
    removeCoupon, 
    shippingFee, 
    total, 
    isCartDrawerOpen, 
    closeCart 
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 50000;
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    if (res.success) {
      showToast(res.message, 'success');
      setInputCoupon('');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    closeCart();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Slide-out Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-[#166534] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <h3 className="font-bold text-base">Your Shopping Cart ({items.length})</h3>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-lg hover:bg-green-800 text-green-200 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-green-50 p-3.5 border-b border-green-100">
            <div className="flex items-center justify-between text-xs font-semibold text-green-950 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#15803D]" />
                {remainingForFreeShipping > 0 ? (
                  <span>
                    Add <strong>৳{remainingForFreeShipping.toLocaleString('en-BD')}</strong> more for Free Delivery
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    You qualify for Free Nationwide Delivery!
                  </span>
                )}
              </span>
              <span className="text-green-700">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-green-200/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#15803D] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-700 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-gray-800 text-base">Your cart is empty</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Explore our high-efficiency solar panels, hybrid inverters, and electrical components.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="mt-4 px-5 py-2 rounded-lg bg-[#15803D] text-white text-xs font-semibold hover:bg-[#166534] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-3.5 flex gap-3 group">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0 bg-gray-50"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/solar-panel.svg';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight">
                      {item.product.name}
                    </h5>
                    <div className="text-[11px] text-gray-400 mt-0.5">{item.product.brand}</div>
                    
                    <div className="mt-2 flex items-center justify-between">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-gray-200 rounded-md bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 text-gray-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 text-gray-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Subtotal & Delete button */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-[#166534]">
                          ৳{(item.product.price * item.quantity).toLocaleString('en-BD')}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-gray-300 hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations & Action Buttons */}
          {items.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
              {/* Coupon Form */}
              {couponCode ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon "{couponCode}" applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Coupon code (e.g. BDSOLAR5)"
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg uppercase placeholder:normal-case focus:outline-none focus:border-[#15803D]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ৳{subtotal.toLocaleString('en-BD')}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-semibold">
                      -৳{discount.toLocaleString('en-BD')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold text-gray-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `৳${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-[#166534] text-base font-black">
                    ৳{total.toLocaleString('en-BD')}
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3 bg-[#15803D] hover:bg-[#166534] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-green-700/20 flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleViewCartClick}
                  className="w-full py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl transition-colors"
                >
                  View Full Cart & Edit Items
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
