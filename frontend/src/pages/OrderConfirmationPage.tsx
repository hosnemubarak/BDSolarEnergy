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
import { formatBDT } from '../utils/currency';

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
          className="px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl inline-block transition-colors shadow-sm"
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
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-10 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Order Successfully Placed
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            Thank You for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-lg mx-auto">
            Your solar equipment order <strong>#{order.orderNumber}</strong> has been registered. Our logistics team will contact your phone before dispatch.
          </p>
        </div>

        {/* Interactive Order Timeline */}
        <div className="pt-6 border-t border-gray-100 max-w-2xl mx-auto">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center mx-auto font-bold text-xs shadow-sm">
                ✓
              </div>
              <span className="font-semibold text-gray-900 block text-xs">Placed</span>
              <span className="text-[11px] text-gray-400">Just Now</span>
            </div>

            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center mx-auto font-bold text-xs">
                2
              </div>
              <span className="font-semibold text-gray-700 block text-xs">Processing</span>
              <span className="text-[11px] text-gray-400">Warehouse check</span>
            </div>

            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto font-bold text-xs">
                3
              </div>
              <span className="font-medium text-gray-400 block text-xs">Shipped</span>
              <span className="text-[11px] text-gray-400">{order.courierName}</span>
            </div>

            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto font-bold text-xs">
                4
              </div>
              <span className="font-medium text-gray-400 block text-xs">Delivered</span>
              <span className="text-[11px] text-gray-400">{order.estimatedDeliveryDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              Invoice #{order.orderNumber}
            </h3>
            <div className="text-xs text-gray-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
            <span className="font-semibold text-gray-900 block text-xs sm:text-sm flex items-center gap-1.5 mb-1">
              <MapPin className="w-4 h-4 text-[#16A34A]" />
              <span>Delivery Information</span>
            </span>
            <div className="font-semibold text-gray-800">{order.shippingAddress.fullName}</div>
            <div className="text-gray-600">{order.shippingAddress.fullAddress}</div>
            <div className="text-gray-600">
              {order.shippingAddress.thanaArea}, {order.shippingAddress.district}, {order.shippingAddress.division}
            </div>
            <div className="text-gray-600 font-mono">Contact: {order.shippingAddress.phone}</div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
            <span className="font-semibold text-gray-900 block text-xs sm:text-sm flex items-center gap-1.5 mb-1">
              <CreditCard className="w-4 h-4 text-[#16A34A]" />
              <span>Payment & Courier</span>
            </span>
            <div className="text-gray-700">
              Payment Method: <strong>{order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMethod}</strong>
            </div>
            <div className="text-gray-700">
              Payment Status: <span className="font-semibold text-emerald-700">{order.paymentStatus}</span>
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
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs sm:text-sm text-left">
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
                        <div className="text-xs text-gray-400 font-mono">{item.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center text-gray-700">
                    {formatBDT(item.price)}
                  </td>
                  <td className="p-3 text-center font-bold text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="p-3 text-right font-bold text-[#16A34A]">
                    {formatBDT(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grand Total */}
        <div className="flex justify-end">
          <div className="w-full sm:w-64 space-y-1.5 text-xs sm:text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-gray-900">{formatBDT(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({order.couponCode}):</span>
                <span className="font-semibold">-{formatBDT(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span className="font-semibold text-gray-900">
                {order.shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatBDT(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total Paid:</span>
              <span className="text-[#16A34A]">{formatBDT(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/account"
            className="text-xs sm:text-sm font-semibold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1.5"
          >
            <span>View All Your Orders in Account Portal &rarr;</span>
          </Link>

          <Link
            to="/shop"
            className="px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
