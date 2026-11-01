import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  LogOut, 
  ShieldCheck, 
  Plus, 
  Phone,
  Mail,
  Truck,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { Order, CustomerAddress } from '../types';
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

const MAX_ADDRESSES = 2;

export const AccountPage: React.FC = () => {
  const { user, logout, setIsAuthModalOpen, saveAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);

  // Address Modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [formFullName, setFormFullName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDivision, setFormDivision] = useState('Dhaka');
  const [formDistrict, setFormDistrict] = useState('Dhaka');
  const [formThana, setFormThana] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formPostalCode, setFormPostalCode] = useState('');
  const [formIsDefault, setFormIsDefault] = useState(false);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  useEffect(() => {
    orderService.fetchRemoteOrders().then((remote) => {
      if (remote && remote.length > 0) {
        setOrders(remote);
      } else {
        setOrders(orderService.getOrders());
      }
    });
  }, []);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-100 text-[#15803D] flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Sign In to Your Account</h2>
        <p className="text-xs text-gray-500">
          Sign in to view your orders, saved addresses, and track real-time delivery status.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          Sign In / Register Account
        </button>
      </div>
    );
  }

  const savedAddresses = user.savedAddresses || [];

  const handleOpenAddModal = () => {
    if (savedAddresses.length >= MAX_ADDRESSES) {
      showToast('Maximum of 2 addresses allowed. Please edit or delete an existing address.', 'error');
      return;
    }
    setEditingAddressId(null);
    setFormFullName(user.name || '');
    setFormPhone(user.phone || '');
    setFormDivision('Dhaka');
    setFormDistrict('Dhaka');
    setFormThana('');
    setFormAddress('');
    setFormPostalCode('');
    setFormIsDefault(savedAddresses.length === 0);
    setShowAddressModal(true);
  };

  const handleOpenEditModal = (addr: CustomerAddress) => {
    setEditingAddressId(addr.id || null);
    setFormFullName(addr.fullName || user.name || '');
    setFormPhone(addr.phone || '');
    setFormDivision(addr.division || 'Dhaka');
    setFormDistrict(addr.district || 'Dhaka');
    setFormThana(addr.thanaArea || '');
    setFormAddress(addr.fullAddress || '');
    setFormPostalCode(addr.postalCode || '');
    setFormIsDefault(!!addr.isDefault);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (addrId?: string) => {
    if (!addrId) return;
    try {
      await deleteAddress(addrId);
      showToast('Address deleted successfully.', 'info');
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete address.', 'error');
    }
  };

  const handleSetDefault = async (addrId?: string) => {
    if (!addrId) return;
    try {
      await setDefaultAddress(addrId);
      showToast('Default delivery address updated.', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to set default address.', 'error');
    }
  };

  const handleSaveAddressForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullName.trim() || !formPhone.trim() || !formAddress.trim() || !formThana.trim() || !formDistrict.trim()) {
      showToast('Please fill in all required address fields.', 'error');
      return;
    }

    if (!editingAddressId && savedAddresses.length >= MAX_ADDRESSES) {
      showToast('You can only save up to 2 addresses.', 'error');
      return;
    }

    setIsSubmittingAddress(true);
    try {
      await saveAddress({
        id: editingAddressId || undefined,
        fullName: formFullName.trim(),
        phone: formPhone.trim(),
        division: formDivision,
        district: formDistrict.trim(),
        thanaArea: formThana.trim(),
        fullAddress: formAddress.trim(),
        postalCode: formPostalCode.trim(),
        isDefault: formIsDefault,
      });

      showToast(
        editingAddressId ? 'Address updated successfully.' : 'New delivery address saved.',
        'success'
      );
      setShowAddressModal(false);
    } catch (err: any) {
      showToast(err?.message || 'Failed to save address.', 'error');
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'My Account' }]} />

      {/* Account Overview Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F0FDF4] text-[#16A34A] border border-green-200 font-black text-2xl flex items-center justify-center shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] text-xs font-bold uppercase border border-green-200">
                Customer
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{user.phone}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{user.email}</span>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-700 text-sm font-semibold rounded-xl transition-colors flex items-center gap-1.5 self-start md:self-center"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Navigation (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-between ${
              activeTab === 'orders'
                ? 'bg-[#F0FDF4] text-[#16A34A] border border-green-200'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-[#16A34A]" />
              <span>Orders & Tracking</span>
            </div>
            <span className="text-xs bg-green-100 text-green-900 px-2 py-0.5 rounded-full font-bold">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-between ${
              activeTab === 'addresses'
                ? 'bg-[#F0FDF4] text-[#16A34A] border border-green-200'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#16A34A]" />
              <span>Saved Addresses</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              savedAddresses.length >= MAX_ADDRESSES
                ? 'bg-amber-100 text-amber-900'
                : 'bg-green-100 text-green-900'
            }`}>
              {savedAddresses.length}/{MAX_ADDRESSES}
            </span>
          </button>

          <Link
            to="/wishlist"
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
          >
            <Heart className="w-4 h-4 text-[#16A34A]" />
            <span>Saved Wishlist</span>
          </Link>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors flex items-center gap-3 ${
              activeTab === 'profile'
                ? 'bg-[#F0FDF4] text-[#16A34A] border border-green-200'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <User className="w-4 h-4 text-[#16A34A]" />
            <span>Profile Settings</span>
          </button>
        </div>

        {/* Right Content Area (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 p-4 sm:p-8 shadow-xs">
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-5">
              <h3 className="font-bold text-base text-gray-900">
                Order History & Live Status
              </h3>

              {orders.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs sm:text-sm">
                  No orders found. When you purchase solar panels or equipment, they will appear here.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 sm:p-5 rounded-xl border border-gray-200 hover:border-green-200 transition-colors space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 text-xs sm:text-sm">
                        <div>
                          <span className="font-bold text-gray-900 text-sm sm:text-base">#{ord.orderNumber}</span>
                          <span className="text-gray-500 text-xs block">
                            Placed on {new Date(ord.createdAt).toLocaleDateString('en-GB')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                              ord.status === 'DELIVERED'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : ord.status === 'SHIPPED'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-green-50 text-green-700 border border-green-200'
                            }`}
                          >
                            {ord.status}
                          </span>
                          <Link
                            to={`/order-confirmation/${ord.orderNumber}`}
                            className="text-[#16A34A] hover:text-[#15803D] font-semibold text-xs sm:text-sm transition-colors"
                          >
                            View Invoice &rarr;
                          </Link>
                        </div>
                      </div>

                      {/* Item Snippets */}
                      <div className="space-y-2">
                        {ord.items.map((it, i) => (
                          <div key={i} className="flex items-center justify-between text-xs sm:text-sm">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={it.image}
                                alt={it.name}
                                className="w-9 h-9 rounded-md object-cover border border-gray-200 shrink-0"
                                onError={(e) => {
                                   const target = e.target as HTMLImageElement;
                                   target.onerror = null;
                                   target.src = '/images/solar-panel.svg';
                                }}
                              />
                              <span className="text-gray-800 line-clamp-1">{it.name}</span>
                              <span className="text-gray-400">x{it.quantity}</span>
                            </div>
                            <Price
                              amount={it.subtotal}
                              className="font-semibold text-[#16A34A]"
                              symbolClassName="text-[#16A34A]"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Footer Total & Courier Tracking */}
                      <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                        <div className="text-gray-500 flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-[#16A34A]" />
                          <span>Courier: {ord.courierName} ({ord.trackingNumber})</span>
                        </div>
                        <div className="font-bold text-sm sm:text-base text-gray-900 flex items-baseline gap-1">
                          <span>Total:</span>
                          <Price
                            amount={ord.total}
                            className="text-[#16A34A] font-bold"
                            symbolClassName="text-[#16A34A]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESSES (MAX 2 ADDRESSES LIMIT) */}
          {activeTab === 'addresses' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                    <span>Saved Delivery Addresses</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#F0FDF4] text-[#16A34A] border border-green-200">
                      {savedAddresses.length} of {MAX_ADDRESSES} Saved
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    You can save up to 2 addresses (e.g. Home & Office). Select one during checkout.
                  </p>
                </div>

                {savedAddresses.length < MAX_ADDRESSES ? (
                  <button
                    onClick={handleOpenAddModal}
                    className="px-3.5 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address ({savedAddresses.length}/{MAX_ADDRESSES})</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 font-semibold">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Limit reached (2 of 2)</span>
                  </div>
                )}
              </div>

              {/* Informational banner when 2 addresses reached */}
              {savedAddresses.length >= MAX_ADDRESSES && (
                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Address Limit:</strong> You have reached the maximum of 2 saved addresses. To change an address, please click <strong>Edit</strong> on an existing address or <strong>Delete</strong> one to free up a slot.
                  </p>
                </div>
              )}

              {/* Addresses List */}
              {savedAddresses.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-green-50 text-[#16A34A] flex items-center justify-center mx-auto">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">No Saved Addresses Yet</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Save up to 2 delivery addresses to enable 1-click address selection during checkout.
                  </p>
                  <button
                    onClick={handleOpenAddModal}
                    className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl transition-colors shadow-sm inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First Address (Slot 1 of 2)</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedAddresses.map((addr, idx) => (
                    <div
                      key={addr.id || idx}
                      className={`p-4 rounded-2xl border-2 transition-all space-y-3 flex flex-col justify-between ${
                        addr.isDefault
                          ? 'border-[#16A34A] bg-[#F0FDF4]/40 shadow-xs'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="space-y-1.5 text-xs sm:text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs uppercase tracking-wider text-gray-500">
                            Address {idx + 1}
                          </span>
                          {addr.isDefault ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#16A34A] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Default</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSetDefault(addr.id)}
                              className="text-[11px] text-[#16A34A] hover:underline font-semibold"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>

                        <div className="font-bold text-sm text-gray-900">{addr.fullName}</div>
                        <div className="text-gray-700 leading-snug">{addr.fullAddress}</div>
                        <div className="text-gray-600">
                          {addr.thanaArea}, {addr.district}, {addr.division}
                          {addr.postalCode ? ` - ${addr.postalCode}` : ''}
                        </div>
                        <div className="text-gray-500 font-mono text-xs pt-0.5">Phone: {addr.phone}</div>
                      </div>

                      {/* Card Action Controls: Edit & Delete */}
                      <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                        <button
                          onClick={() => handleOpenEditModal(addr)}
                          className="px-2.5 py-1 rounded-lg text-gray-700 hover:text-[#16A34A] hover:bg-green-50 font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="px-2.5 py-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add / Edit Address Modal Dialog */}
              {showAddressModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
                  <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                    onClick={() => !isSubmittingAddress && setShowAddressModal(false)}
                  />

                  <div className="relative bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 text-left shadow-2xl z-10 border border-gray-200">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#16A34A]" />
                        <h4 className="font-bold text-base text-gray-900">
                          {editingAddressId
                            ? 'Edit Saved Address'
                            : `Add Delivery Address (Slot ${savedAddresses.length + 1} of ${MAX_ADDRESSES})`}
                        </h4>
                      </div>
                      <button
                        onClick={() => setShowAddressModal(false)}
                        disabled={isSubmittingAddress}
                        className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveAddressForm} className="space-y-3.5 text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">
                            Recipient Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formFullName}
                            onChange={(e) => setFormFullName(e.target.value)}
                            placeholder="e.g. Tanvir Ahmed"
                            className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#16A34A]"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">
                            Contact Phone *
                          </label>
                          <input
                            type="tel"
                            required
                            value={formPhone}
                            onChange={(e) => setFormPhone(e.target.value)}
                            placeholder="+8801..."
                            className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#16A34A]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Division *</label>
                          <select
                            value={formDivision}
                            onChange={(e) => setFormDivision(e.target.value)}
                            className="w-full h-10 px-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#16A34A] cursor-pointer"
                          >
                            {BD_DIVISIONS.map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">District / City *</label>
                          <input
                            type="text"
                            required
                            value={formDistrict}
                            onChange={(e) => setFormDistrict(e.target.value)}
                            placeholder="e.g. Dhaka"
                            className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#16A34A]"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Postal Code</label>
                          <input
                            type="text"
                            value={formPostalCode}
                            onChange={(e) => setFormPostalCode(e.target.value)}
                            placeholder="e.g. 1209"
                            className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#16A34A]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Thana / Upazila / Area *</label>
                        <input
                          type="text"
                          required
                          value={formThana}
                          onChange={(e) => setFormThana(e.target.value)}
                          placeholder="e.g. Dhanmondi, Gulshan, Halishahar"
                          className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#16A34A]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Full Street Address *</label>
                        <textarea
                          rows={2}
                          required
                          value={formAddress}
                          onChange={(e) => setFormAddress(e.target.value)}
                          placeholder="House, Road number, Flat, Floor, Landmark"
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#16A34A]"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="formIsDefault"
                          checked={formIsDefault}
                          onChange={(e) => setFormIsDefault(e.target.checked)}
                          className="w-4 h-4 text-[#16A34A] rounded focus:ring-green-400 border-gray-300"
                        />
                        <label htmlFor="formIsDefault" className="text-xs text-gray-700 font-medium cursor-pointer">
                          Set as default delivery address for checkout
                        </label>
                      </div>

                      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(false)}
                          disabled={isSubmittingAddress}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingAddress}
                          className="px-5 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
                        >
                          {isSubmittingAddress ? 'Saving...' : editingAddressId ? 'Update Address' : 'Save Address'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-4 max-w-md">
              <h3 className="font-extrabold text-base text-gray-900">Personal Information</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={user.name}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Primary Phone</label>
                  <input
                    type="text"
                    disabled
                    value={user.phone}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Email Address</label>
                  <input
                    type="text"
                    disabled
                    value={user.email}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
