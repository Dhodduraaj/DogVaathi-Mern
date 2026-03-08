import React from "react";
import { Link } from "react-router-dom";
import Antigravity from "../components/Antigravity.jsx";

const AuthLayout = ({ children }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Antigravity background */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full min-h-screen">
        <Antigravity
          count={200}
          color="#f97316"
          autoAnimate
          particleSize={1.5}
          ringRadius={8}
          magnetRadius={12}
        />
      </div>

      <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-slate-200/50 px-4 py-3 backdrop-blur-sm dark:border-slate-800/50 sm:px-6 lg:px-8">
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
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md sm:max-w-lg">{children}</div>
      </main>
    </div>
  );
};

export default AuthLayout;
