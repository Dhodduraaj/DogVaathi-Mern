import React, { useEffect, useState } from "react";
import api from "../../utils/axios.js";
import VideoCard from "../../components/VideoCard.jsx";

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/admin/videos");
        setVideos(res.data);
      } catch (e) {
        // ignore
      }
    };
    load();
  }, []);

  return (
    <div className="w-full space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-brand-600 dark:text-slate-50">
          Instagram Training Videos
        </h1>
        <p className="max-w-2xl text-sm text-[#333333] dark:text-slate-300">
          Real training sessions, behavior breakdowns, and behind-the-scenes
          content from Dog Vaathi&apos;s Instagram.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {videos.map((v) => (
          <VideoCard key={v._id} video={v} onPlay={setActive} />
        ))}
        {videos.length === 0 && (
          <p className="text-xs text-slate-400">
            No videos added yet. Use the admin panel to save Instagram links.
          </p>
        )}
      </div>

      {active && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-slate-900">
            <button
              className="absolute right-3 top-3 z-10 rounded-full bg-slate-900/80 px-2 py-1 text-xs text-slate-200"
              onClick={() => setActive(null)}
            >
              Close
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={active.url}
                title={active.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="px-4 py-3 text-sm text-slate-200">
              {active.title}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;

