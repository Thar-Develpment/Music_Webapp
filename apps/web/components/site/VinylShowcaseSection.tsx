"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, Disc3, Volume2, ArrowRight, ChevronRight, ShoppingBag, Radio } from "lucide-react";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { useTheme } from "@/components/theme/ThemeProvider";
import { initialTracks } from "@/lib/mock-data";
import { Track } from "@music-label/shared";

interface VinylShowcaseSectionProps {
  tracks?: Track[];
}

export default function VinylShowcaseSection({ tracks = initialTracks }: VinylShowcaseSectionProps) {
  const { isDark } = useTheme();
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeTrack = tracks[selectedTrackIndex] || tracks[0];

  const handleTogglePlay = (idx: number) => {
    const el = audioRef.current;
    if (!el) return;

    if (selectedTrackIndex === idx) {
      if (!el.paused) {
        el.pause();
      } else {
        el.play().catch((err) => console.log("Audio play blocked:", err));
      }
    } else {
      setSelectedTrackIndex(idx);
      el.src = tracks[idx].audioUrl;
      el.load();
      el.play().catch((err) => console.log("Audio play blocked:", err));
    }
  };

  return (
    <section className={`relative w-full py-20 overflow-hidden select-none border-t transition-colors duration-300 ${
      isDark ? "bg-[#08080A] border-white/10" : "bg-[#FAFAFC] border-black/[0.08]"
    }`}>
      {/* Audio element for vinyl playback */}
      <audio
        ref={audioRef}
        src={activeTrack?.audioUrl}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => console.log("Audio error:", e)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading Tag */}
        <div className="text-center mb-12">
          <MotionReveal direction="up">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-frosted border border-[#e11d48]/40 shadow-sm mb-4">
              <Radio className="w-3.5 h-3.5 text-[#e11d48] animate-pulse" />
              <span className="text-xs font-bold tracking-[0.25em] text-[#e11d48] uppercase">
                Turntable Master Console
              </span>
            </div>
            <h2 className={`font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight ${
              isDark ? "text-white" : "text-[#09090B]"
            }`}>
              Vinylist Direct Master
            </h2>
          </MotionReveal>
        </div>

        {/* The Split Screen Player Card */}
        <div className={`relative rounded-3xl overflow-hidden border transition-all duration-300 ${
          isDark
            ? "border-white/10 bg-[#0B0B0E] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            : "border-black/[0.1] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] relative">
            
            {/* =========================================================
                LEFT SIDE: A Side Tracklist
               ========================================================= */}
            <div className={`lg:col-span-6 p-8 sm:p-12 z-10 flex flex-col justify-between relative transition-colors duration-300 ${
              isDark ? "bg-[#0B0B0E]" : "bg-white"
            }`}>
              {/* Subtle Watermark 'A side' */}
              <div className={`absolute top-12 left-10 text-[100px] sm:text-[140px] font-extrabold leading-none pointer-events-none font-heading select-none ${
                isDark ? "text-white/[0.03]" : "text-black/[0.03]"
              }`}>
                A side
              </div>

              <div>
                {/* Header User / Collection Tag */}
                <div className={`flex items-center justify-between mb-8 pb-4 border-b ${
                  isDark ? "border-white/10" : "border-black/[0.08]"
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full overflow-hidden border ${
                      isDark ? "border-white/10 bg-zinc-900" : "border-black/10 bg-zinc-100"
                    }`}>
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
                        alt="Collector"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-sm font-bold tracking-wide ${
                          isDark ? "text-white" : "text-zinc-900"
                        }`}>
                          One Roof Pressing #46
                        </span>
                        <span className="text-[10px] font-extrabold bg-[#e11d48] text-white px-1.5 py-0.5 rounded uppercase">
                          PRO
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-semibold block">
                        Collector Archival Cut • Direct Master
                      </span>
                    </div>
                  </div>

                  <span className="text-xs uppercase font-bold tracking-widest text-[#e11d48]">
                    stereo master
                  </span>
                </div>

                {/* Subtitle */}
                <div className="mb-6 flex items-center space-x-2">
                  <span className={`font-heading font-extrabold text-2xl sm:text-3xl tracking-tight ${
                    isDark ? "text-white" : "text-zinc-900"
                  }`}>
                    A side
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#e11d48] animate-ping" />
                </div>

                {/* Interactive Tracklist */}
                <div className="space-y-3">
                  {tracks.map((track, idx) => {
                    const isSelected = selectedTrackIndex === idx;
                    const isCurrentPlaying = isSelected && isPlaying;

                    return (
                      <div
                        key={track.id}
                        onClick={() => handleTogglePlay(idx)}
                        className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? isDark
                              ? "bg-red-950/40 border border-[#e11d48]/50 shadow-md shadow-red-950/20 scale-[1.01]"
                              : "bg-red-50/80 border border-[#e11d48]/50 shadow-md shadow-red-500/10 scale-[1.01]"
                            : isDark
                            ? "hover:bg-white/[0.04] border border-transparent"
                            : "hover:bg-zinc-50 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center space-x-4 min-w-0">
                          <span
                            className={`text-xs font-mono font-bold ${
                              isSelected ? "text-[#e11d48]" : "text-zinc-400"
                            }`}
                          >
                            {track.number}
                          </span>

                          {/* Track Icon / Badge */}
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                              track.badgeColor || "bg-[#e11d48]"
                            } text-white font-bold text-xs`}
                          >
                            {isCurrentPlaying ? (
                              <Pause className="w-3.5 h-3.5 fill-current" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h4
                              className={`text-sm sm:text-base font-bold truncate transition-colors ${
                                isSelected
                                  ? isDark ? "text-white" : "text-zinc-900"
                                  : isDark ? "text-zinc-300 group-hover:text-white" : "text-zinc-700 group-hover:text-black"
                              }`}
                            >
                              {track.title}
                            </h4>
                            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold block">
                              {track.artist} • {track.badge}
                            </span>
                          </div>
                        </div>

                        {/* Duration & Playing Bars */}
                        <div className="flex items-center space-x-3 shrink-0 pl-2">
                          {isCurrentPlaying && (
                            <div className="flex items-end space-x-0.5 h-3.5">
                              <span className="w-0.5 rounded-full bg-[#e11d48] wave-bar-1" />
                              <span className="w-0.5 rounded-full bg-[#FF4D58] wave-bar-2" />
                              <span className="w-0.5 rounded-full bg-[#e11d48] wave-bar-3" />
                            </div>
                          )}
                          <span
                            className={`text-xs font-mono font-semibold ${
                              isSelected ? "text-[#e11d48]" : "text-zinc-400"
                            }`}
                          >
                            {track.duration}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Vinylist Status */}
              <div className={`mt-8 pt-4 border-t flex items-center justify-between text-xs ${
                isDark ? "border-white/10 text-zinc-400" : "border-black/[0.08] text-zinc-500"
              }`}>
                <span className="uppercase tracking-widest font-bold">
                  45 RPM • 180g Audiophile Press
                </span>
                <span className="text-[#e11d48] font-bold">Master Fidelity 96kHz/24bit</span>
              </div>
            </div>

            {/* =========================================================
                RIGHT SIDE: ONE ROOF PRISMATIC SPECTRUM (Diagonal Split Cut)
               ========================================================= */}
            <div className="lg:col-span-6 relative z-0 flex flex-col justify-between p-8 sm:p-12 text-white bg-gradient-to-br from-[#1E3A8A] via-[#6B21A8] via-[#E11D48] to-[#EA580C]">
              {/* Slanted Angle Split Background Layer for Desktop */}
              <div
                className="hidden lg:block absolute inset-0 bg-gradient-to-br from-[#1E3A8A] via-[#6B21A8] via-[#E11D48] to-[#EA580C] -left-16"
                style={{
                  clipPath: "polygon(14% 0%, 100% 0%, 100% 100%, 0% 100%)",
                }}
              />

              {/* Watermark typography on gradient background */}
              <div className="absolute bottom-6 right-4 text-[70px] sm:text-[110px] font-black text-black/[0.12] leading-none pointer-events-none font-heading select-none uppercase">
                ONE ROOF
              </div>

              {/* Top Navigation & Controls */}
              <div className="relative z-10 flex items-center justify-end space-x-4 mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                    one roof console
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Disc3 className={`w-4 h-4 text-white ${isPlaying ? "animate-spin" : ""}`} />
                  </div>
                </div>
              </div>

              {/* Album Showcase & Metadata */}
              <div className="relative z-10 lg:pl-12 xl:pl-16">
                {/* Album Covers Row */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/40 group relative cursor-pointer hover:scale-105 transition-transform">
                    <img
                      src={activeTrack?.coverUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500&auto=format&fit=crop"}
                      alt="Album Cover"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>

                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-xl border border-white/20 opacity-80 hover:opacity-100 transition-opacity">
                    <img
                      src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=500&auto=format&fit=crop"
                      alt="Alternate Art"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Album Title & Metadata */}
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-white/80 block mb-1">
                    One Roof Entertainment • {activeTrack?.artist}
                  </span>
                  <h3 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight uppercase leading-tight">
                    {activeTrack?.title}
                  </h3>
                  <span className="text-xs font-semibold text-white/90 block mt-1">
                    {activeTrack?.album || "One Roof Sessions Vol. 1"} • 2026 Master
                  </span>
                </div>

                {/* Info Text */}
                <div className="mt-4 max-w-md">
                  <span className="text-xs uppercase font-bold tracking-wider text-white/90 block mb-1">
                    Acoustic Details
                  </span>
                  <p className="text-xs sm:text-sm text-white/85 font-light leading-relaxed">
                    {activeTrack?.description || "Crafted from original analog master reels, pressed on 180g virgin marbled vinyl at 45 RPM with custom Neve desk EQ for maximum dynamic presence."}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/music"
                    className="px-8 py-3.5 rounded-full bg-white text-[#0A0A0C] font-extrabold text-xs uppercase tracking-wider shadow-2xl hover:bg-zinc-100 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center space-x-2"
                  >
                    <Disc3 className="w-4 h-4 text-[#e11d48]" />
                    <span>Explore Discography</span>
                  </Link>

                  <Link
                    href="/gallery"
                    className="px-6 py-3.5 rounded-full border border-white/40 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>See Artwork</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Side Bottom Status */}
              <div className="relative z-10 mt-8 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-white/80 lg:pl-12">
                <span>Edition #46 • Limited Run</span>
                <span>Worldwide Sync Cleared</span>
              </div>
            </div>

            {/* =========================================================
                CENTER OVERLAY: MASSIVE SPINNING VINYL RECORD + TONEARM
                Positioned right over the vertical separation line
               ========================================================= */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none items-center justify-center">
              {/* Vinyl Disc Container */}
              <div className="relative w-[340px] xl:w-[400px] h-[340px] xl:h-[400px] rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-center justify-center">
                {/* Outer Vinyl Body with Grooves */}
                <div
                  className={`w-full h-full rounded-full bg-[#111114] border-[10px] border-[#0A0A0C] flex items-center justify-center relative shadow-[inset_0_0_50px_rgba(0,0,0,0.95)] ${
                    isPlaying ? "animate-[spin_10s_linear_infinite]" : ""
                  }`}
                  style={{
                    background:
                      "radial-gradient(circle, #0e0e12 0%, #15151b 25%, #08080a 40%, #17171f 55%, #08080a 70%, #1a1a24 85%, #060608 100%)",
                  }}
                >
                  {/* Subtle Grooved Lines */}
                  <div className="absolute inset-4 rounded-full border border-white/[0.04]" />
                  <div className="absolute inset-8 rounded-full border border-white/[0.05]" />
                  <div className="absolute inset-12 rounded-full border border-white/[0.04]" />
                  <div className="absolute inset-16 rounded-full border border-white/[0.05]" />
                  <div className="absolute inset-20 rounded-full border border-white/[0.04]" />
                  <div className="absolute inset-24 rounded-full border border-white/[0.05]" />

                  {/* Vinyl Specular Light Reflection (Diagonal Sheen) */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent pointer-events-none" />

                  {/* Center Label (One Roof Prismatic Ring + Insignia) */}
                  <div className="w-36 h-36 xl:w-44 xl:h-44 rounded-full bg-gradient-to-tr from-[#2563EB] via-[#7C3AED] via-[#E11D48] via-[#EA580C] to-[#FACC15] p-2 flex items-center justify-center shadow-2xl relative">
                    <div className="w-full h-full rounded-full bg-[#0C0C0F] border-2 border-white/20 flex flex-col items-center justify-center p-2 text-center">
                      <img
                        src="/logo-icon.png"
                        alt="One Roof Crest"
                        className="w-9 h-9 xl:w-11 xl:h-11 object-contain drop-shadow"
                      />
                      <span className="text-[9px] xl:text-[10px] font-heading font-extrabold uppercase tracking-widest text-white mt-1">
                        ONE ROOF
                      </span>
                      <span className="text-[7px] text-zinc-300 font-mono tracking-wider">
                        ENTERTAINMENT • 45 RPM
                      </span>
                    </div>
                  </div>
                </div>

                {/* Modern Metallic Turntable Tonearm Rig */}
                <div className="absolute -top-12 -right-8 w-24 h-48 pointer-events-none">
                  {/* Tonearm Pivot Base */}
                  <div className="w-10 h-10 rounded-full bg-[#202028] border-2 border-white/20 shadow-xl flex items-center justify-center absolute top-0 right-4">
                    <div className="w-4 h-4 rounded-full bg-[#e11d48] shadow-inner" />
                  </div>

                  {/* Tonearm Wand Rod */}
                  <div
                    className={`w-1.5 h-36 bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-600 rounded-full absolute top-8 right-8 shadow-lg origin-top transition-transform duration-700 ease-out ${
                      isPlaying ? "rotate-[28deg]" : "rotate-[8deg]"
                    }`}
                  >
                    {/* Cartridge & Stylus Needle Head */}
                    <div className="w-4 h-6 bg-[#0E0E12] border border-[#e11d48] rounded-sm absolute -bottom-1 -left-1 flex items-center justify-center shadow-md">
                      <span className="w-1 h-1 rounded-full bg-[#e11d48] animate-ping" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
