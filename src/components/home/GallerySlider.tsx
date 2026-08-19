"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GALLERY_SLIDES } from "@/lib/constants";

export function GallerySlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((value) => (value + 1) % GALLERY_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [paused]);

  const go = (next: number) => {
    setIndex((next + GALLERY_SLIDES.length) % GALLERY_SLIDES.length);
  };

  const slide = GALLERY_SLIDES[index];

  return (
    <section className="section-y bg-white" aria-label="Фотогалерея станции">
      <div className="container-page">
        <div
          className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-card"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative aspect-[16/10] bg-brand-900 sm:aspect-[16/8]">
            <AnimatePresence mode="wait">
              <motion.img
                key={slide.src}
                src={slide.src}
                alt={slide.alt}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/80 to-transparent p-5 sm:p-8">
              <p className="text-sm font-medium text-white sm:text-base">{slide.caption}</p>
            </div>
          </div>
          <button
            type="button"
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-900 shadow"
            onClick={() => go(index - 1)}
            aria-label="Предыдущее фото"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-900 shadow"
            onClick={() => go(index + 1)}
            aria-label="Следующее фото"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {GALLERY_SLIDES.map((item, dot) => (
              <button
                key={item.src}
                type="button"
                aria-label={`Слайд ${dot + 1}`}
                onClick={() => setIndex(dot)}
                className={`h-2.5 rounded-full transition ${dot === index ? "w-7 bg-accent-500" : "w-2.5 bg-white/70"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
