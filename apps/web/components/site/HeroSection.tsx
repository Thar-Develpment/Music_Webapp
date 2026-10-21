"use client";

import React, { useState } from "react";
import { Play, ArrowRight, X, Disc3, Radio, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { HomePageContent } from "@music-label/shared";
import { useTheme } from "@/components/theme/ThemeProvider";

interface HeroSectionProps {
  content: HomePageContent["hero"];
}

export default function HeroSection({ content }: HeroSectionProps) {
  const { isDark } = useTheme();
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Extract embed URL if it's YouTube
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      const id = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
    }
    return url;
  };

  return (
    <section className={`relative min-h-[105vh] flex items-center justify-center overflow-hidden pt-32 pb-24 transition-colors duration-300 ${
      isDark ? "bg-[#08080A]" : "bg-[#FAFAFC]"
    }`}>
      {/* Background Hero Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop')`,
            filter: isDark ? "brightness(0.6) contrast(1.15)" : "brightness(0.9) contrast(1.05) grayscale(20%)",
            opacity: isDark ? 0.35 : 0.22,
          }}
        />
        {/* Soft Atmosphere Gradients */}
        <div className={`absolute inset-0 transition-colors duration-300 ${
          isDark
            ? "bg-gradient-to-t from-[#08080A] via-[#08080A]/75 to-[#08080A]/95"
            : "bg-gradient-to-t from-[#FAFAFC] via-[#FAFAFC]/65 to-[#FAFAFC]/90"
        }`} />
        <div className={`absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(circle_at_50%_40%,rgba(229,30,43,0.18)_0%,transparent_65%)]"
            : "bg-[radial-gradient(circle_at_50%_40%,rgba(229,30,43,0.08)_0%,transparent_65%)]"
        }`} />
      </div>

      {/* Floating Decorative Glass Capsules */}
      <div className="hidden lg:block absolute left-12 top-1/3 z-10">
        <div className="p-4 rounded-2xl glass-panel-red flex items-center space-x-3.5 shadow-xl">
          <div className={`w-10 h-10 rounded-xl border border-[#E51E2B]/40 flex items-center justify-center text-[#E51E2B] ${
            isDark ? "bg-red-950/60" : "bg-red-100/90"
          }`}>
            <Headphones className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#E51E2B] uppercase block">
              Spatial Mastering
            </span>
            <span className={`text-xs font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
              Dolby Atmos 9.1.6
            </span>
          </div>
        </div>
      </div>

      <div className="hidden lg:block absolute right-12 top-2/5 z-10">
        <div className="p-4 rounded-2xl glass-panel-red flex items-center space-x-3.5 shadow-xl">
          <div className={`w-10 h-10 rounded-full border border-[#E51E2B]/40 flex items-center justify-center text-[#E51E2B] ${
            isDark ? "bg-red-950/60" : "bg-red-100/90"
          }`}>
            <Disc3 className="w-5 h-5 animate-[spin_6s_linear_infinite]" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#E51E2B] uppercase block">
              Analog Sanctuary
            </span>
            <span className={`text-xs font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
              180g Marbled Vinyl
            </span>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Animated Soundwave Tagline Pill */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center space-x-3 px-5 py-2 rounded-full glass-frosted border border-[#E51E2B]/35 shadow-md mb-8 group cursor-default"
        >
          <div className="flex items-end space-x-0.5 h-3.5 text-[#E51E2B]">
            <span className="w-0.5 rounded-full bg-[#E51E2B] wave-bar-1" />
            <span className="w-0.5 rounded-full bg-[#FF4D58] wave-bar-2" />
            <span className="w-0.5 rounded-full bg-[#E51E2B] wave-bar-3" />
            <span className="w-0.5 rounded-full bg-[#B91C1C] wave-bar-4" />
          </div>

          <span className="text-xs font-bold tracking-[0.25em] text-[#E51E2B] uppercase">
            {content.subheadline || "SONIC IMMERSION & ELEVATED ARTISTRY"}
          </span>
        </motion.div>

        {/* Primary Headline in Crisp Deep Black or White */}
        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={`font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.04] uppercase max-w-4xl drop-shadow-sm transition-colors ${
            isDark ? "text-white" : "text-[#09090B]"
          }`}
        >
          {content.headline}
        </motion.h1>

        {/* Intro Narrative */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`mt-7 text-base sm:text-lg md:text-xl max-w-2xl font-light leading-relaxed transition-colors ${
            isDark ? "text-zinc-400" : "text-zinc-600"
          }`}
        >
          {content.introText}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
        >
          <a
            href="#artists-section"
            className="w-full sm:w-auto group relative inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-full bg-[#E51E2B] hover:bg-[#D81A26] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-[#E51E2B]/20 hover:scale-105 transition-all duration-300 cursor-pointer"
            id="hero-cta-primary"
          >
            <span>{content.ctaPrimaryText || "Explore Roster"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          {content.featuredVideoUrl && (
            <button
              onClick={() => setVideoModalOpen(true)}
              className={`w-full sm:w-auto group inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-full glass-frosted border hover:border-[#E51E2B] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-sm ${
                isDark
                  ? "border-white/10 text-zinc-200 hover:text-[#E51E2B] hover:bg-white/[0.04]"
                  : "border-black/10 text-zinc-800 hover:text-[#E51E2B] hover:bg-red-50/50"
              }`}
              id="hero-cta-video"
            >
              <div className="w-5 h-5 rounded-full bg-red-100 text-[#E51E2B] flex items-center justify-center">
                <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
              </div>
              <span>{content.ctaSecondaryText || "Watch Showreel"}</span>
            </button>
          )}
        </motion.div>
      </div>

      {/* Video Lightbox Modal */}
      <AnimatePresence>
        {videoModalOpen && content.featuredVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideoModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black"
            >
              <button
                onClick={() => setVideoModalOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#E51E2B] transition-colors cursor-pointer"
                aria-label="Close Video Modal"
              >
                <X className="w-5 h-5" />
              </button>

              <iframe
                src={getEmbedUrl(content.featuredVideoUrl)}
                title="Velvet Noir Featured Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
