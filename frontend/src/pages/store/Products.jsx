import React, { useEffect, useState } from "react";
import api from "../../utils/axios.js";
import ProductCard from "../../components/ProductCard.jsx";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  const load = async () => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (sort) params.sort = sort;
    const res = await api.get("/products", { params });
    setProducts(res.data);
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/products/categories");
      setCategories(res.data);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    load();
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className="w-full space-y-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-brand-500 dark:text-brand-400">
          Our Products
        </h1>
        <p className="mt-1 max-w-2xl mx-auto text-lg text-[#333333] dark:text-slate-300">
          Curated supplements to support your dog&apos;s joints, coat, focus, and
          overall performance.
        </p>
      </header>

      <div className="rounded-xl border border-cream-100 bg-cream-100/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
        <form
          onSubmit={handleFilter}
          className="grid gap-4 sm:grid-cols-4 text-xs"
        >
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-sm font-medium text-[#333333] dark:text-slate-300">
              <svg className="h-4 w-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </label>
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-cream-100 bg-white px-3 py-2 text-[#333333] outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-sm font-medium text-[#333333] dark:text-slate-300">
              <span className="h-3 w-3 rounded-full bg-brand-500" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border text-sm border-cream-100 bg-white px-3 py-2 text-[#333333] outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-sm font-medium text-[#333333] dark:text-slate-300">
              <svg className="h-4 w-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-lg border border-cream-100 text-sm bg-white px-3 py-2 text-[#333333] outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
          <button type="submit" className="mt-3 btn-primary px-4 py-2 text-xs">
            Apply Filters
          </button>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
        {products.length === 0 && (
          <p className="col-span-full text-center text-xs text-slate-500 dark:text-slate-400">
            No products found. Add some from the admin panel.
          </p>
        )}
      </div>
    </div>
  );
};

export default Products;
