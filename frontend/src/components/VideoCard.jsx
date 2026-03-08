import React from "react";

const VideoCard = ({ video, onPlay }) => {
  return (
    <button
      type="button"
      onClick={() => onPlay(video)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-cream-100 bg-cream-50 text-left shadow-sm transition hover:-translate-y-1 hover:border-brand-500 hover:shadow-brand-500/20 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-slate-900/60 dark:hover:shadow-brand-500/30"
    >
      <div className="relative">
        <img
          src={video.thumbnailUrl || "/images/dog-video-placeholder.jpg"}
          alt={video.title}
          className="h-40 w-full object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center text-3xl text-white/80">
          ▶
        </span>
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold text-[#333333] dark:text-slate-100">{video.title}</p>
        <p className="mt-1 text-[11px] uppercase tracking-wide text-brand-400 dark:text-slate-400">
          {video.platform || "Instagram"}
        </p>
      </div>
    </button>
  );
};

export default VideoCard;

