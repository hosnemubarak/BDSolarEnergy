import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Tag, 
  CheckCircle2, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const CartPage: React.FC = () => {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart,
    subtotal, 
    discount, 
    couponCode, 
    applyCoupon, 
    removeCoupon, 
    shippingFee, 
    total 
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();

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

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-purple-50 text-[#6D28D9] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Your Cart is Currently Empty</h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          You haven't added any solar panels, inverters, cables or electrical equipment to your cart yet.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-purple-600/20 inline-flex items-center gap-2"
        >
          <span>Explore Product Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />

      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          Shopping Cart ({items.length} Unique Items)
        </h1>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Free Shipping Alert Banner */}
      <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
        <div className="flex items-center justify-between text-xs font-semibold text-purple-950 mb-2">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#6D28D9]" />
            {remainingForFreeShipping > 0 ? (
              <span>
                Add <strong>৳{remainingForFreeShipping.toLocaleString('en-BD')}</strong> more to unlock <strong>Free Nationwide Delivery</strong>!
              </span>
            ) : (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Congratulations! Your order qualifies for Free Nationwide Delivery.
              </span>
            )}
          </span>
          <span className="text-purple-700 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-purple-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#6D28D9] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Cart Items (8 cols) + Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Cart Items Table/List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-6 divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-gray-200 bg-gray-50 shrink-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/solar-panel.svg';
                    }}
                  />
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                      {item.product.brand}
                    </span>
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="text-xs sm:text-sm font-bold text-gray-900 hover:text-purple-700 transition-colors block line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Unit Price: ৳{item.product.price.toLocaleString('en-BD')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 self-end sm:self-center">
                  {/* Stepper */}
                  <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item Subtotal */}
                  <div className="text-right">
                    <div className="text-sm sm:text-base font-extrabold text-[#4C1D95]">
                      ৳{(item.product.price * item.quantity).toLocaleString('en-BD')}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 text-gray-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
            <Link
              to="/shop"
              className="font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-5">
          <h3 className="font-extrabold text-gray-900 text-base border-b border-gray-100 pb-3">
            Order Summary
          </h3>

          {/* Coupon Code Section */}
          {couponCode ? (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Coupon "{couponCode}" applied</span>
              </div>
              <button
                onClick={removeCoupon}
                className="text-xs text-rose-600 hover:underline font-bold"
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
                placeholder="Coupon code (BDSOLAR5)"
                className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl uppercase placeholder:normal-case focus:outline-none focus:border-purple-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Apply
              </button>
            </form>
          )}

          {/* Price Breakdown */}
          <div className="space-y-2.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">৳{subtotal.toLocaleString('en-BD')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Promotional Discount</span>
                <span className="font-bold">-৳{discount.toLocaleString('en-BD')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="font-bold text-gray-900">
                {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `৳${shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-gray-900 pt-3 border-t border-gray-200">
              <span>Estimated Total</span>
              <span className="text-[#4C1D95] text-lg">৳{total.toLocaleString('en-BD')}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-black text-sm rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 active:scale-98"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Guaranteed Secure Demo Transaction</span>
          </div>
        </div>
      </div>
    </div>
  );
};
