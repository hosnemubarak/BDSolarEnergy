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
  Clock, 
  ExternalLink,
  Phone,
  Mail,
  Truck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { Order, CustomerAddress } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const AccountPage: React.FC = () => {
  const { user, logout, setIsAuthModalOpen, saveAddress } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);

  // New Address Modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newDivision, setNewDivision] = useState('Dhaka');
  const [newDistrict, setNewDistrict] = useState('Dhaka');
  const [newThana, setNewThana] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState(user?.phone || '');

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

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim() || !newPhone.trim()) return;

    saveAddress({
      fullName: user.name,
      phone: newPhone,
      division: newDivision,
      district: newDistrict,
      thanaArea: newThana,
      fullAddress: newAddress,
      isDefault: false,
    });

    setShowAddressModal(false);
    setNewAddress('');
    setNewThana('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'My Account' }]} />

      {/* Account Overview Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F0FDF4] text-[#16A34A] border border-green-200 font-black text-2xl flex items-center justify-center">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">{user.name}</h1>
              <span className="px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] text-[10px] font-bold uppercase border border-green-200">
                Customer
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{user.phone}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>{user.email}</span>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 self-start md:self-center"
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
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
              activeTab === 'orders'
                ? 'bg-[#F0FDF4] text-[#16A34A] border border-green-200'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-[#16A34A]" />
              <span>Orders & Tracking</span>
            </div>
            <span className="text-[10px] bg-green-100 text-green-900 px-2 py-0.5 rounded-full font-bold">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-colors flex items-center gap-3 ${
              activeTab === 'addresses'
                ? 'bg-[#F0FDF4] text-[#16A34A] border border-green-200'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#16A34A]" />
            <span>Saved Addresses</span>
          </button>

          <Link
            to="/wishlist"
            className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
          >
            <Heart className="w-4 h-4 text-[#16A34A]" />
            <span>Saved Wishlist</span>
          </Link>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-colors flex items-center gap-3 ${
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
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-5">
              <h3 className="font-extrabold text-base text-gray-900">
                Order History & Live Status
              </h3>

              {orders.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">
                  No orders found. When you purchase solar panels or equipment, they will appear here.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl border border-gray-200 hover:border-green-200 transition-colors space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 text-xs">
                        <div>
                          <span className="font-black text-gray-900 text-sm">#{ord.orderNumber}</span>
                          <span className="text-gray-400 text-[11px] block">
                            Placed on {new Date(ord.createdAt).toLocaleDateString('en-GB')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                            className="text-[#16A34A] hover:text-[#15803D] font-bold text-xs transition-colors"
                          >
                            View Invoice &rarr;
                          </Link>
                        </div>
                      </div>

                      {/* Item Snippets */}
                      <div className="space-y-2">
                        {ord.items.map((it, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={it.image}
                                alt={it.name}
                                className="w-8 h-8 rounded object-cover border border-gray-200"
                                onError={(e) => {
                                   const target = e.target as HTMLImageElement;
                                   target.onerror = null;
                                   target.src = '/images/solar-panel.svg';
                                }}
                              />
                              <span className="text-gray-800 line-clamp-1">{it.name}</span>
                              <span className="text-gray-400">x{it.quantity}</span>
                            </div>
                            <span className="font-bold text-[#16A34A]">
                              ৳{it.subtotal.toLocaleString('en-BD')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Total & Courier Tracking */}
                      <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="text-gray-500 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-[#16A34A]" />
                          <span>Courier: {ord.courierName} ({ord.trackingNumber})</span>
                        </div>
                        <div className="font-black text-sm text-gray-900">
                          Total: <span className="text-[#16A34A]">৳{ord.total.toLocaleString('en-BD')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-gray-900">Saved Addresses</h3>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="px-3 py-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(user.savedAddresses || []).map((addr, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-gray-200 relative space-y-1.5 text-xs bg-gray-50/50"
                  >
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 rounded bg-[#F0FDF4] text-[#16A34A] border border-green-200 text-[10px] font-bold uppercase inline-block mb-1">
                        Default Delivery Address
                      </span>
                    )}
                    <div className="font-bold text-gray-900">{addr.fullName}</div>
                    <div className="text-gray-600">{addr.fullAddress}</div>
                    <div className="text-gray-600">
                      {addr.thanaArea}, {addr.district}, {addr.division}
                    </div>
                    <div className="text-gray-500 font-mono">Phone: {addr.phone}</div>
                  </div>
                ))}
              </div>

              {/* Add Address Modal */}
              {showAddressModal && (
                <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-gray-200 space-y-3">
                  <h4 className="font-bold text-xs text-gray-900">Add Delivery Location</h4>
                  <form onSubmit={handleSaveNewAddress} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold mb-1">Division</label>
                        <select
                          value={newDivision}
                          onChange={(e) => setNewDivision(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#16A34A]"
                        >
                          {['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet'].map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">District / City</label>
                        <input
                          type="text"
                          required
                          value={newDistrict}
                          onChange={(e) => setNewDistrict(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#16A34A]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Thana / Area</label>
                      <input
                        type="text"
                        required
                        value={newThana}
                        onChange={(e) => setNewThana(e.target.value)}
                        placeholder="e.g. Gulshan-2, Dhaka"
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#16A34A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Full Street Address</label>
                      <input
                        type="text"
                        required
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="House, Road, Apartment"
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#16A34A]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
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
                <div className="pt-2 text-[11px] text-gray-400">
                  Customer session secured via JWT authentication.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
