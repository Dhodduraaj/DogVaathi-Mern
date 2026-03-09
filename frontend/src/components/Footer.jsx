import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-cream-100 bg-cream-100 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex w-full flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 md:flex-row md:items-start md:justify-between">


        <div className="grid gap-4 sm:grid-cols-3 sm:gap-8">
          <div className="space-y-2">
            <p className="text-xl font-semibold text-brand-600 dark:text-brand-400">
              Dog Vaathi
            </p>
            <p className="text-lg text-[#333333] dark:text-slate-500">
              Professional dog training & curated supplements for happier, healthier dogs.
            </p>
          </div>
          <div>
            <p className="mb-2 text-lg font-semibold text-[#333333] dark:text-slate-400">
              Quick Links
            </p>
            <ul className="space-y-1 text-lg text-[#333333] dark:text-slate-500">
              <li>
                <Link to="/" className="hover:text-brand-500 dark:hover:text-brand-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/portfolio/achievements" className="hover:text-brand-500 dark:hover:text-brand-400">
                  Achievements
                </Link>
              </li>
              <li>
                <Link to="/portfolio/videos" className="hover:text-brand-500 dark:hover:text-brand-400">
                  Videos
                </Link>
              </li>
              <li>
                <Link to="/store/products" className="hover:text-brand-500 dark:hover:text-brand-400">
                  Store
                </Link>
              </li>
              <li>
                <Link to="/store/orders" className="hover:text-brand-500 dark:hover:text-brand-400">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-2 text-lg font-semibold text-[#333333] dark:text-slate-400">
              Contact
            </p>
            <ul className="space-y-1 text-lg text-[#333333] dark:text-slate-500">
              <li>
                <a href="mailto:contact@dogvaathi.com" className="hover:text-brand-500 dark:hover:text-brand-400">
                  contact@dogvaathi.com
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" className="hover:text-brand-500 dark:hover:text-brand-400">
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a href="https://instagram.com/dogvaathi" target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 dark:hover:text-brand-400">
                  @dogvaathi
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-cream-100 px-4 py-4 dark:border-slate-800">
        <p className="text-center text-xs text-[#333333] dark:text-slate-500">
          © {new Date().getFullYear()} Dog Vaathi. All rights reserved. Crafted with care for dogs, trainers, and their humans.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
