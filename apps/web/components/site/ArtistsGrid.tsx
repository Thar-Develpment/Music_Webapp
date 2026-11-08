"use client";

import React, { useState } from "react";
import { Artist, Manager } from "@music-label/shared";
import { MotionReveal, StaggerContainer, StaggerItem } from "@/components/animations/MotionReveal";
import { GlassTiltCard } from "@/components/animations/GlassTiltCard";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Radio,
  Volume2,
  Sliders,
  Cast,
  ChevronLeft,
  ChevronRight,
  Disc,
} from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/components/theme/ThemeProvider";

interface ArtistsGridProps {
  artists?: Artist[];
  managers?: Manager[];
}

export default function ArtistsGrid({ artists = [], managers = [] }: ArtistsGridProps) {
  const { isDark } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  if (!artists || artists.length === 0) {
    return null;
  }

  const activeArtist = artists[activeIndex] || artists[0];
  if (!activeArtist) return null;

  const handlePrev = () => {
    const nextIdx = activeIndex === 0 ? artists.length - 1 : activeIndex - 1;
    setActiveIndex(nextIdx);
    const el = audioRef.current;
    if (el && isPlaying) {
      el.src = artists[nextIdx]?.audioUrl || "/audio/track-1.mp3";
      el.load();
      el.play().catch(() => {});
    }
  };

  const handleNext = () => {
    const nextIdx = activeIndex === artists.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIdx);
    const el = audioRef.current;
    if (el && isPlaying) {
      el.src = artists[nextIdx]?.audioUrl || "/audio/track-1.mp3";
      el.load();
      el.play().catch(() => {});
    }
  };

  const toggleAudio = (targetArtist?: Artist) => {
    const el = audioRef.current;
    if (!el) return;
    const currentTarget = targetArtist || activeArtist;
    const url = currentTarget?.audioUrl || "/audio/track-1.mp3";

    if (!el.paused && activeArtist && activeArtist.id === currentTarget?.id) {
      el.pause();
    } else {
      if (el.src !== url && !el.src.endsWith(url)) {
        el.src = url;
        el.load();
      }
      el.play().catch((err) => console.log("Audio play blocked:", err));
    }
  };

  return (
    <section id="artists-section" className={`py-20 relative overflow-hidden select-none border-t transition-colors duration-300 ${
      isDark ? "bg-[#08080A] border-white/10" : "bg-[#FAFAFC] border-black/[0.06]"
    }`}>
      <audio
        ref={audioRef}
        src={activeArtist?.audioUrl || "/audio/track-1.mp3"}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => console.log("Audio error:", e)}
      />
      {/* Background Ambient Red Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[#e11d48]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* =========================================================
            HEADER: ARTISTS SECTION (THEME ADAPTIVE)
           ========================================================= */}
        <div className="text-center mb-12">
          <MotionReveal direction="up">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-frosted border border-[#e11d48]/40 shadow-sm mb-4">
              <Radio className="w-3.5 h-3.5 text-[#e11d48] animate-pulse" />
              <span className="text-xs font-bold tracking-[0.25em] text-[#e11d48] uppercase">
                Sonic Creators & Visionaries
              </span>
            </div>
            <h2 className={`font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight mb-2 transition-colors ${
              isDark ? "text-white" : "text-[#09090B]"
            }`}>
              ARTISTS
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-[#2563EB] via-[#e11d48] to-[#facc15] mx-auto mb-4" />
            <p className={`text-xs sm:text-sm font-light tracking-wide max-w-lg mx-auto transition-colors ${
              isDark ? "text-zinc-600" : "text-zinc-600"
            }`}>
              Those who bring art to people with open eyes and open ears
            </p>
          </MotionReveal>

          {/* Quick Select Square Artist Strip */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto py-2">
            {artists.map((artist, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={artist.id}
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsPlaying(true);
                  }}
                  className={`group relative flex flex-col items-center p-1.5 rounded-2xl transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? isDark
                        ? "bg-red-950/40 shadow-md shadow-red-950/20"
                        : "bg-red-50/80 shadow-md shadow-red-500/10"
                      : isDark
                      ? "hover:bg-white/[0.05] opacity-80 hover:opacity-100"
                      : "hover:bg-zinc-100 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                      isSelected
                        ? "border-2 border-[#e11d48] shadow-md shadow-[#e11d48]/30 scale-105"
                        : isDark
                        ? "border border-white/10 group-hover:border-[#e11d48]/70"
                        : "border border-black/10 group-hover:border-[#e11d48]/70"
                    }`}
                  >
                    <img
                      src={artist?.photoUrl || "/logo-icon.png"}
                      alt={artist?.name || "Artist"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <span
                    className={`mt-2 text-[11px] font-bold tracking-wider uppercase truncate max-w-[85px] transition-colors ${
                      isSelected
                        ? "text-[#e11d48]"
                        : isDark
                        ? "text-zinc-600 group-hover:text-white"
                        : "text-zinc-600 group-hover:text-black"
                    }`}
                  >
                    {artist.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            3D SPOTIFY-STYLE GLASS HORIZONTAL SQUARE CARD CAROUSEL
           ========================================================= */}
        <div className="mt-6 mb-24 relative flex flex-col items-center">
          
          {/* Top Brand Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-frosted border border-[#e11d48]/35 shadow-sm mb-8">
            <Radio className="w-3.5 h-3.5 text-[#e11d48] animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#e11d48] uppercase">
              One Roof Sessions • Spatial Master
            </span>
          </div>

          {/* 3D Cards Perspective Stage with Square Cards */}
          <div className="relative w-full max-w-4xl h-[380px] sm:h-[440px] flex items-center justify-center overflow-hidden perspective-[1200px]">
            {artists.map((artist, idx) => {
              // Calculate offset relative to activeIndex
              let offset = idx - activeIndex;
              // Wrap around for circular loop calculation
              if (offset > artists.length / 2) offset -= artists.length;
              if (offset < -artists.length / 2) offset += artists.length;

              const isCenter = offset === 0;
              const isLeft1 = offset === -1;
              const isLeft2 = offset <= -2;
              const isRight1 = offset === 1;
              const isRight2 = offset >= 2;

              // Hide cards that are too far away for performance
              if (Math.abs(offset) > 2) return null;

              // 3D positioning styles
              let xTranslate = 0;
              let scale = 1;
              let rotateY = 0;
              let zIndex = 10;
              let opacity = 0.5;

              if (isCenter) {
                xTranslate = 0;
                scale = 1.05;
                rotateY = 0;
                zIndex = 30;
                opacity = 1;
              } else if (isLeft1) {
                xTranslate = -160;
                scale = 0.88;
                rotateY = 24;
                zIndex = 20;
                opacity = 0.85;
              } else if (isLeft2) {
                xTranslate = -280;
                scale = 0.74;
                rotateY = 34;
                zIndex = 10;
                opacity = 0.55;
              } else if (isRight1) {
                xTranslate = 160;
                scale = 0.88;
                rotateY = -24;
                zIndex = 20;
                opacity = 0.85;
              } else if (isRight2) {
                xTranslate = 280;
                scale = 0.74;
                rotateY = -34;
                zIndex = 10;
                opacity = 0.55;
              }

              return (
                <motion.div
                  key={artist.id}
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsPlaying(true);
                  }}
                  animate={{
                    x: xTranslate,
                    scale: scale,
                    rotateY: rotateY,
                    opacity: opacity,
                    zIndex: zIndex,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 24,
                  }}
                  className={`absolute w-[260px] sm:w-[310px] md:w-[350px] aspect-square rounded-3xl overflow-hidden cursor-pointer shadow-2xl ${
                    isCenter
                      ? "border-2 border-[#e11d48] shadow-[0_20px_60px_rgba(229,30,43,0.3)]"
                      : isDark
                      ? "border border-white/10 hover:border-[#e11d48]/50"
                      : "border border-black/10 hover:border-[#e11d48]/50"
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Square Artist Artwork / Photo */}
                  <div className="relative w-full h-full bg-[#121218]">
                    <img
                      src={artist?.photoUrl || "/logo-icon.png"}
                      alt={artist?.name || "Artist"}
                      className="w-full h-full object-cover transition-transform duration-700"
                    />

                    {/* Glassmorphic Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                    {/* Specular Shimmer Edge */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.12] to-transparent pointer-events-none" />

                    {/* Top Status Badge */}
                    <div className="absolute top-4 right-4 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] animate-ping" />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-white">
                        {artist.genre}
                      </span>
                    </div>

                    {/* Bottom Artist Info Container */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex flex-col justify-end text-center">
                      <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white uppercase tracking-tight">
                        {artist.name}
                      </h3>
                      <p className="text-xs text-[#FF4D58] font-bold tracking-widest uppercase mt-1">
                        Master Edition
                      </p>

                      {isCenter && (
                        <div className="mt-4 flex items-center justify-center space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAudio(artist);
                            }}
                            className="w-10 h-10 rounded-full bg-[#e11d48] text-white flex items-center justify-center hover:bg-[#D81A26] active:scale-95 transition-all shadow-lg shadow-[#e11d48]/40 cursor-pointer"
                            aria-label={isPlaying ? "Pause Artist Preview" : "Play Artist Preview"}
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4 fill-current" />
                            ) : (
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                          </button>

                          {artist.spotifyUrl && (
                            <a
                              href={artist.spotifyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:border-[#e11d48] text-xs font-semibold text-white hover:text-white transition-all flex items-center space-x-1.5"
                            >
                              <Disc className="w-3.5 h-3.5 text-[#e11d48] animate-spin" />
                              <span>Stream</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Left & Right Stage Arrow Controls */}
            <button
              onClick={handlePrev}
              className={`absolute left-2 sm:left-4 z-40 w-12 h-12 rounded-full border flex items-center justify-center hover:border-[#e11d48] hover:text-[#e11d48] hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-lg ${
                isDark
                  ? "bg-[#16161D] border-white/10 text-white"
                  : "bg-white border-black/10 text-zinc-800"
              }`}
              aria-label="Previous Artist"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className={`absolute right-2 sm:right-4 z-40 w-12 h-12 rounded-full border flex items-center justify-center hover:border-[#e11d48] hover:text-[#e11d48] hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-lg ${
                isDark
                  ? "bg-[#16161D] border-white/10 text-white"
                  : "bg-white border-black/10 text-zinc-800"
              }`}
              aria-label="Next Artist"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* =========================================================
              DOCKED GLASS PLAYER BAR
             ========================================================= */}
          <div className={`mt-8 w-full max-w-xl p-3 px-6 rounded-full backdrop-blur-xl border shadow-xl flex items-center justify-between gap-4 transition-colors duration-300 ${
            isDark ? "bg-[#0E0E14]/95 border-white/10" : "bg-white/95 border-black/[0.08]"
          }`}>
            {/* Playback Controls */}
            <div className={`flex items-center space-x-3 ${isDark ? "text-white" : "text-zinc-900"}`}>
              <button
                onClick={handlePrev}
                className="p-2 hover:text-[#e11d48] transition-colors cursor-pointer"
                aria-label="Previous Track"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-full bg-[#e11d48] text-white flex items-center justify-center hover:bg-[#D81A26] active:scale-95 transition-all shadow-md cursor-pointer"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNext}
                className="p-2 hover:text-[#e11d48] transition-colors cursor-pointer"
                aria-label="Next Track"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Currently Playing Capsule (Square Thumbnail) */}
            {activeArtist && (
              <div className={`flex items-center space-x-3 min-w-0 px-4 py-1.5 rounded-full border ${
                isDark ? "bg-white/[0.06] border-white/10" : "bg-zinc-100/80 border-black/5"
              }`}>
                <div className={`w-8 h-8 rounded-lg overflow-hidden shrink-0 border aspect-square ${
                  isDark ? "border-white/10" : "border-black/10"
                }`}>
                  <img
                    src={activeArtist.photoUrl || "/logo-icon.png"}
                    alt={activeArtist.name || "Artist"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex flex-col">
                  <span className={`text-xs font-bold truncate max-w-[140px] ${
                    isDark ? "text-white" : "text-zinc-900"
                  }`}>
                    {activeArtist.name || "One Roof Artist"}
                  </span>
                  <span className={`text-[10px] font-mono truncate max-w-[140px] ${
                    isDark ? "text-zinc-600" : "text-zinc-500"
                  }`}>
                    One Roof Master
                  </span>
                </div>

                {/* Animated Soundwave Bars */}
                <div className="flex items-end space-x-0.5 h-3 ml-1 shrink-0">
                  <span className={`w-0.5 rounded-full bg-[#e11d48] ${isPlaying ? "wave-bar-1" : "h-1"}`} />
                  <span className={`w-0.5 rounded-full bg-[#FF4D58] ${isPlaying ? "wave-bar-2" : "h-1"}`} />
                  <span className={`w-0.5 rounded-full bg-[#e11d48] ${isPlaying ? "wave-bar-3" : "h-1"}`} />
                  <span className={`w-0.5 rounded-full bg-[#FF4D58] ${isPlaying ? "wave-bar-4" : "h-1"}`} />
                </div>
              </div>
            )}

            {/* Media & Audio Action Icons */}
            <div className={`flex items-center space-x-3 ${isDark ? "text-zinc-600" : "text-zinc-500"}`}>
              <button className={`transition-colors cursor-pointer ${isDark ? "hover:text-white" : "hover:text-black"}`} title="AirPlay">
                <Cast className="w-4 h-4" />
              </button>
              <button className={`transition-colors cursor-pointer ${isDark ? "hover:text-white" : "hover:text-black"}`} title="Equalizer">
                <Sliders className="w-4 h-4" />
              </button>
              <button className={`transition-colors cursor-pointer ${isDark ? "hover:text-white" : "hover:text-black"}`} title="Volume">
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================
            PART 3: EXECUTIVE LEADERSHIP & MANAGEMENT SECTION
           ========================================================= */}
        <div className={`pt-20 border-t ${isDark ? "border-white/10" : "border-black/[0.08]"}`}>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <MotionReveal direction="up"> 
              <span className="text-xs font-bold tracking-[0.25em] text-[#e11d48] uppercase">
                Executive Leadership
              </span>
              <h3 className={`mt-2 font-heading font-extrabold text-2xl sm:text-4xl uppercase tracking-tight ${
                isDark ? "text-white" : "text-[#09090B]"
              }`}>
                Label Direction & Management
              </h3>
            </MotionReveal>
          </div>

          <StaggerContainer
            staggerDelay={0.15}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {managers.map((mgr) => (
              <StaggerItem key={mgr.id}>
                <GlassTiltCard className={`p-8 border shadow-xl glass-shimmer transition-colors ${
                  isDark
                    ? "border-white/10 bg-[#121217] hover:border-[#e11d48]/60"
                    : "border-black/10 bg-white hover:border-[#e11d48]/60"
                }`}>
                  <div className="flex flex-col sm:flex-row items-center space-y-5 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#e11d48]/40 shadow-md shadow-[#e11d48]/15 shrink-0 relative group aspect-square">
                      <img
                        src={mgr?.photoUrl || "/logo-icon.png"}
                        alt={mgr?.name || "Manager"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div>
                      <h4 className={`font-heading font-extrabold text-xl sm:text-2xl ${
                        isDark ? "text-white" : "text-zinc-900"
                      }`}>
                        {mgr.name}
                      </h4>
                      <p className="text-xs sm:text-sm font-bold text-[#e11d48] uppercase tracking-wider mt-1">
                        {mgr.role}
                      </p>
                      <p className={`text-xs mt-2.5 font-light leading-relaxed ${
                        isDark ? "text-zinc-600" : "text-zinc-600"
                      }`}>
                        Curating label repertoire, international orchestra tours, and archival vinyl releases.
                      </p>
                    </div>
                  </div>
                </GlassTiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
