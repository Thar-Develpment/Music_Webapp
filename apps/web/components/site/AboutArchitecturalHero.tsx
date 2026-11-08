"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

interface Hotspot {
  id: string;
  top: string;
  left: string;
  title: string;
  detail: string;
}

const hotspots: Hotspot[] = [
  {
    id: "hotspot-1",
    top: "58%",
    left: "29%",
    title: "Decoupled Foundation",
    detail: "Floating dual-slab concrete foundation with elastomeric bearings yielding STC 74 ground isolation.",
  },
  {
    id: "hotspot-2",
    top: "49%",
    left: "56%",
    title: "Triple-Glazed Sound Wall",
    detail: "Argon-filled laminated acoustic glass panels canted at 12° to eliminate internal standing reflections.",
  },
  {
    id: "hotspot-3",
    top: "74%",
    left: "68%",
    title: "Spatial Mixing Array",
    detail: "Dolby Atmos 9.1.6 Genelec Smart Active Monitors flush-mounted into charred cedar Helmholtz diffusers.",
  },
];

export default function AboutArchitecturalHero() {
  const { isDark } = useTheme();
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("ACOUSTICS");

  const tabs = ["ACOUSTICS", "PHILOSOPHY", "DISCOGRAPHY", "STUDIOS"];

  return (
    <section
      className={`relative w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16 select-none overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-[#08080A]" : "bg-[#FAFAFC]"
      }`}
    >
      {/* Outer Editorial Glass Stage matching Reference Image 2 in White & Red or Black & Red Theme */}
      <div
        className={`relative max-w-7xl mx-auto rounded-3xl overflow-hidden border transition-all duration-300 ${
          isDark
            ? "border-white/10 bg-[#121217] shadow-[0_20px_70px_rgba(0,0,0,0.7)]"
            : "border-black/10 bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)]"
        } min-h-[720px] lg:min-h-[820px] flex flex-col justify-between p-6 sm:p-10 lg:p-12`}
      >
        {/* =========================================================
            BACKGROUND ARCHITECTURAL ATMOSPHERE & MIST
           ========================================================= */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Architectural Concrete / Glass Pavilion Building Visual */}
          <div className="absolute inset-x-0 bottom-0 h-[68%] sm:h-[72%] lg:h-[76%] z-10">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop"
              alt="One Roof Acoustic Sanctuary"
              className={`w-full h-full object-cover object-center ${
                isDark ? "brightness-[0.7] contrast-[1.15]" : "brightness-[0.92] contrast-[1.05]"
              }`}
            />
            {/* Vignette and atmospheric gradient overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t ${
                isDark
                  ? "from-[#121217] via-[#121217]/50 to-transparent"
                  : "from-white via-white/40 to-transparent"
              }`}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-r ${
                isDark
                  ? "from-[#121217]/80 via-transparent to-[#121217]/80"
                  : "from-white/70 via-transparent to-white/70"
              }`}
            />
            <div className="absolute inset-0 bg-[#e11d48]/[0.02] mix-blend-color" />
          </div>
        </div>

        {/* =========================================================
            ROW 1: TOP ARCHITECTURAL PILL NAV & MINIMAL METADATA
           ========================================================= */}
        <div
          className={`relative z-30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b ${
            isDark ? "border-white/10" : "border-black/[0.08]"
          }`}
        >
          {/* Left: Pill Navigation Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-[#e11d48] text-white shadow-md shadow-red-500/20 scale-105"
                      : isDark
                      ? "bg-black/60 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10"
                      : "bg-white/90 hover:bg-zinc-100 text-zinc-700 hover:text-black border border-black/10"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Center: Studio Architecture Mark */}
          <div className="flex items-center space-x-3">
            <div
              className={`grid grid-cols-3 gap-0.5 p-1 rounded-md border ${
                isDark ? "bg-zinc-800 border-white/10" : "bg-zinc-100 border-black/10"
              }`}
            >
              {[...Array(9)].map((_, i) => (
                <span
                  key={i}
                  className={`w-1 h-1 rounded-full ${isDark ? "bg-zinc-300" : "bg-zinc-800"}`}
                />
              ))}
            </div>
            <div>
              <span
                className={`text-xs font-extrabold uppercase tracking-widest block ${
                  isDark ? "text-white" : "text-[#09090B]"
                }`}
              >
                ONE ROOF
              </span>
              <span className="text-[10px] text-zinc-600 uppercase tracking-wider block">
                entertainment architecture
              </span>
            </div>
          </div>

          {/* Right: Year & Minimalist Specification List */}
          <div className="flex items-center space-x-8 text-right">
            <div>
              <span className="text-xs font-mono font-bold text-[#e11d48] block">2026</span>
              <span className="text-[11px] text-zinc-600 tracking-wide block">
                Architecture of Pure Sound
              </span>
            </div>

            <div className="hidden sm:flex flex-col text-left text-[11px] text-zinc-600 space-y-0.5 font-mono">
              <span className="hover:text-[#e11d48] transition-colors">— Compactness</span>
              <span className="hover:text-[#e11d48] transition-colors">— Decoupled Purity</span>
              <span className="hover:text-[#e11d48] transition-colors">— Spatial Minimalism</span>
            </div>
          </div>
        </div>

        {/* =========================================================
            ROW 2: MASSIVE BACKGROUND TYPOGRAPHY WITH OVERLAPPING SCRIPT
            (Matching "TERRA" + "cotta" from reference image)
           ========================================================= */}
        <div className="relative z-20 my-auto py-8">
          <div className="relative">
            {/* Giant Monolithic Header */}
            <h1
              className={`font-heading font-black text-[13vw] sm:text-[12vw] lg:text-[11vw] leading-[0.88] tracking-[-0.04em] uppercase select-none drop-shadow-sm ${
                isDark ? "text-white opacity-90" : "text-[#09090B] opacity-90"
              }`}
            >
              ONE ROOF
            </h1>

            {/* Overlapping Italic Script */}
            <div className="absolute right-2 sm:right-12 md:right-24 bottom-[-15%] sm:bottom-[-20%] z-30">
              <span className="font-serif italic font-normal text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#e11d48] tracking-normal drop-shadow-md select-none">
                entertainment
              </span>
            </div>
          </div>

          {/* Interactive Glowing Hotspot Markers on the Building */}
          {hotspots.map((spot) => {
            const isOpen = activeHotspot === spot.id;
            return (
              <div
                key={spot.id}
                style={{ top: spot.top, left: spot.left }}
                className="absolute z-40 -translate-x-1/2 -translate-y-1/2"
              >
                <button
                  onClick={() => setActiveHotspot(isOpen ? null : spot.id)}
                  onMouseEnter={() => setActiveHotspot(spot.id)}
                  className="relative group p-2 cursor-pointer focus:outline-none"
                  aria-label={spot.title}
                >
                  {/* Pulsing Red Outer Ring */}
                  <span className="absolute inset-0 rounded-full bg-[#e11d48]/30 animate-ping pointer-events-none" />

                  {/* Inner Solid Dot with Red Border */}
                  <span
                    className={`relative block w-3.5 h-3.5 rounded-full border-2 border-[#e11d48] shadow-md transition-transform duration-300 group-hover:scale-125 ${
                      isDark ? "bg-[#121217]" : "bg-white"
                    }`}
                  />
                </button>

                {/* Hotspot Floating Spec Tooltip */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 p-3.5 rounded-2xl shadow-2xl backdrop-blur-xl text-left pointer-events-auto z-50 ${
                        isDark
                          ? "bg-[#181820]/95 border border-white/15 text-zinc-200"
                          : "bg-white/95 border border-black/10 text-zinc-900"
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 mb-1 text-[#e11d48]">
                        <Compass className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Acoustic Engineering
                        </span>
                      </div>
                      <h4
                        className={`text-xs font-bold uppercase ${
                          isDark ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        {spot.title}
                      </h4>
                      <p
                        className={`text-[11px] mt-1 leading-relaxed font-light ${
                          isDark ? "text-zinc-300" : "text-zinc-600"
                        }`}
                      >
                        {spot.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* =========================================================
            ROW 3: LOWER GLASS SPECS CARD & EDITORIAL PARAGRAPHS
           ========================================================= */}
        <div className="relative z-30 pt-8 mt-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          {/* Lower Left: Translucent Architecture Card */}
          <div className="lg:col-span-5">
            <div
              className={`p-5 sm:p-6 rounded-2xl border shadow-xl backdrop-blur-md max-w-md ${
                isDark
                  ? "bg-[#16161D]/90 border-white/10 text-zinc-300"
                  : "bg-white/90 border-black/10 text-zinc-700"
              }`}
            >
              <div className="space-y-1.5 text-xs font-light">
                <div
                  className={`flex items-center justify-between pb-1 border-b ${
                    isDark ? "border-white/10" : "border-black/5"
                  }`}
                >
                  <span className="text-zinc-600">Studio:</span>
                  <span className={`font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                    One Roof Acoustics
                  </span>
                </div>
                <div
                  className={`flex items-center justify-between pb-1 border-b ${
                    isDark ? "border-white/10" : "border-black/5"
                  }`}
                >
                  <span className="text-zinc-600">Acoustic Architect:</span>
                  <span className={`font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                    Decoupled Concrete & Cedar
                  </span>
                </div>
                <div
                  className={`flex items-center justify-between pb-1 border-b ${
                    isDark ? "border-white/10" : "border-black/5"
                  }`}
                >
                  <span className="text-zinc-600">Location:</span>
                  <span className={`font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                    Berlin • Los Angeles • Reykjavik
                  </span>
                </div>
                <div
                  className={`flex items-center justify-between pb-1 border-b ${
                    isDark ? "border-white/10" : "border-black/5"
                  }`}
                >
                  <span className="text-zinc-600">Footprint:</span>
                  <span className="font-mono font-bold text-[#e11d48]">
                    840 m² / 9.1.6 Chamber
                  </span>
                </div>
                <div
                  className={`flex items-center justify-between pb-1 border-b ${
                    isDark ? "border-white/10" : "border-black/5"
                  }`}
                >
                  <span className="text-zinc-600">Year:</span>
                  <span
                    className={`font-mono font-bold ${isDark ? "text-white" : "text-zinc-900"}`}
                  >
                    2026
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-zinc-600">Category:</span>
                  <span className={`font-bold ${isDark ? "text-white" : "text-zinc-800"}`}>
                    Analog & Spatial Audio Sanctuary
                  </span>
                </div>
              </div>
            </div>

            {/* Social Pill Links (Bottom-Left) */}
            <div className="mt-4 flex items-center space-x-2">
              {["Bē", "TG", "IG"].map((net) => (
                <span
                  key={net}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-bold transition-colors cursor-pointer shadow-sm ${
                    isDark
                      ? "bg-[#16161D] border-white/10 text-zinc-300 hover:text-[#e11d48] hover:border-[#e11d48]"
                      : "bg-white border-black/10 text-zinc-700 hover:text-[#e11d48] hover:border-[#e11d48]"
                  }`}
                >
                  {net}
                </span>
              ))}
            </div>
          </div>

          {/* Lower Right: Two Minimalist Editorial Paragraphs */}
          <div
            className={`lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm font-light leading-relaxed ${
              isDark ? "text-zinc-300" : "text-zinc-600"
            }`}
          >
            <p
              className={`border-l-2 border-[#e11d48] pl-4 p-3.5 rounded-r-xl border shadow-sm ${
                isDark
                  ? "bg-[#16161D]/90 border-white/10 text-zinc-300"
                  : "bg-white/90 border-black/5 text-zinc-600"
              }`}
            >
              Modernist acoustic brutalism engineered for absolute sonic fidelity: a monolithic
              decoupled concrete pavilion suspended above landscape to eradicate ground vibration
              and ambient low-frequency rumble.
            </p>
            <p
              className={`border-l-2 pl-4 p-3.5 rounded-r-xl border shadow-sm ${
                isDark
                  ? "border-zinc-700 bg-[#16161D]/90 border-white/10 text-zinc-300"
                  : "border-zinc-400 bg-white/90 border-black/5 text-zinc-600"
              }`}
            >
              Continuous motorized acoustic baffles and sound-isolation glass allow the live room to
              morph instantly from a dead, dry analog vocal booth into an expansive natural
              reverberation cathedral.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
