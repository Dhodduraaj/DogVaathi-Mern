import React, { useEffect, useState } from "react";
import api from "../../utils/axios.js";
import AchievementCard from "../../components/AchievementCard.jsx";
import SocialMediaShowcase from "../../components/SocialMediaShowcase.jsx";

const Achievements = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/admin/achievements");
        setItems(res.data);
      } catch (e) {
        // ignore
      }
    };
    load();
  }, []);

  return (
    <div className="w-full space-y-12 animate-fade-in pb-12">
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-brand-600 dark:text-slate-50">
          Training Achievements
        </h1>
        <p className="max-w-2xl text-lg text-[#333333] dark:text-slate-300">
          Certifications, titles, and special dogs that mark Dog Vaathi&apos;s
          journey as a professional trainer.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((a) => (
          <AchievementCard key={a._id} achievement={a} />
        ))}
        {items.length === 0 && (
          <p className="text-xs text-slate-400">
            No achievements added yet. Use the admin panel to create some.
          </p>
          )}
        </div>
      </div>
      
      {/* Social Media Section */}
      <hr className="border-cream-200 dark:border-slate-800" />
      <SocialMediaShowcase />
    </div>
  );
};

export default Achievements;

