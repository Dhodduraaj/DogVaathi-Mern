import React, { useEffect, useState } from "react";
import api from "../../utils/axios.js";

const StatusStepper = ({ currentStatus }) => {
  const statuses = ["pending", "confirmed", "shipped", "delivered"];
  const isCancelled = currentStatus === "cancelled";
  const currentIndex = statuses.indexOf(currentStatus);

  if (isCancelled) {
    return (
      <div className="mt-4 flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-600 dark:bg-red-900/20 dark:text-red-400">
        <span className="text-[11px] font-semibold uppercase tracking-wider">Order Cancelled</span>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full">
      <div className="relative flex justify-between">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-slate-200 dark:bg-slate-700" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-brand-500 transition-all duration-500"
          style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
        />

        {statuses.map((status, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={status} className="relative z-10 flex flex-col items-center">
              <div 
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isActive 
                    ? "border-brand-500 bg-brand-500 text-white shadow-sm" 
                    : "border-slate-300 bg-white text-slate-400 dark:border-slate-600 dark:bg-slate-800"
                } ${isCurrent ? "ring-4 ring-brand-500/20" : ""}`}
              >
                {isActive ? (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                )}
              </div>
              <span 
                className={`absolute -bottom-5 whitespace-nowrap text-[10px] font-medium uppercase tracking-tighter transition-colors ${
                  isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-500 dark:text-slate-500"
                } ${isCurrent ? "font-bold" : ""}`}
              >
                {status}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-6" /> {/* Spacer for labels */}
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/orders/my");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders", err);
      }
    };
    load();
  }, []);

  return (
    <div className="w-full space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Your Orders
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Track your supplement orders and delivery status.
        </p>
      </header>

      {/* Promotional Ticker */}
      <div className="overflow-hidden rounded-xl bg-brand-500 py-3 text-white shadow-lg">
        <div className="flex animate-marquee whitespace-nowrap">
          <span className="mx-4 text-xs font-black uppercase tracking-widest">
            🎉 Use Coupon code <span className="bg-white px-2 py-0.5 text-brand-600 rounded">SAVE10</span> for 10% OFF on your next order! 🎉
          </span>
          <span className="mx-4 text-xs font-black uppercase tracking-widest">
            🎉 Use Coupon code <span className="bg-white px-2 py-0.5 text-brand-600 rounded">SAVE10</span> for 10% OFF on your next order! 🎉
          </span>
          <span className="mx-4 text-xs font-black uppercase tracking-widest">
            🎉 Use Coupon code <span className="bg-white px-2 py-0.5 text-brand-600 rounded">SAVE10</span> for 10% OFF on your next order! 🎉
          </span>
        </div>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800/50">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="text-right">
                <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {order.paymentMethod} • {order.paymentStatus}
                </span>
                <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                  order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Status Roadmap */}
            <StatusStepper currentStatus={order.status} />

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Items</h4>
                <ul className="mt-2 space-y-1.5">
                  {order.items?.map((item, idx) => (
                    <li key={item.product?._id || idx} className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                      <span>
                        {item.name} <span className="text-slate-400">× {item.quantity}</span>
                      </span>
                      <span className="font-medium">₹ {(item.price * item.quantity).toFixed(0)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col justify-end text-right">
                {order.coupon && (
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    Coupon: {order.coupon} (-₹{order.discountAmount})
                  </div>
                )}
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Amount</p>
                <p className="text-2xl font-black text-brand-500 dark:text-brand-400">
                  ₹ {order.totalAmount?.toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 118 0m-4 5v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm5.757 1.086L8 15.414M8 15.414l-2.757-2.757M8 15.414V8" />
              </svg>
            </div>
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              You haven't placed any orders yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;


