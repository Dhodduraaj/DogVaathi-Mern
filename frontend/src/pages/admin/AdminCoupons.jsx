import React, { useEffect, useState } from "react";
import api from "../../utils/axios.js";
import toast from "react-hot-toast";

const emptyForm = {
  code: "",
  discountType: "percentage",
  discountAmount: "",
  minPurchase: 0,
  expiryDate: "",
  usageLimit: "",
};

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const res = await api.get("/coupons");
      setCoupons(res.data);
    } catch (err) {
      toast.error("Failed to load coupons");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/coupons", form);
      toast.success("Coupon created");
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success("Deleted");
      load();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="w-full space-y-6 text-lg">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">Coupon Management</h1>
        <p className="text-lg text-slate-300">Create and manage discount codes.</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 md:grid-cols-3"
      >
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Coupon Code</label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            placeholder="e.g. SAVE10"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Type</label>
          <select
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Value</label>
          <input
            name="discountAmount"
            type="number"
            value={form.discountAmount}
            onChange={handleChange}
            required
            placeholder="10 or 500"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Min Purchase (₹)</label>
          <input
            name="minPurchase"
            type="number"
            value={form.minPurchase}
            onChange={handleChange}
            placeholder="0"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Expiry Date</label>
          <input
            name="expiryDate"
            type="date"
            value={form.expiryDate}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Usage Limit (optional)</label>
          <input
            name="usageLimit"
            type="number"
            value={form.usageLimit}
            onChange={handleChange}
            placeholder="Unlimited"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
          />
        </div>
        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 py-2 text-xs disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Coupon"}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/50 text-slate-100 uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Discount</th>
              <th className="px-6 py-4">Min Spend</th>
              <th className="px-6 py-4">Expiry</th>
              <th className="px-6 py-4">Usage</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {coupons.map((c) => (
              <tr key={c._id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-black tracking-widest text-brand-400">{c.code}</td>
                <td className="px-6 py-4">
                  {c.discountType === "percentage" ? `${c.discountAmount}%` : `₹${c.discountAmount}`}
                </td>
                <td className="px-6 py-4 text-slate-400">₹{c.minPurchase}</td>
                <td className="px-6 py-4">
                  {new Date(c.expiryDate).toLocaleDateString()}
                  {new Date(c.expiryDate) < new Date() && (
                    <span className="ml-2 text-[10px] text-red-500 font-bold uppercase">Expired</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {c.usedCount} / {c.usageLimit || "∞"}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="font-bold text-red-500 hover:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                  No coupons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCoupons;
