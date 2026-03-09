import React from "react";

const SocialMediaShowcase = () => {
  return (
    <section className="space-y-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-dark-900 dark:text-slate-50">
          Follow Dog Vaathi
        </h2>
      </div>
      <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
        Join our community on social media for daily training tips, behind-the-scenes content, and updates.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:gap-8 cursor-pointer">
        {/* YouTube Card */}
        <div className="group relative flex flex-col items-center overflow-hidden rounded-3xl bg-white p-8 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-slate-900/60 dark:hover:shadow-brand-500/20 border border-cream-200 dark:border-slate-800">
          <div className="absolute inset-0 bg-red-600 opacity-0 transition-opacity duration-300 group-hover:opacity-5 dark:bg-red-500 dark:group-hover:opacity-10 pointer-events-none"></div>

          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-600 shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:bg-red-100 dark:bg-red-500/10 dark:text-red-500 dark:group-hover:bg-red-500/20">
            <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.582 6.186a2.6 2.6 0 0 0-1.838-1.849C18.125 3.9 12 3.9 12 3.9s-6.125 0-7.744.437a2.6 2.6 0 0 0-1.838 1.849C2 7.822 2 12 2 12s0 4.178.418 5.814a2.6 2.6 0 0 0 1.838 1.849C5.875 20.1 12 20.1 12 20.1s6.125 0 7.744-.437a2.6 2.6 0 0 0 1.838-1.849C22 16.178 22 12 22 12s0-4.178-.418-5.814zM9.8 15.5V8.5l6.5 3.5-6.5 3.5z" />
            </svg>
          </div>

          <h3 className="mb-2 text-2xl font-bold tracking-tight text-dark-900 transition-colors group-hover:text-red-600 dark:text-slate-50 dark:group-hover:text-red-400">
            Dog Vaathi YouTube
          </h3>
          <p className="mb-8 text-lg text-slate-500 dark:text-slate-400">
            Watch full training sessions, tutorials, and more on our official channel.
          </p>

          <a
            href="https://youtube.com/@dearpetlovers?si=5GUA0uK1JWLjBtth"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-3 text-lg font-semibold text-white shadow-md shadow-red-600/20 transition-all duration-300 hover:scale-105 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            Visit Channel
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>

        {/* Instagram Card */}
        <div className="group relative flex flex-col items-center overflow-hidden rounded-3xl bg-white p-8 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-slate-900/60 dark:hover:shadow-brand-500/20 border border-cream-200 dark:border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-5 dark:group-hover:opacity-10 pointer-events-none"></div>

          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-pink-50 text-pink-600 shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:bg-pink-100 dark:bg-pink-500/10 dark:text-pink-500 dark:group-hover:bg-pink-500/20">
            <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </div>

          <h3 className="mb-2 text-2xl font-bold tracking-tight text-dark-900 transition-colors group-hover:text-pink-600 dark:text-slate-50 dark:group-hover:text-pink-400">
            @dogvaathi
          </h3>
          <p className="mb-8 text-lg text-slate-500 dark:text-slate-400">
            Follow for daily training tips, short reels, and community updates.
          </p>

          <a
            href="https://www.instagram.com/sivassan_sv?igsh=djJsaTR2aWh0bjU0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 px-8 py-3 text-lg font-semibold text-white shadow-md shadow-pink-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            Follow on Instagram
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaShowcase;
