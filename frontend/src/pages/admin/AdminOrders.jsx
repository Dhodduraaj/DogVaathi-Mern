import React, { useEffect, useState } from "react";
import api from "../../utils/axios.js";
import toast from "react-hot-toast";

const statusOptions = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const res = await api.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    toast.success("Status updated");
    load();
  };

  return (
    <div className="w-full space-y-6 text-xs animate-fade-in">
      <header className="animate-slide-up">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Orders
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Monitor and update all customer orders.
        </p>
      </header>
      <div className="space-y-3">
        {orders.map((order, index) => (
          <div
            key={order._id}
            className={`rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60 animate-slide-up`}
            style={{ animationDelay: `${index * 50}ms` }}
          >

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {order.user?.name} • {order.user?.email}
                </p>
                <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded bg-slate-200 px-1.5 py-0.5 dark:bg-slate-700">
                    {order.paymentMethod || "—"}
                  </span>
                  <span className="rounded bg-slate-200 px-1.5 py-0.5 dark:bg-slate-700">
                    Pay: {order.paymentStatus ?? "Pending"}
                  </span>
                </div>
              </div>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="rounded-full border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-800 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <ul className="mt-2 space-y-1">
              {order.items?.map((item, idx) => (
                <li
                  key={item.product?._id || idx}
                  className="flex justify-between text-slate-700 dark:text-slate-300"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹ {(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-right text-lg font-semibold text-brand-500 dark:text-brand-400">
              Total: ₹ {order.totalAmount?.toFixed(2)}
            </p>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No orders yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

