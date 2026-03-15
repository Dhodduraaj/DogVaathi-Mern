import React, { useEffect, useState } from "react";
import api from "../../utils/axios.js";
import toast from "react-hot-toast";

const emptyForm = {
  title: "",
  subtitle: "",
  order: 0,
};

const AdminCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const res = await api.get("/carousel/admin");
      setSlides(res.data);
    } catch (err) {
      toast.error("Failed to load slides");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("subtitle", form.subtitle);
      payload.append("order", String(form.order));
      if (imageFile) {
        payload.append("image", imageFile);
      }

      if (editingId) {
        await api.put(`/carousel/${editingId}`, payload);
        toast.success("Slide updated");
      } else {
        if (!imageFile) {
          toast.error("Image is required for new slides");
          setLoading(false);
          return;
        }
        await api.post("/carousel", payload);
        toast.success("Slide created");
      }

      setForm(emptyForm);
      setEditingId(null);
      setImageFile(null);
      setImagePreview(null);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s) => {
    setEditingId(s._id);
    setForm({
      title: s.title || "",
      subtitle: s.subtitle || "",
      order: s.order || 0,
    });
    setImagePreview(s.image.url);
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slide?")) return;
    try {
      await api.delete(`/carousel/${id}`);
      toast.success("Deleted");
      load();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const toggleActive = async (s) => {
    try {
      await api.put(`/carousel/${s._id}`, { isActive: !s.isActive });
      toast.success("Status updated");
      load();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  return (
    <div className="w-full space-y-6 text-lg">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">Carousel Management</h1>
        <p className="text-lg text-slate-300">Upload and manage homepage slider images.</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Title (Optional)</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Order</label>
            <input
              name="order"
              type="number"
              value={form.order}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Subtitle (Optional)</label>
          <input
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Slide Image</label>
          <input
            key={editingId || "new"}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 file:mr-2 file:rounded file:border-0 file:bg-brand-500 file:px-3 file:py-1 file:text-xs file:text-white"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-full rounded-lg border border-slate-700 object-cover md:w-64"
              />
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary px-8 py-2 text-xs disabled:opacity-50">
            {loading ? "Saving..." : editingId ? "Update Slide" : "Create Slide"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setImagePreview(null);
              }}
              className="rounded-full border border-slate-700 px-8 py-2 text-xs text-slate-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slides.map((s) => (
          <div
            key={s._id}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg"
          >
            <img
              src={s.image.url}
              alt={s.title}
              className="aspect-video w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-50">{s.title || "Untitled"}</p>
                  <p className="text-[10px] text-slate-400">Order: {s.order}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(s)}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      s.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {s.isActive ? "Active" : "Hidden"}
                  </button>
                </div>
              </div>
              <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(s)}
                  className="rounded-full bg-brand-500/20 px-3 py-1 text-[10px] font-bold text-brand-400 hover:bg-brand-500/40"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="rounded-full bg-red-500/20 px-3 py-1 text-[10px] font-bold text-red-400 hover:bg-red-500/40"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {slides.length === 0 && (
          <p className="col-span-full py-12 text-center text-slate-500">No slides found. Upload your first carousel image!</p>
        )}
      </div>
    </div>
  );
};

export default AdminCarousel;
