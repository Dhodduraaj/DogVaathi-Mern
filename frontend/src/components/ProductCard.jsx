import React from "react";
import { useCart } from "../context/CartContext.jsx";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const inStock = (product.stock ?? 0) > 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-cream-100 bg-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-slate-900/40">
      <img
        src={product.imageUrl || "/images/supplement-placeholder.jpg"}
        alt={product.name}
        className="h-44 w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-sm font-semibold text-[#333333] dark:text-slate-100">
          {product.name}
        </h3>
        <p className="text-sm font-semibold text-brand-500 dark:text-brand-400">
          ₹{product.price.toFixed(0)}
        </p>
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] text-pink-700 dark:bg-pink-900/40 dark:text-pink-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className={`flex items-center gap-1 text-xs ${inStock ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
          <span>{inStock ? "✓" : "—"}</span>
          <span>{inStock ? `${product.stock} left` : "Out of stock"}</span>
        </div>
        <button
          onClick={() => inStock && addToCart(product, 1)}
          disabled={!inStock}
          className="mt-auto w-full rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
