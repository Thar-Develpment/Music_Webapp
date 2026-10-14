"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, ArrowRight, X, Volume2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { HomePageContent } from "@music-label/shared";

interface HeroSectionProps {
  content: HomePageContent["hero"];
}

export default function HeroSection({ content }: HeroSectionProps) {
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20">
      {/* Background Hero Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop')`,
            filter: "brightness(0.28) contrast(1.15)",
          }}
        />
        {/* Cinematic Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/50 to-[#070709]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Label Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-black/40 backdrop-blur-md mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
            {content.subheadline || "SONIC IMMERSION & ELEVATED ARTISTRY"}
          </span>
        </motion.div>

        {/* Primary Headline with line reveal */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[1.05] uppercase max-w-4xl"
        >
          {content.headline}
        </motion.h1>

        {/* Intro Text */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl font-light leading-relaxed"
        >
          {content.introText}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <a
            href="#artists-section"
            className="w-full sm:w-auto group inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] text-[#070709] font-bold text-sm tracking-wider uppercase shadow-xl shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/35 hover:scale-[1.02] transition-all duration-300"
            id="hero-cta-primary"
          >
            <span>{content.ctaPrimaryText || "Explore Roster"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <button
            onClick={() => setVideoModalOpen(true)}
            id="hero-cta-video"
            className="w-full sm:w-auto group inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-md text-white font-semibold text-sm tracking-wider uppercase hover:border-[#D4AF37]/50 hover:bg-white/[0.08] transition-all duration-300"
          >
            <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </div>
            <span>{content.ctaSecondaryText || "Watch Showreel"}</span>
          </button>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl"
            onClick={() => setVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black"
            >
              <button
                onClick={() => setVideoModalOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:text-[#D4AF37] transition-colors"
                aria-label="Close Showreel"
              >
                <X className="w-5 h-5" />
              </button>

              <iframe
                src={getEmbedUrl(content.featuredVideoUrl)}
                title="Featured Showreel"
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
