import React, { useState } from "react";

const AchievementCard = ({ achievement }) => {
  const [showDesc, setShowDesc] = useState(false);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-cream-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-500 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-slate-900/60 dark:hover:shadow-brand-500/30"
      onMouseEnter={() => setShowDesc(true)}
      onMouseLeave={() => setShowDesc(false)}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        {achievement.imageUrl ? (
          <img
            src={achievement.imageUrl}
            alt={achievement.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-cream-100 text-brand-400 dark:bg-slate-800">
            No Image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <h3 className="line-clamp-2 text-base font-bold text-dark-900 dark:text-slate-100">{achievement.title}</h3>
        <div className="flex items-center justify-between">
          <span className="rounded-md bg-brand-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
            {achievement.programName}
          </span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {new Date(achievement.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
          </span>
        </div>
        
        {achievement.description && (
          <>
            <div className="mt-auto hidden sm:block">
              <span className="flex items-center gap-1 text-[11px] font-medium text-brand-500 opacity-60 transition-opacity group-hover:opacity-100 dark:text-brand-400">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Hover for details
              </span>
            </div>
            
            <div 
              className={`absolute inset-0 z-10 flex flex-col justify-center items-center bg-dark-900/90 p-6 backdrop-blur-sm transition-all duration-300 ${
                showDesc ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              <h4 className="mb-3 text-lg font-bold text-white text-center">{achievement.title}</h4>
              <p className="text-center text-lg leading-relaxed text-slate-200">{achievement.description}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;

