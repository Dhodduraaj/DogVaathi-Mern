import React, { useEffect, useState } from "react";
import api from "../../utils/axios.js";

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm">
    <p className="text-xs text-slate-400">{label}</p>
    <p className="mt-2 text-xl font-semibold text-slate-50">{value}</p>
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
        <p className="text-sm text-slate-300">
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

