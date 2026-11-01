import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CreditCard, 
  MapPin, 
  User, 
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { CustomerAddress } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Price } from '../components/common/Price';

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
  const { user, saveAddress } = useAuth();
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
  
  // Saved addresses (up to 2) and selection state
  const savedAddresses = (user?.savedAddresses || []).slice(0, 2);
  const [selectedAddressMode, setSelectedAddressMode] = useState<'saved' | 'new'>(() =>
    savedAddresses.length > 0 ? 'saved' : 'new'
  );
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(() => {
    const defaultIdx = savedAddresses.findIndex((a) => a.isDefault);
    return defaultIdx >= 0 ? defaultIdx : 0;
  });
  const [saveNewAddressToAccount, setSaveNewAddressToAccount] = useState<boolean>(false);

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BKASH' | 'NAGAD' | 'BANK_TRANSFER'>('COD');
  const [bkashTrxId, setBkashTrxId] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500">Please add products to your cart before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl inline-block transition-colors shadow-sm"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorMessage(null);

    let shippingAddress: CustomerAddress;

    if (selectedAddressMode === 'saved' && savedAddresses[selectedAddressIndex]) {
      const chosen = savedAddresses[selectedAddressIndex];
      shippingAddress = {
        fullName: chosen.fullName || fullName.trim() || user?.name || 'Customer',
        phone: chosen.phone || phone.trim() || user?.phone || '',
        division: chosen.division,
        district: chosen.district,
        thanaArea: chosen.thanaArea,
        fullAddress: chosen.fullAddress,
        postalCode: chosen.postalCode || '',
        isDefault: !!chosen.isDefault,
      };
    } else {
      if (!fullName.trim() || !phone.trim() || !fullAddress.trim() || !district.trim() || !thanaArea.trim()) {
        const msg = 'Please fill in your name, contact phone, and complete delivery address.';
        setErrorMessage(msg);
        showToast(msg, 'error');
        return;
      }

      shippingAddress = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        division,
        district: district.trim(),
        thanaArea: thanaArea.trim(),
        fullAddress: fullAddress.trim(),
        postalCode: postalCode.trim(),
        isDefault: savedAddresses.length === 0,
      };

      // If user opted to save this address to account and has fewer than 2 saved addresses
      if (user && saveNewAddressToAccount && savedAddresses.length < 2) {
        saveAddress(shippingAddress).catch((err) =>
          console.warn('Could not auto-save address to account', err)
        );
      }
    }

    setIsSubmitting(true);

    try {
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
      showToast('Order placed successfully!', 'success');
      navigate(`/order-confirmation/${createdOrder.orderNumber}`);
    } catch (err: any) {
      console.error('Order creation error', err);
      const msg = err?.message || 'Failed to place order. Please try again.';
      setErrorMessage(msg);
      showToast(msg, 'error');
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



      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Shipping & Payment Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Customer Contact Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4 text-[#16A34A]" />
                <span>Customer Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-11 px-3.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Mobile Number (+880...) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-3.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Email Address (For Invoice Copy)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-3.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address (Bangladesh) with Address Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-gray-100">
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#16A34A]" />
                  <span>Delivery Address in Bangladesh</span>
                </h3>
                {savedAddresses.length > 0 && (
                  <span className="text-xs text-[#16A34A] font-semibold">
                    {savedAddresses.length} Saved {savedAddresses.length === 1 ? 'Address' : 'Addresses'} Available (Max 2)
                  </span>
                )}
              </div>

              {/* SAVED ADDRESSES SELECTION (UP TO 2 ADDRESSES) */}
              {savedAddresses.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-gray-600">
                    Choose delivery location for this order:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr, idx) => {
                      const isSelected = selectedAddressMode === 'saved' && selectedAddressIndex === idx;
                      return (
                        <div
                          key={addr.id || idx}
                          onClick={() => {
                            setSelectedAddressMode('saved');
                            setSelectedAddressIndex(idx);
                          }}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                            isSelected
                              ? 'border-[#16A34A] bg-[#F0FDF4] shadow-xs'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    isSelected
                                      ? 'border-[#16A34A] bg-[#16A34A]'
                                      : 'border-gray-300 bg-white'
                                  }`}
                                >
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                                <span className="font-bold text-xs text-gray-900">
                                  Address {idx + 1}
                                </span>
                              </div>

                              {addr.isDefault && (
                                <span className="px-2 py-0.5 rounded-full bg-white border border-green-200 text-[#16A34A] text-[10px] font-bold uppercase tracking-wider">
                                  Default
                                </span>
                              )}
                            </div>

                            <div className="text-xs space-y-0.5 text-gray-700 pl-6">
                              <div className="font-bold text-gray-900">{addr.fullName}</div>
                              <div className="text-gray-600 line-clamp-2">{addr.fullAddress}</div>
                              <div className="text-gray-500">
                                {addr.thanaArea}, {addr.district}, {addr.division}
                                {addr.postalCode ? ` - ${addr.postalCode}` : ''}
                              </div>
                              <div className="text-gray-500 font-mono text-[11px] pt-0.5">
                                Phone: {addr.phone}
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="mt-2.5 pt-2 border-t border-green-200/80 text-[11px] font-bold text-[#16A34A] flex items-center gap-1 pl-6">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Delivering to this address</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Option to toggle between saved address and a new delivery address */}
                  <div className="pt-1 flex items-center justify-between text-xs">
                    {selectedAddressMode === 'saved' ? (
                      <button
                        type="button"
                        onClick={() => setSelectedAddressMode('new')}
                        className="text-[#16A34A] hover:text-[#15803D] font-semibold flex items-center gap-1 hover:underline"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Deliver to a different address for this order</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedAddressMode('saved')}
                        className="text-[#16A34A] hover:text-[#15803D] font-semibold flex items-center gap-1 hover:underline"
                      >
                        <span>← Return to saved addresses ({savedAddresses.length})</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* MANUAL ADDRESS INPUT FIELDS (WHEN 'new' OR GUEST / NO SAVED ADDRESSES) */}
              {(selectedAddressMode === 'new' || savedAddresses.length === 0) && (
                <div className="space-y-4 pt-2">
                  {savedAddresses.length > 0 && (
                    <div className="text-xs font-semibold text-gray-700 pb-1 border-b border-gray-100 flex items-center justify-between">
                      <span>Enter delivery address details:</span>
                      <span className="text-gray-400 font-normal">One-time shipping address</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                        Division *
                      </label>
                      <select
                        value={division}
                        onChange={(e) => setDivision(e.target.value)}
                        className="w-full h-11 px-3.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] cursor-pointer"
                      >
                        {BD_DIVISIONS.map((d) => (
                          <option key={d} value={d}>
                            {d} Division
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                        District / City *
                      </label>
                      <input
                        type="text"
                        required
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="e.g. Chittagong, Dhaka"
                        className="w-full h-11 px-3.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g. 4000"
                        className="w-full h-11 px-3.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                        Thana / Upazila / Area *
                      </label>
                      <input
                        type="text"
                        required
                        value={thanaArea}
                        onChange={(e) => setThanaArea(e.target.value)}
                        placeholder="e.g. Jubilee Road, Kotwali, Dhanmondi"
                        className="w-full h-11 px-3.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                        Complete Street Address (Building, Road, Flat No) *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={fullAddress}
                        onChange={(e) => setFullAddress(e.target.value)}
                        placeholder="Shop No. 11-12, Floor, Road, Landmark..."
                        className="w-full p-3.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
                      />
                    </div>
                  </div>

                  {/* Option to save new address if user has slot remaining (< 2) */}
                  {user && savedAddresses.length < 2 && (
                    <div className="flex items-center gap-2 pt-1 bg-green-50/60 p-3 rounded-lg border border-green-100">
                      <input
                        type="checkbox"
                        id="saveNewAddressToAccount"
                        checked={saveNewAddressToAccount}
                        onChange={(e) => setSaveNewAddressToAccount(e.target.checked)}
                        className="w-4 h-4 text-[#16A34A] rounded focus:ring-green-400 border-gray-300"
                      />
                      <label htmlFor="saveNewAddressToAccount" className="text-xs text-gray-700 font-medium cursor-pointer">
                        Save this address to my account for future orders (Slot {savedAddresses.length + 1} of 2)
                      </label>
                    </div>
                  )}

                  {user && savedAddresses.length >= 2 && (
                    <div className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                      ℹ️ You currently have 2 saved addresses (the maximum allowed). This address will be used exclusively for this order without altering your saved addresses.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#16A34A]" />
                <span>Select Payment Method</span>
              </h3>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-start justify-between cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[#16A34A] bg-green-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-green-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-[#16A34A] focus:ring-green-400"
                    />
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-gray-900">
                        Cash on Delivery (COD)
                      </div>
                      <div className="text-xs text-gray-500">
                        Pay with cash upon delivery of solar equipment at your doorstep.
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                    Available
                  </span>
                </label>

                {/* bKash Mobile Banking Simulation */}
                <label
                  className={`p-4 rounded-xl border-2 flex flex-col cursor-pointer transition-all ${
                    paymentMethod === 'BKASH'
                      ? 'border-[#16A34A] bg-green-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-green-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'BKASH'}
                        onChange={() => setPaymentMethod('BKASH')}
                        className="text-[#16A34A] focus:ring-green-400"
                      />
                      <div>
                        <div className="font-semibold text-xs sm:text-sm text-pink-600">
                          bKash Online Payment
                        </div>
                        <div className="text-xs text-gray-500">
                          Send payment to bKash Merchant Gateway and enter Transaction ID.
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-md border border-pink-200">
                      bKash
                    </span>
                  </div>

                  {paymentMethod === 'BKASH' && (
                    <div className="mt-3 pt-3 border-t border-green-200 text-xs sm:text-sm space-y-2">
                      <div className="text-gray-600">
                        Merchant Number: <strong className="text-gray-900 font-semibold">+880 1833-994455</strong>
                      </div>
                      <div className="flex flex-col min-[380px]:flex-row min-[380px]:items-center gap-2">
                        <span className="text-gray-500 text-xs shrink-0">TrxID:</span>
                        <input
                          type="text"
                          value={bkashTrxId}
                          onChange={(e) => setBkashTrxId(e.target.value)}
                          placeholder="e.g. 9J4K2L8M"
                          className="h-9 px-3 font-mono text-xs sm:text-sm bg-white border border-gray-300 rounded-lg uppercase focus:outline-none focus:border-[#16A34A]"
                        />
                      </div>
                    </div>
                  )}
                </label>

                {/* Nagad Mobile Banking */}
                <label
                  className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'NAGAD'
                      ? 'border-[#16A34A] bg-green-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-green-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'NAGAD'}
                      onChange={() => setPaymentMethod('NAGAD')}
                      className="text-[#16A34A] focus:ring-green-400"
                    />
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-orange-600">
                        Nagad Digital Payment
                      </div>
                      <div className="text-xs text-gray-500">
                        Fast payment using Nagad Wallet.
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
                    Nagad
                  </span>
                </label>
              </div>
            </div>

            {/* Step 4: Order Delivery Notes */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                Special Delivery or Rooftop Installation Instructions
              </label>
              <textarea
                rows={2}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Call before arrival, deliver to 5th floor rooftop, elevator available..."
                className="w-full p-3.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
              />
            </div>
          </div>

          {/* Right: Order Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-5">
            <div className="bg-white rounded-xl border-2 border-green-200 p-4 sm:p-6 shadow-sm space-y-5">
              <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">
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
                      <h5 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                        {item.product.name}
                      </h5>
                      <span className="text-xs sm:text-sm text-gray-500">Qty: {item.quantity}</span>
                    </div>
                    <Price
                      amount={item.product.price * item.quantity}
                      className="text-xs sm:text-sm font-bold text-[#16A34A]"
                      symbolClassName="text-[#16A34A]"
                    />
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-sm text-gray-600 pt-3 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <Price amount={subtotal} className="font-semibold text-gray-900" />
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({couponCode})</span>
                    <span className="font-semibold text-emerald-700 inline-flex items-baseline gap-0.5">
                      <span>-</span>
                      <Price amount={discount} className="font-semibold text-emerald-700" />
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-gray-900">
                    {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : <Price amount={shippingFee} className="font-semibold text-gray-900" />}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total Amount</span>
                  <Price
                    amount={total}
                    className="text-[#16A34A] text-xl font-bold"
                    symbolClassName="text-2xl text-[#16A34A]"
                  />
                </div>
              </div>

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-sm sm:text-base rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirm & Place Order</span>
                  </>
                )}
              </button>

              <div className="text-xs text-gray-500 text-center leading-tight">
                By clicking Confirm, your order will be placed with our warehouse for delivery verification.
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
