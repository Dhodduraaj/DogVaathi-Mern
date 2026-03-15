import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";


const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { theme, toggleTheme } = useTheme();

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const navLinkClass = ({ isActive }) =>
    `relative text-lg font-semibold transition-all duration-300 hover:text-brand-500 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-brand-500 after:transition-all after:duration-300 hover:after:w-full ${isActive ? "text-brand-500 after:w-full" : "text-dark-900 dark:text-slate-200"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-cream-100 bg-cream-50/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex w-full items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2 text-brand-600 transition-all duration-500 hover:scale-105 active:scale-95 dark:text-slate-100">
          <img src="/images/logo.png" alt="Dog Vaathi" className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover shadow-sm transition-all duration-500 group-hover:rotate-6 group-hover:shadow-brand-500/30 bg-transparent" />
          <span className="text-lg font-bold tracking-tight text-dark-900 transition-colors duration-500 group-hover:text-brand-600 dark:text-slate-50 dark:group-hover:text-brand-400">
            Dog Vaathi
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/portfolio/achievements" className={navLinkClass}>
            Achievements
          </NavLink>
          <NavLink to="/portfolio/videos" className={navLinkClass}>
            Videos
          </NavLink>
          <NavLink to="/store/products" className={navLinkClass}>
            Store
          </NavLink>
          <NavLink to="/ar-experience" className={navLinkClass}>
            AR Experience
          </NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl p-2.5 text-dark-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cream-100 hover:text-brand-600 hover:shadow-sm dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-amber-400"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {user && (
            <NavLink to="/store/orders" className={({ isActive }) => `flex items-center gap-1 ${navLinkClass({ isActive })}`} title="My Orders">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="hidden sm:inline"></span>
            </NavLink>
          )}
          <NavLink to="/store/cart" className="relative flex items-center gap-1 rounded-xl p-2.5 text-dark-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cream-100 hover:text-brand-600 hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-800" title="Cart">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
            <span className="hidden sm:inline"></span>
          </NavLink>
          {user ? (
            <div className="flex items-center gap-3 ml-2 border-l border-cream-200 pl-4 dark:border-slate-800">
              <span className="hidden text-lg font-medium text-brand-600 sm:inline dark:text-brand-400">
                Hi, {user.name.split(" ")[0]}
              </span>
              <button
                onClick={logout}
                className="btn-secondary px-3 py-1.5 text-xs bg-transparent dark:hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="ml-2 border-l border-cream-200 pl-4 dark:border-slate-800">
              <NavLink to="/auth/login" className="btn-primary">
                Login
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

