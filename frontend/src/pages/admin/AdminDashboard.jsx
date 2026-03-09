import React, { useEffect, useState } from "react";
import api from "../../utils/axios.js";

const StatCard = ({ label, value }) => (
  <div className="group flex flex-col justify-between rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-500 hover:shadow-brand-500/20">
    <p className="text-lg font-medium text-slate-400 transition-colors group-hover:text-slate-300">{label}</p>
    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-50 transition-colors group-hover:text-brand-400">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    };
    load();
  }, []);

  if (!stats) return null;

  return (
    <div className="w-full space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">Dashboard</h1>
        <p className="text-lg text-slate-300">
          High-level overview of products, orders, and revenue.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total products" value={stats.totalProducts} />
        <StatCard label="Total orders" value={stats.totalOrders} />
        <StatCard label="Pending orders" value={stats.pendingOrders} />
        <StatCard
          label="Total revenue (₹)"
          value={stats.totalRevenue.toFixed(2)}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

