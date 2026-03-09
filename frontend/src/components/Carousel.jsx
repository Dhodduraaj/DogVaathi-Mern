import React, { useEffect, useState } from "react";
import rdr from "../images/rdr.png";
import fightclub from "../images/fightclub.png";
import daredevil from "../images/daredevil.png";

const defaultSlides = [
  "rdr.png",
  "fightclub.png",
  "daredevil.png",
];

const Carousel = ({ slides = defaultSlides, interval = 5000 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % slides.length),
      interval
    );
    return () => clearInterval(id);
  }, [slides.length, interval]);

  const go = (dir) => {
    setIndex((prev) => {
      if (dir === "next") return (prev + 1) % slides.length;
      return (prev - 1 + slides.length) % slides.length;
    });
  };

  return (
    <div className="relative group overflow-hidden rounded-3xl border border-cream-100 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900/60">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((src, i) => (
          <div key={i} className="min-w-full relative aspect-video md:aspect-[16/9]">
            <img
              src={`../src/images/${src}`}
              alt={`Slide ${i + 1}`}
              className="h-full w-full object-cover"
            />
            {/* Optional gradient overlay for better text readability if text is added later */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/40 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => go("prev")}
        className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-brand-600 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
        aria-label="Previous slide"
      >
        <svg className="h-6 w-6 pr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={() => go("next")}
        className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-brand-600 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
        aria-label="Next slide"
      >
        <svg className="h-6 w-6 pl-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 transition-all duration-300 rounded-full ${index === i ? "w-6 bg-brand-500" : "w-2 bg-white/50 hover:bg-white"
              }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;

