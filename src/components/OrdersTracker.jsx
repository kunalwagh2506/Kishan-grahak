import React, { useState } from 'react';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  Phone, 
  IndianRupee, 
  ShieldCheck 
} from 'lucide-react';
import { translations } from '../data/translations.js';

export function OrdersTracker({
  orders,
  onUpdateStatus,
  language,
}) {
  const t = translations[language] || translations.en;
  const [filter, setFilter] = useState('all');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'all') return true;
    return o.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            Confirmed by Farmer (तैयार हो रहा है)
          </span>
        );
      case 'dispatched':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-900 px-2.5 py-1 rounded-full text-xs font-bold">
            <Truck className="w-3.5 h-3.5 text-blue-700" />
            In Direct Transit (रवाना हो गया)
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Delivered & Paid (पहुँच गया • पूर्ण)
          </span>
        );
      default:
        return (
          <span className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full text-xs font-bold">
            Processing
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border-b-8 border-emerald-200 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-950 flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            <span>सीधे आर्डर ट्रैकिंग (Direct Farm Orders)</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-700 font-semibold mt-1">
            Real-time status of orders placed directly between farmers and consumers
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none bg-emerald-50 p-1.5 rounded-2xl border-2 border-emerald-100">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filter === 'all' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-900 hover:text-emerald-950'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('confirmed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filter === 'confirmed' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-900 hover:text-emerald-950'
            }`}
          >
            Confirmed
          </button>
          <button
            type="button"
            onClick={() => setFilter('dispatched')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filter === 'dispatched' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-900 hover:text-emerald-950'
            }`}
          >
            In Transit
          </button>
          <button
            type="button"
            onClick={() => setFilter('delivered')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              filter === 'delivered' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-900 hover:text-emerald-950'
            }`}
          >
            Delivered
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-[32px] p-12 text-center border-b-8 border-emerald-200 shadow-xl">
          <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-black text-emerald-950">No orders found in this category</h3>
          <p className="text-xs text-emerald-700 font-semibold mt-1">
            Place a direct order from the Buy Direct tab to see it tracked here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-[32px] p-5 sm:p-6 border-2 border-emerald-100 border-b-8 border-b-emerald-200 shadow-xl hover:border-emerald-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-black text-emerald-950 text-base">
                    Order #{order.id}
                  </span>
                  <span className="text-xs text-stone-400">•</span>
                  <span className="text-xs text-stone-500 font-bold">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Produce & Price */}
                <div className="bg-emerald-50/70 p-4 rounded-2xl border-2 border-emerald-100 shadow-sm">
                  <span className="text-[11px] font-black text-emerald-700 block mb-1 uppercase tracking-wider">
                    Crop & Value
                  </span>
                  <div className="font-black text-emerald-950 text-sm">
                    {order.cropName}
                  </div>
                  <div className="text-stone-700 mt-1 font-medium">
                    Quantity: <strong className="text-emerald-950 font-black">{order.quantity} {order.unit}</strong> (@ ₹{order.unitPrice}/{order.unit})
                  </div>
                  <div className="mt-2 text-emerald-800 font-black text-base flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    <span>Total: ₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Farmer Info */}
                <div className="bg-emerald-50/70 p-4 rounded-2xl border-2 border-emerald-100 shadow-sm">
                  <span className="text-[11px] font-black text-emerald-700 block mb-1 uppercase tracking-wider">
                    Farmer (उत्पादक किसान)
                  </span>
                  <div className="font-black text-emerald-950 text-sm flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{order.farmerName}</span>
                  </div>
                  <div className="text-stone-700 mt-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <a href={`tel:${order.farmerPhone}`} className="hover:underline font-bold">
                      {order.farmerPhone}
                    </a>
                  </div>
                  <div className="mt-2 text-[11px] text-stone-500 font-medium">
                    Payment: <strong className="text-emerald-950 font-black">{order.paymentMode}</strong>
                  </div>
                </div>

                {/* Buyer Info & Delivery */}
                <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-100 shadow-sm">
                  <span className="text-[11px] font-black text-amber-800 block mb-1 uppercase tracking-wider">
                    Buyer & Delivery
                  </span>
                  <div className="font-black text-amber-950 text-sm">
                    {order.buyerName}
                  </div>
                  <div className="text-stone-700 text-[11px] mt-0.5 font-medium">
                    {order.buyerType} • {order.buyerPhone}
                  </div>
                  <div className="mt-1.5 text-[11px] text-stone-600 flex items-start gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{order.buyerAddress}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-100">
                <div className="text-xs text-stone-500 flex items-center gap-1.5 font-medium">
                  <Truck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Delivery Method: <strong className="text-emerald-950 font-black">{order.deliveryType}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  {order.status === 'confirmed' && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(order.id, 'dispatched')}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-sm cursor-pointer"
                    >
                      Mark Dispatched (रवाना करें)
                    </button>
                  )}
                  {order.status === 'dispatched' && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(order.id, 'delivered')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-sm cursor-pointer"
                    >
                      Mark Delivered & Settled (डिलीवर हो गया)
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <span className="text-xs font-black text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Settled directly to Farmer
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
