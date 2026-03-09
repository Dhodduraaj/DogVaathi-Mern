import React from "react";
import { useCart } from "../context/CartContext.jsx";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const inStock = (product.stock ?? 0) > 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-cream-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-slate-900/40">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={product.imageUrl || "/images/supplement-placeholder.jpg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 text-base font-semibold text-dark-900 dark:text-slate-100">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-brand-500 dark:text-brand-400">
          ₹{product.price.toFixed(0)}
        </p>
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-cream-100 px-2 py-0.5 text-[10px] font-medium text-brand-600 dark:bg-slate-800 dark:text-brand-300"
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
          className="btn-primary mt-auto w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
