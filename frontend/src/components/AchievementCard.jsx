import React, { useState } from "react";

const AchievementCard = ({ achievement }) => {
  const [showDesc, setShowDesc] = useState(false);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-cream-100 bg-cream-50 shadow-sm transition hover:-translate-y-1 hover:border-brand-500 hover:shadow-brand-500/20 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-slate-900/60 dark:hover:shadow-brand-500/30"
      onMouseEnter={() => setShowDesc(true)}
      onMouseLeave={() => setShowDesc(false)}
    >
      {achievement.imageUrl && (
        <img
          src={achievement.imageUrl}
          alt={achievement.title}
          className="h-40 w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-sm font-semibold text-[#333333] dark:text-slate-100">{achievement.title}</h3>
        <p className="text-xs text-brand-400">{achievement.programName}</p>
        <p className="text-[11px] text-brand-400 dark:text-slate-400">
          {new Date(achievement.date).toLocaleDateString()}
        </p>
        {achievement.description && (
          <>
            <span className="cursor-help text-[11px] text-slate-400 underline decoration-dotted dark:text-slate-500">
              Hover for description
            </span>
            {showDesc && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-slate-900/95 p-4">
                <p className="text-center text-xs leading-relaxed text-slate-200">{achievement.description}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;

