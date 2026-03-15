import React, { useEffect, useState } from "react";
import api from "../../utils/axios.js";
import toast from "react-hot-toast";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [arModelFile, setArModelFile] = useState(null);

  const load = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
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
        toast.error("Please select an image file (JPEG, PNG, etc.)");
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
    try {
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("description", form.description);
      payload.append("price", String(form.price));
      payload.append("category", form.category);
      payload.append("stock", String(form.stock));
      if (imageFile) {
        payload.append("image", imageFile);
      }
      if (arModelFile) {
        payload.append("arModelFile", arModelFile);
      }

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      setForm(emptyForm);
      setEditingId(null);
      setImageFile(null);
      setImagePreview(null);
      setArModelFile(null);
      load();
    } catch (err) {
      const msg = err?.response?.data?.message || "Save failed";
      toast.error(msg);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      stock: p.stock,
    });
    setImageFile(null);
    setArModelFile(null);
    setImagePreview(p.imageUrl || null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="w-full space-y-6 text-lg">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">Products</h1>
        <p className="text-lg text-slate-300">
          Manage supplement catalog, pricing, and stock.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
            />
          </div>
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
          <label className="text-xs text-slate-300">Product image</label>
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
                className="h-24 w-24 rounded-lg border border-slate-700 object-cover"
              />
            </div>
          )}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Price (₹)</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Stock</label>
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
            />
          </div>
        </div>
        <div className="space-y-3 rounded-xl border border-dashed border-brand-500/30 bg-brand-500/5 p-4">
          <h3 className="text-sm font-bold text-brand-500">3D Model for AR View</h3>
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Upload Model (.glb only)</label>
            <input
              key={editingId || "new-ar"}
              type="file"
              accept=".glb"
              onChange={(e) => setArModelFile(e.target.files?.[0])}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 file:mr-2 file:rounded file:border-0 file:bg-brand-500 file:px-3 file:py-1 file:text-xs file:text-white"
            />
            {editingId && products.find(p => p._id === editingId)?.arModel?.url && (
              <p className="text-[10px] text-green-400 mt-1">Current model: Linked</p>
            )}
            <p className="text-[10px] text-slate-500 italic">This will upload to Cloudinary as a raw resource.</p>
          </div>
        </div>
        <button type="submit" className="btn-primary px-4 py-2 text-xs">
          {editingId ? "Update product" : "Add product"}
        </button>
      </form>

      <div className="space-y-2 text-xs">
        {products.map((p) => (
          <div
            key={p._id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3"
          >
            <div>
              <p className="font-semibold text-slate-100">{p.name}</p>
              <p className="text-[11px] text-slate-400">
                {p.category} • Stock: {p.stock}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {p.imageUrl && (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="h-10 w-10 rounded object-cover"
                />
              )}
              <p className="text-lg text-brand-400">₹ {p.price.toFixed(2)}</p>
              <button
                onClick={() => handleEdit(p)}
                className="rounded-full border border-slate-700 px-3 py-1 text-[11px]"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="text-[11px] text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-xs text-slate-400">No products yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;

