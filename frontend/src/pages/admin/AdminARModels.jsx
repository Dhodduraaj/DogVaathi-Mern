import React, { useEffect, useState } from "react";
import api from "../../utils/axios.js";
import toast from "react-hot-toast";

const emptyForm = {
  name: "",
  description: "",
  category: "General",
};

const AdminARModels = () => {
  const [models, setModels] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [modelFile, setModelFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const res = await api.get("/ar-models");
      setModels(res.data);
    } catch (err) {
      toast.error("Failed to load models");
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
    if (!modelFile) {
      toast.error("Please select a .glb file");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("description", form.description);
      payload.append("category", form.category);
      payload.append("modelFile", modelFile);

      await api.post("/ar-models", payload);
      toast.success("AR Model uploaded successfully");
      
      setForm(emptyForm);
      setModelFile(null);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this AR model?")) return;
    try {
      await api.delete(`/ar-models/${id}`);
      toast.success("Deleted");
      load();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="w-full space-y-6 text-lg">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">Standalone AR Models</h1>
        <p className="text-lg text-slate-300">
          Manage 3D models for the general AR experience.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Model Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. German Shepherd"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Breeds, Equipment"
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
            rows={2}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-300">3D Model File (.glb)</label>
          <input
            type="file"
            accept=".glb"
            onChange={(e) => setModelFile(e.target.files?.[0])}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 file:mr-2 file:rounded file:border-0 file:bg-brand-500 file:px-3 file:py-1 file:text-xs file:text-white"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary px-6 py-2 text-xs disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload AR Model"}
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((m) => (
          <div
            key={m._id}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:bg-slate-900"
          >
            <div className="mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-500">
                {m.category}
              </span>
              <h3 className="font-bold text-slate-100">{m.name}</h3>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">{m.description}</p>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <span className="text-[10px] text-slate-500 font-mono">ID: {m._id.slice(-6)}</span>
              <button
                onClick={() => handleDelete(m._id)}
                className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {models.length === 0 && (
          <p className="col-span-full py-12 text-center text-slate-500">No standalone models yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminARModels;
