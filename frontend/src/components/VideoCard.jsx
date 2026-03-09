import React from "react";
import { getYoutubeThumbnail } from "../utils/videoEmbed.js";

const VideoCard = ({ video, onPlay }) => {
  const thumbnail =
    video.thumbnailUrl ||
    getYoutubeThumbnail(video.url) ||
    "/images/dog-video-placeholder.jpg";

  return (
    <button
      type="button"
      onClick={() => onPlay(video)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-cream-100 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-500 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/60 dark:hover:shadow-brand-500/30"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-dark-900/20 transition-colors duration-300 group-hover:bg-dark-900/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/90 pl-1 text-white shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-brand-500">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
      </div>
      <div className="p-5">
        <p className="line-clamp-2 text-lg font-bold text-dark-900 dark:text-slate-100 group-hover:text-brand-600 transition-colors">{video.title}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-md bg-cream-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:bg-slate-800 dark:text-brand-400">
            {video.platform || "Instagram"}
          </span>
        </div>
      </div>
    </button>
  );
};

export default VideoCard;

