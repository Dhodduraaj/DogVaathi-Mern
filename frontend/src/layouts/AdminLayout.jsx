import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AdminLayout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-slate-200 bg-white px-4 py-6 text-sm transition-transform dark:border-slate-800 dark:bg-slate-900/95 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-2">
          <Link to="/admin" className="hover:text-brand-400" onClick={() => setSidebarOpen(false)}>
            Dashboard
          </Link>
          <Link to="/admin/products" className="hover:text-brand-400" onClick={() => setSidebarOpen(false)}>
            Products
          </Link>
          <Link to="/admin/orders" className="hover:text-brand-400" onClick={() => setSidebarOpen(false)}>
            Orders
          </Link>
          <Link to="/admin/achievements" className="hover:text-brand-400" onClick={() => setSidebarOpen(false)}>
            Achievements
          </Link>
          <Link to="/admin/videos" className="hover:text-brand-400" onClick={() => setSidebarOpen(false)}>
            Videos
          </Link>
        </nav>
        <p className="mt-auto text-[11px] text-slate-500 dark:text-slate-500">
          Logged in as {user?.email}
        </p>
      </aside>

      <div className="flex flex-1 flex-col md:min-w-0">
        {/* Top navbar with back button */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((o) => !o)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50 md:hidden"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-slate-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to site
            </Link>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Admin</span>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

