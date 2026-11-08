"use client";

import React from "react";
import { GalleryCategory, GalleryItem } from "@music-label/shared";
import GalleryView from "@/components/site/GalleryView";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Camera } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

interface GalleryPageViewProps {
  categories: GalleryCategory[];
  items: GalleryItem[];
}

export default function GalleryPageView({ categories, items }: GalleryPageViewProps) {
  const { isDark } = useTheme();

  return (
    <div
      className={`flex flex-col w-full pt-32 pb-24 transition-colors duration-300 ${
        isDark ? "bg-[#08080A] text-[#F4F4F6]" : "bg-[#FAFAFC] text-[#09090B]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <MotionReveal direction="up">
            <div
              className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border mb-6 ${
                isDark
                  ? "border-[#E51E2B]/40 bg-[#E51E2B]/10 text-[#E51E2B]"
                  : "border-[#E51E2B]/40 bg-red-50/80 text-[#E51E2B]"
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-[#E51E2B]" />
              <span className="text-xs font-semibold tracking-[0.25em] uppercase">
                Visual Archive
              </span>
            </div>

            <h1
              className={`font-heading font-extrabold text-4xl sm:text-6xl uppercase tracking-tight ${
                isDark ? "text-white" : "text-[#09090B]"
              }`}
            >
              Collections & Events
            </h1>

            <p
              className={`mt-4 text-sm sm:text-base font-light ${
                isDark ? "text-zinc-600" : "text-zinc-600"
              }`}
            >
              An intimate photographic look inside recording consoles, worldwide arena stages, and
              cinematic film sets.
            </p>
          </MotionReveal>
        </div>

        {/* Gallery View with tabs and full-screen lightbox */}
        <GalleryView categories={categories} items={items} />

        {/* Short Description Section at Bottom */}
        <div
          className={`mt-24 p-8 sm:p-12 rounded-3xl text-center max-w-4xl mx-auto border shadow-lg transition-all ${
            isDark
              ? "bg-[#121217] border-white/10 text-zinc-300 shadow-black/40"
              : "bg-white border-black/10 text-zinc-600"
          }`}
        >
          <Camera className="w-6 h-6 text-[#E51E2B] mx-auto mb-4" />
          <h3
            className={`font-heading font-bold text-xl sm:text-2xl uppercase tracking-wider ${
              isDark ? "text-white" : "text-[#09090B]"
            }`}
          >
            Archival Photography & Press Access
          </h3>
          <p
            className={`mt-4 text-sm sm:text-base font-light leading-relaxed ${
              isDark ? "text-zinc-300" : "text-zinc-600"
            }`}
          >
            All imagery captured on 35mm film, medium format analog cameras, and Arri Alexa cinema
            systems during live performances and studio tracking. High-resolution press kits and
            editorial licensing packages are available through our media relations office.
          </p>
        </div>
      </div>
    </div>
  );
}
