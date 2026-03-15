import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Carousel from "../../components/Carousel.jsx";
import ProductCard from "../../components/ProductCard.jsx";
import AchievementCard from "../../components/AchievementCard.jsx";
import VideoCard from "../../components/VideoCard.jsx";
import SocialMediaShowcase from "../../components/SocialMediaShowcase.jsx";
import api from "../../utils/axios.js";
import { getEmbedUrl } from "../../utils/videoEmbed.js";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [carouselSlides, setCarouselSlides] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, achievementsRes, videosRes, carouselRes] = await Promise.all([
          api.get("/products", { params: { sort: "newest", limit: 4 } }),
          api.get("/admin/achievements"),
          api.get("/admin/videos"),
          api.get("/carousel"),
        ]);
        setFeaturedProducts(productsRes.data.slice(0, 4));
        setAchievements(achievementsRes.data.slice(0, 3));
        setVideos(videosRes.data.slice(0, 3));
        setCarouselSlides(carouselRes.data);
      } catch (e) {
        // ignore for landing
      }
    };
    load();
  }, []);

  return (
    <div className="w-full space-y-16 animate-fade-in pb-12">
      {/* Hero */}
      <section className="grid gap-8 md:grid-cols-2 md:items-center pt-4">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-400 dark:text-brand-400">
            Professional Dog Trainer
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-brand-600 dark:text-slate-50 md:text-4xl">
            Welcome to Dog Vaathi
          </h1>
          <p className="text-lg text-[#333333] dark:text-slate-300">
            Balanced training, real-world results. Follow Dog Vaathi’s journey
            with working dogs, sport dogs, and family companions—now paired with
            curated supplements for happier, healthier dogs.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/store/products" className="btn-primary">
              Explore Supplements
            </Link>
            <Link
              to="/portfolio/videos"
              className="rounded-full border border-brand-500 px-4 py-2 text-lg font-semibold text-brand-600 hover:border-brand-600 hover:bg-brand-500/10 dark:border-slate-700 dark:text-slate-200 dark:hover:text-brand-400"
            >
              Watch Training Videos
            </Link>
          </div>
        </div>
        <Carousel slides={carouselSlides} />
      </section>

      {/* Achievements teaser */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-600 dark:text-slate-50">
            Training Achievements
          </h2>
          <Link
            to="/portfolio/achievements"
            className="text-xs font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
          >
            View all →
          </Link>
        </div>
        <p className="max-w-3xl text-lg text-[#333333] dark:text-slate-300">
          Certifications, competitions, and milestone dogs that shaped Dog
          Vaathi’s training philosophy.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {achievements.map((a) => (
            <AchievementCard key={a._id} achievement={a} />
          ))}
          {achievements.length === 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No achievements yet. Add them from the admin panel.
            </p>
          )}
        </div>
      </section>

      {/* Videos preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-600 dark:text-slate-50">
            Training Videos
          </h2>
          <Link
            to="/portfolio/videos"
            className="text-xs font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
          >
            View all →
          </Link>
        </div>
        <p className="max-w-3xl text-lg text-[#333333] dark:text-slate-300">
          Real training sessions and behind-the-scenes content from Dog Vaathi.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {videos.map((v) => (
            <VideoCard key={v._id} video={v} onPlay={setActiveVideo} />
          ))}
          {videos.length === 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No videos yet. Add them from the admin panel.
            </p>
          )}
        </div>
      </section>

      {activeVideo && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-slate-900">
            <button
              className="absolute right-3 top-3 z-10 rounded-full bg-slate-900/80 px-2 py-1 text-xs text-slate-200"
              onClick={() => setActiveVideo(null)}
            >
              Close
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={getEmbedUrl(activeVideo.url)}
                title={activeVideo.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="px-4 py-3 text-lg text-slate-200">
              {activeVideo.title}
            </div>
          </div>
        </div>
      )}

      {/* Social Media Showcase */}
      <SocialMediaShowcase />

      {/* Store preview */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-600 dark:text-slate-50">
            Supplement Store Preview
          </h2>
          <Link
            to="/store/products"
            className="text-xs font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Go to store →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {featuredProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
          {featuredProducts.length === 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Store coming soon. Add products from the admin panel.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

