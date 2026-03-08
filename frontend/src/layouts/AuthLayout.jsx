import React from "react";
import { Link } from "react-router-dom";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-100 dark:bg-slate-950">
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <span className="rounded-full bg-brand-500 px-2 py-1 text-xs font-semibold text-white">
            DV
          </span>
          <span className="text-lg font-semibold tracking-tight">Dog Vaathi</span>
        </Link>
        <Link
          to="/"
          className="text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          Back to home
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md sm:max-w-lg">{children}</div>
      </main>
    </div>
  );
};

export default AuthLayout;
