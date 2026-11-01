"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Disc3, Sliders, Activity } from "lucide-react";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { GlassTiltCard } from "@/components/animations/GlassTiltCard";
import { HomePageContent } from "@music-label/shared";
import { motion } from "motion/react";
import { useTheme } from "@/components/theme/ThemeProvider";

interface AboutTeaserProps {
  content: HomePageContent["aboutTeaser"];
}

const studioChannels = [
  { id: "ch-1", name: "Neve 88RS Custom", mode: "Analog Summing", gain: "+4.2 dB", rate: "192 kHz" },
  { id: "ch-2", name: "Dolby Atmos 9.1.6", mode: "Spatial Engine", gain: "0.0 dB", rate: "Direct Master" },
  { id: "ch-3", name: "Studer A800 24-Trk", mode: "Tape Saturation", gain: "+1.8 dB", rate: "30 IPS" },
];

export default function AboutTeaser({ content }: AboutTeaserProps) {
  const { isDark } = useTheme();
  const [activeChannel, setActiveChannel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const toggleAcousticFeed = () => {
    const el = audioRef.current;
    if (!el) return;
    if (!el.paused) {
      el.pause();
    } else {
      el.play().catch((err) => console.log("Audio play blocked:", err));
    }
  };

  return (
    <section className={`py-20 relative overflow-hidden transition-colors duration-300 border-t ${
      isDark
        ? "bg-gradient-to-b from-[#08080A] via-[#0D0D12] to-[#08080A] border-white/[0.08]"
        : "bg-gradient-to-b from-[#FAFAFC] via-[#F4F4F8] to-[#FAFAFC] border-black/[0.06]"
    }`}>
      {/* Background subtle crimson ambient warmth */}
      <div className="absolute top-1/2 left-0 w-[550px] h-[550px] bg-[#E51E2B]/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* =========================================================
              LEFT: DYNAMIC ANIMATED STUDIO CONTROL RIG & 3D TILT
             ========================================================= */}
          <div className="lg:col-span-5 relative">
            <MotionReveal direction="left" duration={0.8}>
              <GlassTiltCard className={`aspect-[4/5] border shadow-2xl group glass-shimmer ${
                isDark ? "border-white/10" : "border-black/[0.1]"
              }`}>
                <img
                  src={content.imageUrl}
                  alt="Velvet Noir Sound Studio"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <audio
                  ref={audioRef}
                  src="/audio/acoustic-feed.mp3"
                  loop
                  preload="auto"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
                {/* Top Status Capsule - Clickable Audio Feed */}
                <button
                  type="button"
                  onClick={toggleAcousticFeed}
                  className={`absolute top-5 left-5 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 z-20 ${
                    isPlaying
                      ? "bg-[#E51E2B] border-[#E51E2B] text-white"
                      : isDark ? "bg-[#121217]/90 border-[#E51E2B]/40 text-white" : "glass-frosted border-[#E51E2B]/40 text-zinc-900"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-white animate-pulse" : "bg-[#E51E2B] animate-ping"}`} />
                  <span className="text-[10px] font-bold tracking-widest uppercase">
                    {isPlaying ? "Feed Active • Click to Pause" : "Live Acoustic Feed • Click to Audition"}
                  </span>
                </button>

                {/* Floating Metric 1 (Top Right) */}
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute top-5 right-5 px-3 py-1.5 rounded-xl border text-[10px] font-mono shadow-md ${
                    isDark ? "bg-[#121217]/90 border-white/10 text-zinc-300" : "glass-frosted border-black/10 text-zinc-800"
                  }`}
                >
                  <span className="text-[#E51E2B] font-bold mr-1">THD</span>0.0003%
                </motion.div>

                {/* Interactive Realtime VU Meter Overlay */}
                <div className={`absolute bottom-28 left-6 right-6 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl ${
                  isDark ? "bg-[#121217]/95 border-white/10" : "glass-frosted border-black/10"
                }`}>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-3.5 h-3.5 text-[#E51E2B] animate-pulse" />
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? "text-white" : "text-zinc-900"
                      }`}>
                        Master Desk Telemetry
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#E51E2B] font-bold">
                      {studioChannels[activeChannel].gain}
                    </span>
                  </div>

                  {/* 12-Band Animated Spectrum Equalizer */}
                  <div className="flex items-end justify-between h-8 gap-1 px-1">
                    {[45, 80, 60, 95, 70, 85, 100, 75, 90, 65, 80, 50].map((baseHeight, idx) => (
                      <motion.div
                        key={idx}
                        className="w-full rounded-sm bg-gradient-to-t from-[#E51E2B] to-[#FF4D58]"
                        animate={{
                          height: [`${baseHeight * 0.4}%`, `${baseHeight}%`, `${baseHeight * 0.6}%`],
                        }}
                        transition={{
                          duration: 0.8 + (idx % 4) * 0.25,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Floating Studio Badge */}
                <div className={`absolute bottom-6 left-6 right-6 p-4 rounded-2xl border flex items-center space-x-4 shadow-2xl ${
                  isDark ? "bg-[#16161D]/95 border-white/10" : "bg-white/95 border-black/10"
                }`}>
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center text-[#E51E2B] shadow-md shadow-[#E51E2B]/20 shrink-0 ${
                    isDark ? "bg-red-950/60 border-[#E51E2B]/40" : "bg-red-50 border-[#E51E2B]/40"
                  }`}>
                    <Disc3 className="w-6 h-6 animate-[spin_8s_linear_infinite]" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs uppercase tracking-widest font-bold truncate ${
                      isDark ? "text-white" : "text-zinc-900"
                    }`}>
                      Dolby Atmos 9.1.6 Room
                    </p>
                    <p className={`text-[11px] font-light mt-0.5 truncate ${
                      isDark ? "text-zinc-400" : "text-zinc-500"
                    }`}>
                      Decoupled Floating Acoustic Sanctuary
                    </p>
                  </div>
                </div>
              </GlassTiltCard>
            </MotionReveal>
          </div>

          {/* =========================================================
              RIGHT: EDITORIAL PHILOSOPHY & ANIMATED CHANNEL SWITCHER
             ========================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <MotionReveal direction="right" duration={0.8}>
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-frosted border border-[#E51E2B]/40 shadow-sm mb-6 self-start">
                <Sliders className="w-3.5 h-3.5 text-[#E51E2B]" />
                <span className="text-xs font-bold tracking-[0.25em] text-[#E51E2B] uppercase">
                  Artistic Philosophy & Sonic Craft
                </span>
              </div>

              <h2 className={`font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase leading-[1.08] transition-colors ${
                isDark ? "text-white" : "text-[#09090B]"
              }`}>
                {content.heading}
              </h2>

              <p className={`mt-7 text-base sm:text-lg leading-relaxed font-light transition-colors ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}>
                {content.bio}
              </p>

              {/* Animated Studio Channel Switcher */}
              <div className={`mt-8 p-4 rounded-2xl glass-panel border ${
                isDark ? "border-white/10" : "border-black/10"
              }`}>
                <div className={`text-[11px] font-bold tracking-widest uppercase mb-3 flex items-center justify-between ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}>
                  <span>Active Channel Routing</span>
                  <span className="text-[#E51E2B]">Click to Switch Signal Path</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {studioChannels.map((ch, idx) => {
                    const isSelected = activeChannel === idx;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => setActiveChannel(idx)}
                        className={`p-3 rounded-xl text-left transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? isDark
                              ? "bg-red-950/40 border border-[#E51E2B] shadow-md shadow-[#E51E2B]/20"
                              : "bg-red-50 border border-[#E51E2B] shadow-md shadow-[#E51E2B]/15"
                            : isDark
                            ? "bg-white/[0.04] border border-white/10 hover:border-white/25"
                            : "bg-white border border-black/10 hover:border-black/25"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold truncate ${
                            isSelected ? "text-[#E51E2B]" : isDark ? "text-white" : "text-zinc-900"
                          }`}>{ch.name}</span>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#E51E2B] animate-ping" />}
                        </div>
                        <span className="text-[10px] text-zinc-400 block font-mono">{ch.mode}</span>
                        <span className="text-[10px] text-[#E51E2B] font-mono font-bold block mt-1">{ch.rate}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Architectural features badges */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl glass-panel border flex items-center space-x-3 group hover:border-[#E51E2B]/60 transition-colors ${
                  isDark ? "border-white/10" : "border-black/10"
                }`}>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[#E51E2B] font-bold text-xs group-hover:scale-110 transition-transform ${
                    isDark ? "bg-red-950/40" : "bg-red-100"
                  }`}>
                    01
                  </span>
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wider block ${
                      isDark ? "text-white" : "text-zinc-900"
                    }`}>
                      Custom Neve Desks
                    </span>
                    <span className={`text-[11px] font-light ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                      Pure Class-A discrete analog path
                    </span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl glass-panel border flex items-center space-x-3 group hover:border-[#E51E2B]/60 transition-colors ${
                  isDark ? "border-white/10" : "border-black/10"
                }`}>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[#E51E2B] font-bold text-xs group-hover:scale-110 transition-transform ${
                    isDark ? "bg-red-950/40" : "bg-red-100"
                  }`}>
                    02
                  </span>
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wider block ${
                      isDark ? "text-white" : "text-zinc-900"
                    }`}>
                      Direct-to-Lacquer Cut
                    </span>
                    <span className={`text-[11px] font-light ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                      45 RPM 180g virgin vinyl presses
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href="/about"
                  id="about-teaser-button"
                  className="group inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-[#E51E2B] hover:bg-[#D81A26] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-[#E51E2B]/20 hover:scale-105 transition-all duration-300"
                >
                  <span>{content.buttonText || "Learn More"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </MotionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
