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
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Description Hover Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-900/80 p-6 text-center opacity-0 transition-all duration-500 group-hover:opacity-100 backdrop-blur-[2px]">
           <p className="line-clamp-4 text-sm leading-relaxed text-white">
             {product.description || "Premium quality dog supplement to keep your furry friend healthy and active."}
           </p>
           <div className="mt-4 h-1 w-12 rounded-full bg-brand-500" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-base font-bold text-dark-900 transition-colors group-hover:text-brand-600 dark:text-slate-100 dark:group-hover:text-brand-400">
            {product.name}
            </h3>
        </div>
        <div className="flex items-center justify-between">
            <p className="text-xl font-black text-brand-600 dark:text-brand-400">
            ₹{product.price.toFixed(0)}
            </p>
            <div className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${inStock ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            <span>{inStock ? `${product.stock} left` : "Out of stock"}</span>
            </div>
        </div>
        
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-cream-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand-600/80 dark:bg-slate-800 dark:text-brand-300/80"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            inStock && addToCart(product, 1);
          }}
          disabled={!inStock}
          className="btn-primary relative mt-auto flex w-full items-center justify-center gap-2 overflow-hidden py-2.5 shadow-md shadow-brand-500/20 transition-all hover:shadow-lg hover:shadow-brand-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="font-bold">{inStock ? "Add to Cart" : "Out of Stock"}</span>
        </button>
      </div>

    </div>
  );
};

export default ProductCard;
