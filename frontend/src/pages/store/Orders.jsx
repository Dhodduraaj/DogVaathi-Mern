import React, { useEffect, useState } from "react";
import api from "../../utils/axios.js";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    };
    load();
  }, []);

  return (
    <div className="w-full space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Your Orders
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Track your supplement orders and delivery status.
        </p>
      </header>
      <div className="space-y-3 text-xs">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Order #{order._id.slice(-6)}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {order.paymentMethod} • {order.paymentStatus}
                </span>
                <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[11px] uppercase dark:bg-slate-700">
                  {order.status}
                </span>
              </div>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <ul className="mt-2 space-y-1 text-slate-700 dark:text-slate-300">
              {order.items?.map((item, idx) => (
                <li key={item.product?._id || idx} className="flex justify-between">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹ {(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-right text-sm font-semibold text-brand-500 dark:text-brand-400">
              Total: ₹ {order.totalAmount?.toFixed(2)}
            </p>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You have no orders yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Orders;

