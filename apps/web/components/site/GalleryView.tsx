"use client";

import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import { GalleryCategory, GalleryItem } from "@music-label/shared";
import { ArrowUpRight, ArrowRight, Play, Maximize2, Grid, LayoutGrid, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/components/theme/ThemeProvider";

interface GalleryViewProps {
  categories: GalleryCategory[];
  items: GalleryItem[];
}

export default function GalleryView({ categories, items }: GalleryViewProps) {
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  const [viewMode, setViewMode] = useState<"matrix" | "cards">("matrix");

  // Filter items based on active category
  const filteredItems = items.filter((item) => {
    if (activeCategory === "all" || activeCategory === "cat-all") return true;
    return item.categoryId === activeCategory;
  });

  const activeItem = filteredItems[activeItemIndex] || filteredItems[0] || items[0];

  // Prepare slides for lightbox
  const slides = filteredItems.map((item) => ({
    src: item.media.url,
    alt: item.media.alt || item.title,
    title: item.title,
  }));

  return (
    <div className="w-full">
      {/* Category Tabs and View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
        {/* Category Pills */}
        <div
          className={`flex flex-wrap items-center gap-2 p-1.5 rounded-full border shadow-md transition-colors ${
            isDark ? "bg-[#121217] border-white/10" : "bg-white border-black/10"
          }`}
        >
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.slug || activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.slug);
                  setActiveItemIndex(0);
                }}
                id={`gallery-filter-${cat.slug}`}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-[#e11d48] text-white shadow-md shadow-red-500/20 scale-105"
                    : isDark
                    ? "text-zinc-600 hover:text-white hover:bg-white/10"
                    : "text-zinc-600 hover:text-black hover:bg-black/[0.04]"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher */}
        <div
          className={`flex items-center space-x-1 p-1 rounded-full border text-xs shadow-sm transition-colors ${
            isDark ? "bg-[#121217] border-white/10" : "bg-white border-black/10"
          }`}
        >
          <button
            onClick={() => setViewMode("matrix")}
            className={`px-3 py-1.5 rounded-full flex items-center space-x-1.5 font-bold transition-all cursor-pointer ${
              viewMode === "matrix"
                ? "bg-[#e11d48] text-white shadow-sm"
                : isDark
                ? "text-zinc-600 hover:text-white"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Matrix Mosaic</span>
          </button>
          <button
            onClick={() => setViewMode("cards")}
            className={`px-3 py-1.5 rounded-full flex items-center space-x-1.5 font-bold transition-all cursor-pointer ${
              viewMode === "cards"
                ? "bg-[#e11d48] text-white shadow-sm"
                : isDark
                ? "text-zinc-600 hover:text-white"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Card Grid</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          VIEW MODE 1: BALLET-STYLE MATRIX GRID (ADAPTIVE THEME)
         ========================================================= */}
      {viewMode === "matrix" && (
        <div
          className={`relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden border transition-all duration-300 ${
            isDark
              ? "border-white/10 bg-[#121217] shadow-[0_20px_70px_rgba(0,0,0,0.7)]"
              : "border-black/10 bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)]"
          } min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] flex flex-col justify-between p-6 sm:p-10 select-none`}
        >
          {/* Master Background Visual Layer Spanning Across All Cells */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeItem?.media?.url}
                src={activeItem?.media?.url || items[0]?.media?.url}
                alt={activeItem?.title || "Gallery Artwork"}
                initial={{ opacity: 0.2, scale: 1.05 }}
                animate={{ opacity: isDark ? 0.65 : 0.85, scale: 1 }}
                exit={{ opacity: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`w-full h-full object-cover object-center filter ${
                  isDark ? "brightness-[0.7] contrast-[1.15]" : "brightness-[0.95] contrast-[1.05]"
                }`}
              />
            </AnimatePresence>
            {/* Vignette & Ambient Light Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-t ${
                isDark
                  ? "from-[#121217] via-[#121217]/50 to-[#121217]/80"
                  : "from-white via-white/40 to-white/70"
              }`}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-r ${
                isDark
                  ? "from-[#121217] via-transparent to-[#121217]"
                  : "from-white via-transparent to-white"
              }`}
            />
            <div className="absolute inset-0 bg-[#e11d48]/[0.02] mix-blend-color" />
          </div>

          {/* Left Vertical Rail */}
          <div className="absolute left-4 sm:left-6 inset-y-6 sm:inset-y-10 z-20 flex flex-col justify-between pointer-events-none">
            <span
              className={`font-heading font-extrabold text-sm tracking-wider uppercase ${
                isDark ? "text-white" : "text-zinc-900"
              }`}
            >
              one roof
            </span>

            <span
              className={`rotate-[-90deg] origin-left translate-y-12 text-[10px] font-mono tracking-[0.3em] uppercase whitespace-nowrap ${
                isDark ? "text-zinc-600" : "text-zinc-500"
              }`}
            >
              ▾ OCTOBER 2026 ▾
            </span>

            <span className="text-[9px] font-mono text-zinc-500 tracking-widest">
              © oneroofentertainment.com
            </span>
          </div>

          {/* Right Rail Top & Bottom Icons */}
          <div className="absolute right-6 top-6 z-20 flex items-center space-x-1">
            <div className="w-6 h-4 flex flex-col justify-between py-0.5 opacity-60">
              <span
                className={`w-full h-0.5 rounded-full ${isDark ? "bg-zinc-300" : "bg-zinc-800"}`}
              />
              <span
                className={`w-full h-0.5 rounded-full ${isDark ? "bg-zinc-300" : "bg-zinc-800"}`}
              />
            </div>
          </div>
          <div className="absolute right-6 bottom-6 z-20 flex items-center space-x-1 text-zinc-600 opacity-60">
            <span className="text-xs font-mono">—o—</span>
          </div>

          {/* =========================================================
              THE MODULAR MATRIX GRID CANVAS
             ========================================================= */}
          <div
            className={`relative z-10 w-full h-full flex-1 ml-6 sm:ml-10 mr-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 border rounded-2xl overflow-hidden backdrop-blur-[1px] transition-colors ${
              isDark
                ? "border-white/10 bg-[#0e0e12]/60"
                : "border-black/[0.08] bg-white/40"
            }`}
          >
            {/* Top-Level Large Typography Cut-Through */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
              <span
                className={`font-heading font-black text-[18vw] md:text-[14vw] lg:text-[12vw] leading-none tracking-[-0.04em] uppercase select-none drop-shadow-sm ${
                  isDark ? "text-white/[0.8]" : "text-[#09090B]/[0.85]"
                }`}
              >
                CINEMA
              </span>
            </div>

            {/* Matrix Cells Mapping Over Gallery Items */}
            {filteredItems.slice(0, 10).map((item, idx) => {
              const isSelected = activeItemIndex === idx;
              const isFeatureCell = idx === 0;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveItemIndex(idx)}
                  onClick={() => setLightboxIndex(idx)}
                  className={`relative p-5 sm:p-6 border-b border-r transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[170px] sm:min-h-[220px] group ${
                    isDark ? "border-white/10" : "border-black/[0.08]"
                  } ${
                    isSelected
                      ? isDark
                        ? "bg-[#e11d48]/15 border-b-[#e11d48] border-r-[#e11d48] shadow-[inset_0_0_20px_rgba(229,30,43,0.2)]"
                        : "bg-red-50/80 border-b-[#e11d48] border-r-[#e11d48] shadow-[inset_0_0_20px_rgba(229,30,43,0.1)]"
                      : isDark
                      ? "hover:bg-white/[0.04]"
                      : "hover:bg-white/60"
                  }`}
                >
                  {/* Subtle Grid Index Stamp */}
                  <div
                    className={`flex items-center justify-between text-[10px] font-mono z-20 ${
                      isDark ? "text-zinc-600" : "text-zinc-500"
                    }`}
                  >
                    <span className="group-hover:text-[#e11d48] transition-colors font-bold">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:text-[#e11d48] transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  {/* Feature Inset Card */}
                  {isFeatureCell ? (
                    <div
                      className={`relative z-20 my-auto flex items-center space-x-3 p-2.5 rounded-xl border shadow-lg group-hover:border-[#e11d48] transition-colors ${
                        isDark
                          ? "bg-[#181820]/95 border-white/10 shadow-black/40"
                          : "bg-white/95 border-black/10"
                      }`}
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 border border-black/10 relative aspect-square">
                        <img
                          src={item.media.url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4
                          className={`text-xs font-bold uppercase tracking-tight truncate ${
                            isDark ? "text-white" : "text-zinc-900"
                          }`}
                        >
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-bold text-[#e11d48] uppercase tracking-wider flex items-center space-x-1 mt-1">
                          <span>FEATURED REEL</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Standard Matrix Exhibit Cell */
                    <div className="relative z-20 mt-auto">
                      <h4
                        className={`font-heading font-extrabold text-sm sm:text-base uppercase tracking-tight group-hover:text-[#e11d48] transition-colors line-clamp-2 ${
                          isDark ? "text-zinc-200" : "text-zinc-900"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <div
                        className={`mt-2 flex items-center space-x-1.5 text-[11px] font-bold transition-colors ${
                          isDark
                            ? "text-zinc-600 group-hover:text-white"
                            : "text-zinc-500 group-hover:text-black"
                        }`}
                      >
                        <span className="uppercase tracking-wider">
                          {item.media.kind === "video" ? "Film Master" : "35mm Print"}
                        </span>
                        <ArrowRight className="w-3 h-3 text-[#e11d48] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  )}

                  {/* Active Cell Accent Line at bottom */}
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e11d48] z-30" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Bar: Instructions & Direct Preview CTA */}
          <div
            className={`relative z-20 mt-6 pt-4 border-t flex flex-col sm:flex-row items-center justify-between text-xs ${
              isDark ? "border-white/10 text-zinc-600" : "border-black/[0.08] text-zinc-600"
            }`}
          >
            <span className="font-mono text-[11px]">
              Hover any matrix cell to focus visual • Click to launch master full-screen lightbox
            </span>
            <button
              onClick={() => setLightboxIndex(activeItemIndex)}
              className="mt-2 sm:mt-0 px-4 py-1.5 rounded-full bg-[#e11d48] hover:bg-[#D81A26] text-white text-xs font-bold tracking-wider uppercase transition-all cursor-pointer shadow-md shadow-[#e11d48]/20"
            >
              Open Active Visual ({activeItemIndex + 1}/{filteredItems.length})
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          VIEW MODE 2: RESPONSIVE CARDS GRID (ALTERNATIVE VIEW)
         ========================================================= */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="cursor-pointer group"
            >
              <div
                className={`aspect-[4/3] rounded-3xl overflow-hidden border shadow-xl relative transition-all ${
                  isDark
                    ? "border-white/10 bg-[#121217] hover:border-[#e11d48]/60 shadow-black/50"
                    : "border-black/10 bg-white hover:border-[#e11d48]/60"
                }`}
              >
                <img
                  src={item.media.url}
                  alt={item.media.alt || item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Hover overlay icon and title */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:text-[#e11d48] group-hover:bg-white transition-all shadow-md">
                      {item.media.kind === "video" ? (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      ) : (
                        <Maximize2 className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-widest text-white uppercase mb-2 border border-white/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" />
                      <span>
                        {item.media.kind === "video" ? "Master Film Reel" : "35mm Photography"}
                      </span>
                    </span>
                    <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white group-hover:text-[#FF4D58] transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
      />
    </div>
  );
}
