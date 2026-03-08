import React from "react";

const AchievementCard = ({ achievement }) => {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-cream-100 bg-cream-50 shadow-sm transition hover:-translate-y-1 hover:border-brand-500 hover:shadow-brand-500/20 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-slate-900/60 dark:hover:shadow-brand-500/30">
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
        <p className="mt-1 text-xs text-[#333333] line-clamp-3 dark:text-slate-300">
          {achievement.description}
        </p>
      </div>
    </div>
  );
};

export default AchievementCard;

