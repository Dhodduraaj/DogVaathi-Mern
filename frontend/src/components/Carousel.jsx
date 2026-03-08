import React, { useEffect, useState } from "react";
import rdr from "../images/rdr.jpg";
import fightclub from "../images/fightclub.jpg";
import daredevil from "../images/daredevil.jpg";

const defaultSlides = [
  "rdr.jpg",
  "fightclub.jpg",
  "daredevil.jpg",
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
    <div className="relative overflow-hidden rounded-3xl border border-cream-100 bg-cream-100 dark:border-slate-800 dark:bg-slate-900/60">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((src, i) => (
          <div key={i} className="min-w-full">
            <img
              src={`../src/images/${src}`}
              alt="Dog training"
              className="h-64 w-full object-cover md:h-80"
            />
          </div>
        ))}
      </div>
      <button
        onClick={() => go("prev")}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-xs text-white hover:bg-black/60 dark:bg-slate-900/70 dark:hover:bg-slate-800"
      >
        ◀
      </button>
      <button
        onClick={() => go("next")}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-xs text-white hover:bg-black/60 dark:bg-slate-900/70 dark:hover:bg-slate-800"
      >
        ▶
      </button>
    </div>
  );
};

export default Carousel;

