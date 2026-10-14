"use client";

import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { GalleryCategory, GalleryItem } from "@music-label/shared";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Maximize2, Play, Sparkles } from "lucide-react";

interface GalleryViewProps {
  categories: GalleryCategory[];
  items: GalleryItem[];
}

export default function GalleryView({ categories, items }: GalleryViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  // Filter items based on active category
  const filteredItems = items.filter((item) => {
    if (activeCategory === "all" || activeCategory === "cat-all") return true;
    return item.categoryId === activeCategory;
  });

  // Prepare slides for lightbox
  const slides = filteredItems.map((item) => ({
    src: item.media.url,
    alt: item.media.alt || item.title,
    title: item.title,
  }));

  return (
    <>
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
        {categories.map((cat) => {
          const isSelected =
            activeCategory === cat.slug || activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              id={`gallery-filter-${cat.slug}`}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 ${
                isSelected
                  ? "bg-[#D4AF37] text-[#070709] shadow-lg shadow-[#D4AF37]/20 scale-105"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/10"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Responsive Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setLightboxIndex(index)}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#121318] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-500 cursor-pointer shadow-xl"
          >
            <img
              src={item.media.url}
              alt={item.media.alt || item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

            {/* Hover overlay icon and title */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="flex justify-end">
                <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:text-[#D4AF37] group-hover:border-[#D4AF37] transition-all">
                  {item.media.kind === "video" ? (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold tracking-widest text-[#D4AF37] uppercase">
                  {item.media.kind === "video" ? "Film Stream" : "Photography"}
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-white mt-1 group-hover:text-[#F5D77F] transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
      />
    </>
  );
}
