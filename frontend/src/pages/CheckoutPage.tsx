import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  User, 
  Mail, 
  Info, 
  ArrowLeft,
  Lock,
  Loader2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { CustomerAddress } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

const BD_DIVISIONS = [
  'Dhaka',
  'Chittagong',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Sylhet',
  'Rangpur',
  'Mymensingh',
];

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, discount, couponCode, shippingFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form Fields
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [division, setDivision] = useState(user?.defaultAddress?.division || 'Dhaka');
  const [district, setDistrict] = useState(user?.defaultAddress?.district || 'Dhaka');
  const [thanaArea, setThanaArea] = useState(user?.defaultAddress?.thanaArea || '');
  const [fullAddress, setFullAddress] = useState(user?.defaultAddress?.fullAddress || '');
  const [postalCode, setPostalCode] = useState(user?.defaultAddress?.postalCode || '');
  
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BKASH' | 'NAGAD' | 'BANK_TRANSFER'>('COD');
  const [bkashTrxId, setBkashTrxId] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500">Please add products to your cart before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-[#6D28D9] text-white text-xs font-bold rounded-xl inline-block"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !fullAddress.trim()) {
      showToast('Please fill in your name, contact phone, and delivery address.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const shippingAddress: CustomerAddress = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        division,
        district,
        thanaArea,
        fullAddress: fullAddress.trim(),
        postalCode: postalCode.trim(),
        isDefault: true,
      };

      const createdOrder = await orderService.createOrder({
        items,
        subtotal,
        discount,
        couponCode: couponCode || undefined,
        shippingFee,
        total,
        shippingAddress,
        paymentMethod,
        notes: orderNotes.trim() || undefined,
      });

      clearCart();
      showToast('Demo order placed successfully!', 'success');
      navigate(`/order-confirmation/${createdOrder.orderNumber}`);
    } catch (err) {
      console.error('Order creation error', err);
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Cart', url: '/cart' },
          { label: 'Checkout' },
        ]}
      />

      {/* Demo Notice Banner */}
      <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between text-xs text-purple-900">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#6D28D9] shrink-0" />
          <span>
            <strong>Demo Checkout Simulation:</strong> No real bank charges or payments will occur. You can test bKash, Nagad, or Cash on Delivery freely.
          </span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Shipping & Payment Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Customer Contact Information */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4 text-[#6D28D9]" />
                <span>Customer Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mobile Number (+880...) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address (For Invoice Copy)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address (Bangladesh) */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#6D28D9]" />
                <span>Delivery Address in Bangladesh</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Division *
                  </label>
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
                  >
                    {BD_DIVISIONS.map((d) => (
                      <option key={d} value={d}>
                        {d} Division
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    District / City *
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Thana / Upazila / Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={thanaArea}
                    onChange={(e) => setThanaArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Complete Street Address (Building, Road, Flat No) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#6D28D9]" />
                <span>Select Payment Method</span>
              </h3>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`p-4 rounded-2xl border-2 flex items-start justify-between cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[#6D28D9] bg-purple-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-[#6D28D9] focus:ring-purple-400"
                    />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-gray-900">
                        Cash on Delivery (COD)
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Pay with cash upon delivery of solar equipment at your doorstep.
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Available
                  </span>
                </label>

                {/* bKash Mobile Banking Simulation */}
                <label
                  className={`p-4 rounded-2xl border-2 flex flex-col cursor-pointer transition-all ${
                    paymentMethod === 'BKASH'
                      ? 'border-[#6D28D9] bg-purple-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'BKASH'}
                        onChange={() => setPaymentMethod('BKASH')}
                        className="text-[#6D28D9] focus:ring-purple-400"
                      />
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-pink-600">
                          bKash Online Payment
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Simulate instant payment with bKash Merchant Gateway.
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                      bKash
                    </span>
                  </div>

                  {paymentMethod === 'BKASH' && (
                    <div className="mt-3 pt-3 border-t border-purple-200 text-xs space-y-2">
                      <div className="text-gray-600">
                        Demo Merchant Number: <strong className="text-gray-900">+880 1700-765270</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">TrxID:</span>
                        <input
                          type="text"
                          value={bkashTrxId}
                          onChange={(e) => setBkashTrxId(e.target.value)}
                          className="px-2.5 py-1 font-mono text-xs bg-white border border-gray-300 rounded-lg uppercase"
                        />
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          ✓ Auto-Verified Demo Trx
                        </span>
                      </div>
                    </div>
                  )}
                </label>

                {/* Nagad Mobile Banking */}
                <label
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'NAGAD'
                      ? 'border-[#6D28D9] bg-purple-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'NAGAD'}
                      onChange={() => setPaymentMethod('NAGAD')}
                      className="text-[#6D28D9] focus:ring-purple-400"
                    />
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-orange-600">
                        Nagad Digital Payment
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Fast checkout simulation using Nagad Wallet.
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    Nagad
                  </span>
                </label>
              </div>
            </div>

            {/* Step 4: Order Delivery Notes */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                Special Delivery or Rooftop Installation Instructions
              </label>
              <textarea
                rows={2}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Call before arrival, deliver to 5th floor rooftop, elevator available..."
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Right: Order Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-5">
            <div className="bg-white rounded-3xl border-2 border-purple-200 p-6 shadow-xl space-y-5">
              <h3 className="font-black text-gray-900 text-base border-b border-gray-100 pb-3">
                Order Review ({items.length} Items)
              </h3>

              {/* Items List Mini */}
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="py-2.5 flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0 bg-gray-50"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/images/solar-panel.svg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-semibold text-gray-900 truncate">
                        {item.product.name}
                      </h5>
                      <span className="text-[11px] text-gray-400">Qty: {item.quantity}</span>
                    </div>
                    <div className="text-xs font-bold text-[#4C1D95]">
                      ৳{(item.product.price * item.quantity).toLocaleString('en-BD')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-gray-600 pt-3 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">৳{subtotal.toLocaleString('en-BD')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({couponCode})</span>
                    <span className="font-bold">-৳{discount.toLocaleString('en-BD')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-gray-900">
                    {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `৳${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-[#4C1D95] text-xl font-black">
                    ৳{total.toLocaleString('en-BD')}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Demo Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirm & Place Order</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-gray-400 text-center leading-tight">
                By clicking Confirm, your order will be placed with our warehouse for delivery verification.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
