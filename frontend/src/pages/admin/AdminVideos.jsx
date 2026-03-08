import React, { useEffect, useState } from "react";
import api from "../../utils/axios.js";
import toast from "react-hot-toast";

const emptyForm = {
  title: "",
  platform: "instagram",
  url: "",
  thumbnailUrl: "",
};

const AdminVideos = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const res = await api.get("/admin/videos");
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
        await api.put(`/admin/videos/${editingId}`, form);
        toast.success("Video updated");
        setEditingId(null);
      } else {
        await api.post("/admin/videos", form);
        toast.success("Video added");
      }
      setForm(emptyForm);
      load();
    } catch {
      toast.error("Save failed");
    }
  };

  const handleEdit = (v) => {
    setForm({
      title: v.title,
      platform: v.platform || "instagram",
      url: v.url,
      thumbnailUrl: v.thumbnailUrl || "",
    });
    setEditingId(v._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this video?")) return;
    try {
      await api.delete(`/admin/videos/${id}`);
      toast.success("Video deleted");
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
        <h1 className="text-2xl font-semibold text-slate-50">Videos</h1>
        <p className="text-sm text-slate-300">
          Add portfolio videos. Use the video embed URL (e.g. Instagram). For thumbnails, upload an image to Cloudinary and paste the URL.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
      >
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
          <label className="text-xs text-slate-300">Platform</label>
          <input
            name="platform"
            value={form.platform}
            onChange={handleChange}
            placeholder="e.g. instagram, youtube"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Video URL (required)</label>
          <input
            name="url"
            value={form.url}
            onChange={handleChange}
            required
            placeholder="https://www.instagram.com/reel/... or embed URL"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Thumbnail URL (optional)</label>
          <input
            name="thumbnailUrl"
            value={form.thumbnailUrl}
            onChange={handleChange}
            placeholder="https://res.cloudinary.com/... or any image URL"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary px-4 py-2 text-xs">
            {editingId ? "Update" : "Add"} video
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="rounded-lg border border-slate-600 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2 text-xs">
        {items.map((v) => (
          <div
            key={v._id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3"
          >
            <div className="flex items-center gap-3">
              {v.thumbnailUrl ? (
                <img
                  src={v.thumbnailUrl}
                  alt={v.title}
                  className="h-12 w-20 rounded object-cover"
                />
              ) : (
                <div className="h-12 w-20 rounded bg-slate-700" />
              )}
              <div>
                <p className="font-semibold text-slate-100">{v.title}</p>
                <p className="text-[11px] text-slate-400">{v.platform}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleEdit(v)}
                className="rounded border border-slate-600 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-800"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(v._id)}
                className="rounded border border-red-800 px-2 py-1 text-[11px] text-red-400 hover:bg-red-900/30"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-slate-400">No videos yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminVideos;
