import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  Printer, 
  ArrowRight, 
  Phone, 
  ShieldCheck,
  Calendar,
  CreditCard
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderNumber) {
      const found = orderService.getOrderById(orderNumber);
      if (found) {
        setOrder(found);
      }
    }
  }, [orderNumber]);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Order Not Found</h2>
        <p className="text-xs text-gray-500">We couldn't retrieve order number {orderNumber}.</p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-[#6D28D9] text-white text-xs font-bold rounded-xl inline-block"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Shop', url: '/shop' },
          { label: 'Order Confirmation' },
        ]}
      />

      {/* Hero Success Badge */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Order Successfully Placed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            Thank You for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-lg mx-auto">
            Your solar equipment order <strong>#{order.orderNumber}</strong> has been registered. Our logistics officer will contact your phone before dispatch.
          </p>
        </div>

        {/* Demo Notification Note */}
        <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 max-w-md mx-auto">
          ⚠️ <strong>Demo Order Notice:</strong> This is a simulation. No physical payment was collected and no real courier pickup is booked.
        </div>

        {/* Interactive Order Timeline */}
        <div className="pt-6 border-t border-gray-100 max-w-2xl mx-auto">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-[#6D28D9] text-white flex items-center justify-center mx-auto font-bold text-xs shadow-sm">
                ✓
              </div>
              <span className="font-bold text-gray-900 block text-[11px]">Placed</span>
              <span className="text-[10px] text-gray-400">Just Now</span>
            </div>

            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center mx-auto font-bold text-xs">
                2
              </div>
              <span className="font-bold text-gray-700 block text-[11px]">Processing</span>
              <span className="text-[10px] text-gray-400">Warehouse check</span>
            </div>

            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto font-bold text-xs">
                3
              </div>
              <span className="font-medium text-gray-400 block text-[11px]">Shipped</span>
              <span className="text-[10px] text-gray-400">{order.courierName}</span>
            </div>

            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto font-bold text-xs">
                4
              </div>
              <span className="font-medium text-gray-400 block text-[11px]">Delivered</span>
              <span className="text-[10px] text-gray-400">{order.estimatedDeliveryDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-extrabold text-lg text-gray-900">
              Invoice #{order.orderNumber}
            </h3>
            <div className="text-xs text-gray-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
            <span className="font-bold text-gray-900 block text-xs flex items-center gap-1.5 mb-1">
              <MapPin className="w-4 h-4 text-[#6D28D9]" />
              <span>Delivery Information</span>
            </span>
            <div className="font-semibold text-gray-800">{order.shippingAddress.fullName}</div>
            <div className="text-gray-600">{order.shippingAddress.fullAddress}</div>
            <div className="text-gray-600">
              {order.shippingAddress.thanaArea}, {order.shippingAddress.district}, {order.shippingAddress.division}
            </div>
            <div className="text-gray-600 font-mono">Contact: {order.shippingAddress.phone}</div>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
            <span className="font-bold text-gray-900 block text-xs flex items-center gap-1.5 mb-1">
              <CreditCard className="w-4 h-4 text-[#6D28D9]" />
              <span>Payment & Courier</span>
            </span>
            <div className="text-gray-700">
              Payment Method: <strong>{order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMethod}</strong>
            </div>
            <div className="text-gray-700">
              Payment Status: <span className="font-bold text-emerald-700">{order.paymentStatus}</span>
            </div>
            <div className="text-gray-700">
              Designated Courier: <strong>{order.courierName}</strong>
            </div>
            <div className="text-gray-700 font-mono">
              Tracking Number: <strong>{order.trackingNumber}</strong>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3 text-center">Unit Price</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-md border border-gray-200 shrink-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/images/solar-panel.svg';
                        }}
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{item.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center text-gray-700 font-mono">
                    ৳{item.price.toLocaleString('en-BD')}
                  </td>
                  <td className="p-3 text-center font-bold text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="p-3 text-right font-bold text-purple-900">
                    ৳{item.subtotal.toLocaleString('en-BD')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grand Total */}
        <div className="flex justify-end">
          <div className="w-full sm:w-64 space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold text-gray-900">৳{order.subtotal.toLocaleString('en-BD')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({order.couponCode}):</span>
                <span className="font-bold">-৳{order.discount.toLocaleString('en-BD')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span className="font-bold text-gray-900">
                {order.shippingFee === 0 ? 'FREE' : `৳${order.shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
              <span>Total Paid:</span>
              <span className="text-[#4C1D95]">৳{order.total.toLocaleString('en-BD')}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/account"
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1.5"
          >
            <span>View All Your Orders in Account Portal &rarr;</span>
          </Link>

          <Link
            to="/shop"
            className="px-6 py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
