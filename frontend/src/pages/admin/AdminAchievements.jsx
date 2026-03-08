import React, { useEffect, useState } from "react";
import api from "../../utils/axios.js";
import toast from "react-hot-toast";

const emptyForm = {
  title: "",
  programName: "",
  date: "",
  description: "",
  imageUrl: "",
};

const AdminAchievements = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const res = await api.get("/admin/achievements");
    setItems(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/achievements/${editingId}`, form);
        toast.success("Achievement updated");
        setEditingId(null);
      } else {
        await api.post("/admin/achievements", form);
        toast.success("Achievement added");
      }
      setForm(emptyForm);
      load();
    } catch {
      toast.error("Save failed");
    }
  };

  const handleEdit = (a) => {
    setForm({
      title: a.title,
      programName: a.programName,
      date: a.date,
      description: a.description,
      imageUrl: a.imageUrl || "",
    });
    setEditingId(a._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this achievement?")) return;
    try {
      await api.delete(`/admin/achievements/${id}`);
      toast.success("Achievement deleted");
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="space-y-6 text-sm">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">Achievements</h1>
        <p className="text-sm text-slate-300">
          Add portfolio achievements. Upload images to Cloudinary (or any host), then paste the image URL below.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Program name</label>
            <input
              name="programName"
              value={form.programName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Date</label>
          <input
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Image URL (optional)</label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://res.cloudinary.com/... or any image URL"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary px-4 py-2 text-xs">
            {editingId ? "Update" : "Add"} achievement
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="rounded-lg border border-slate-600 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2 text-xs">
        {items.map((a) => (
          <div
            key={a._id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3"
          >
            <div className="flex items-center gap-3">
              {a.imageUrl && (
                <img
                  src={a.imageUrl}
                  alt={a.title}
                  className="h-12 w-12 rounded object-cover"
                />
              )}
              <div>
                <p className="font-semibold text-slate-100">{a.title}</p>
                <p className="text-[11px] text-slate-400">{a.programName} • {a.date}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleEdit(a)}
                className="rounded border border-slate-600 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-800"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(a._id)}
                className="rounded border border-red-800 px-2 py-1 text-[11px] text-red-400 hover:bg-red-900/30"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-slate-400">No achievements yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminAchievements;
