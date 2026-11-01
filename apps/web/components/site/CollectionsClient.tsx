"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  Disc3,
  Volume2,
  VolumeX,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Radio,
  Sliders,
  CheckCircle,
  Clock,
  Layers,
} from "lucide-react";
import { CollectionItem, Track } from "@music-label/shared";
import { MotionReveal, StaggerContainer, StaggerItem } from "@/components/animations/MotionReveal";
import { GlassTiltCard } from "@/components/animations/GlassTiltCard";
import { useTheme } from "@/components/theme/ThemeProvider";

interface CollectionsClientProps {
  collections: CollectionItem[];
  allTracks: Track[];
}

export default function CollectionsClient({ collections, allTracks }: CollectionsClientProps) {
  const { isDark } = useTheme();
  const [selectedCollectionId, setSelectedCollectionId] = useState(collections[0]?.id || "col-1");
  const [activeTrack, setActiveTrack] = useState<Track | null>(collections[0]?.tracks[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderedItemTitle, setOrderedItemTitle] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentCollection = collections.find((c) => c.id === selectedCollectionId) || collections[0];

  // Handle Play/Pause
  const togglePlayTrack = (track: Track) => {
    const el = audioRef.current;
    if (!el) return;

    if (activeTrack?.id === track.id) {
      if (!el.paused) {
        el.pause();
      } else {
        el.play().catch((err) => console.log("Audio play blocked:", err));
      }
    } else {
      setActiveTrack(track);
      el.src = track.audioUrl;
      el.load();
      el.play().catch((err) => console.log("Audio play blocked:", err));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const categories = [
    { id: "all", name: "All Vinyls" },
    { id: "flagship", name: "Flagship Masters" },
    { id: "limited", name: "Limited Edition" },
    { id: "analogue", name: "Pure Analogue" },
  ];

  const filteredCollections = collections.filter((item) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "flagship") return item.badge?.toLowerCase().includes("flagship") || item.badge?.toLowerCase().includes("gold");
    if (activeCategory === "limited") return item.badge?.toLowerCase().includes("limited");
    if (activeCategory === "analogue") return item.badge?.toLowerCase().includes("analogue");
    return true;
  });

  const handleOrder = (title: string) => {
    setOrderedItemTitle(title);
    setOrderModalOpen(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-[#08080A] text-[#F4F4F6]" : "bg-[#FAFAFC] text-[#09090B]"
    }`}>
      {/* Audio element for collection track playback */}
      <audio
        ref={audioRef}
        src={activeTrack?.audioUrl}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => console.log("Audio playback error:", e)}
      />

      {/* =========================================================
          1. HERO SECTION: LUXURY VINYL ARCHIVE
         ========================================================= */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/[0.08]">
        {/* Ambient Warm Crimson Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#E51E2B]/10 blur-[160px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
          <MotionReveal direction="up">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-frosted border border-[#E51E2B]/40 shadow-sm mb-6">
              <Radio className="w-3.5 h-3.5 text-[#E51E2B] animate-pulse" />
              <span className="text-xs font-bold tracking-[0.25em] text-[#E51E2B] uppercase">
                Archival Catalog • Audiophile Pressings
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight">
              Our Collections
            </h1>

            <p className={`mt-5 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}>
              Direct Metal Masters, 180g Virgin Vinyls, and Limited-Edition Boxsets cut from original half-inch magnetic tapes. Every release is an acoustic monument.
            </p>
          </MotionReveal>

          {/* Filter Navigation Pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#E51E2B] text-white shadow-lg shadow-[#E51E2B]/30 scale-105"
                    : isDark
                    ? "glass-frosted text-zinc-400 hover:text-white hover:border-white/20"
                    : "bg-white border border-black/10 text-zinc-600 hover:text-black hover:border-black/20"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          2. FEATURED INTERACTIVE VINYL PLAYER (Turnable Console)
         ========================================================= */}
      {currentCollection && (
        <section className={`py-16 border-b transition-colors ${
          isDark ? "bg-[#0B0B0F] border-white/[0.08]" : "bg-[#F7F7FA] border-black/[0.06]"
        }`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-2.5 h-2.5 rounded-full bg-[#E51E2B] animate-ping" />
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#E51E2B]">
                Now Loaded In Player Deck
              </span>
            </div>

            <div className={`rounded-3xl border overflow-hidden transition-all shadow-2xl ${
              isDark ? "bg-[#121218] border-white/10" : "bg-white border-black/10"
            }`}>
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Left Side: Sleeve Art + Massive Spinning Vinyl */}
                <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-black/20 to-black/60">
                  <div className="relative w-[280px] sm:w-[340px] aspect-square flex items-center justify-center">
                    
                    {/* Vinyl Record Behind Sleeve */}
                    <motion.div
                      animate={{
                        rotate: isPlaying ? 360 : 0,
                        x: isPlaying ? 40 : 20,
                      }}
                      transition={{
                        rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                        x: { duration: 0.6, ease: "easeOut" },
                      }}
                      className="absolute w-[260px] sm:w-[310px] aspect-square rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-[8px] border-[#0A0A0C] flex items-center justify-center pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, #0e0e12 0%, #15151b 25%, #08080a 40%, #17171f 55%, #08080a 70%, #1a1a24 85%, #060608 100%)`,
                      }}
                    >
                      {/* Center Vinyl Label with dynamic vinyl color */}
                      <div
                        className="w-24 h-24 rounded-full flex flex-col items-center justify-center text-center p-2 text-[8px] font-bold uppercase tracking-wider text-white shadow-inner"
                        style={{ backgroundColor: currentCollection.vinylColor || "#E51E2B" }}
                      >
                        <Disc3 className="w-4 h-4 mb-0.5 animate-spin" />
                        <span className="truncate w-full">{currentCollection.catalogNumber}</span>
                        <span className="text-[7px] opacity-80">45 RPM</span>
                      </div>
                    </motion.div>

                    {/* Album Jacket Front Cover */}
                    <div className="relative z-10 w-[240px] sm:w-[280px] aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                      <img
                        src={currentCollection.coverUrl}
                        alt={currentCollection.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#E51E2B] block">
                          {currentCollection.year} • {currentCollection.catalogNumber}
                        </span>
                        <h4 className="font-heading font-bold text-sm truncate uppercase">
                          {currentCollection.title}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Format & Catalog Capsule */}
                  <div className="mt-8 flex items-center space-x-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-[#E51E2B]/20 text-[#E51E2B] font-bold border border-[#E51E2B]/30 uppercase">
                      {currentCollection.format}
                    </span>
                    <span className="text-zinc-400 font-mono">
                      {currentCollection.catalogNumber}
                    </span>
                  </div>
                </div>

                {/* Right Side: Tracklist & Interactive Playback Engine */}
                <div className={`lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between border-t lg:border-t-0 lg:border-l ${
                  isDark ? "border-white/10" : "border-black/10"
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs uppercase font-extrabold tracking-widest text-[#E51E2B]">
                        {currentCollection.artist}
                      </span>
                      {currentCollection.badge && (
                        <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider">
                          {currentCollection.badge}
                        </span>
                      )}
                    </div>

                    <h2 className="font-heading font-extrabold text-2xl sm:text-3xl uppercase tracking-tight">
                      {currentCollection.title}
                    </h2>

                    <p className={`mt-3 text-xs sm:text-sm font-light leading-relaxed ${
                      isDark ? "text-zinc-400" : "text-zinc-600"
                    }`}>
                      {currentCollection.description}
                    </p>

                    {/* Master Tracklist */}
                    <div className="mt-8 space-y-2.5">
                      <span className="text-xs uppercase font-bold tracking-widest text-zinc-400 block mb-3">
                        Select Track To Audition (Stereo Master)
                      </span>

                      {currentCollection.tracks.map((track, idx) => {
                        const isCurrentPlaying = activeTrack?.id === track.id && isPlaying;
                        const isSelected = activeTrack?.id === track.id;

                        return (
                          <div
                            key={track.id}
                            onClick={() => togglePlayTrack(track)}
                            className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#E51E2B]/10 border-[#E51E2B] shadow-sm"
                                : isDark
                                ? "border-white/[0.06] hover:bg-white/[0.04] hover:border-white/15"
                                : "border-black/[0.06] hover:bg-black/[0.03] hover:border-black/15"
                            }`}
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <button
                                type="button"
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                                  isCurrentPlaying
                                    ? "bg-[#E51E2B] text-white scale-105"
                                    : "bg-white/10 text-[#E51E2B] group-hover:scale-105"
                                }`}
                              >
                                {isCurrentPlaying ? (
                                  <Pause className="w-3.5 h-3.5 fill-current" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                )}
                              </button>

                              <div className="min-w-0">
                                <h5 className={`text-xs sm:text-sm font-bold truncate ${
                                  isSelected ? "text-[#E51E2B]" : isDark ? "text-white" : "text-black"
                                }`}>
                                  {track.number}. {track.title}
                                </h5>
                                <span className="text-[10px] text-zinc-400">
                                  {track.artist}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 shrink-0">
                              {isCurrentPlaying && (
                                <div className="flex items-end space-x-0.5 h-3">
                                  <span className="w-0.5 h-full rounded-full bg-[#E51E2B] animate-pulse" />
                                  <span className="w-0.5 h-2/3 rounded-full bg-[#E51E2B] animate-pulse delay-75" />
                                  <span className="w-0.5 h-full rounded-full bg-[#E51E2B] animate-pulse delay-150" />
                                </div>
                              )}
                              <span className="text-xs font-mono text-zinc-400">
                                {track.duration}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions & Ordering */}
                  <div className="mt-8 pt-6 border-t flex flex-wrap items-center justify-between gap-4 border-white/10">
                    <button
                      onClick={() => handleOrder(currentCollection.title)}
                      className="px-6 py-3 rounded-full bg-[#E51E2B] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#E51E2B]/30 hover:bg-[#D81A26] active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Order Vinyl Edition</span>
                    </button>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={toggleMute}
                        className={`p-2.5 rounded-full border transition-colors ${
                          isDark ? "border-white/10 hover:bg-white/10" : "border-black/10 hover:bg-black/5"
                        }`}
                        title={isMuted ? "Unmute" : "Mute Audio"}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      <Link
                        href="/contact"
                        className={`px-4 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-colors ${
                          isDark ? "border-white/15 hover:bg-white/5" : "border-black/15 hover:bg-black/5"
                        }`}
                      >
                        Inquire Licensing
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          3. FULL CATALOG GRID (All Releases)
         ========================================================= */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#E51E2B]">
                Archival Vault
              </span>
              <h3 className="font-heading font-extrabold text-3xl sm:text-4xl uppercase tracking-tight mt-1">
                Complete Discography
              </h3>
            </div>
            <span className="text-xs text-zinc-400 font-mono">
              Showing {filteredCollections.length} Archival Pressings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredCollections.map((col) => {
              const isSelected = selectedCollectionId === col.id;
              return (
                <div
                  key={col.id}
                  onClick={() => setSelectedCollectionId(col.id)}
                  className={`group rounded-3xl border overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-[#E51E2B] shadow-xl shadow-[#E51E2B]/15 scale-[1.02]"
                      : isDark
                      ? "bg-[#101015] border-white/10 hover:border-white/20"
                      : "bg-white border-black/10 hover:border-black/20"
                  }`}
                >
                  {/* Album Cover Art */}
                  <div className="relative aspect-square overflow-hidden bg-black/40">
                    <img
                      src={col.coverUrl}
                      alt={col.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/10">
                        {col.year}
                      </span>
                      {col.badge && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E51E2B] text-white">
                          {col.badge}
                        </span>
                      )}
                    </div>

                    {/* Quick Load Tag */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-xs font-mono font-bold">
                        {col.tracks.length} Tracks
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#E51E2B] transition-colors">
                        <Disc3 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Album Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#E51E2B] block">
                        {col.artist}
                      </span>
                      <h4 className="font-heading font-extrabold text-base uppercase tracking-tight mt-1 truncate">
                        {col.title}
                      </h4>
                      <p className={`mt-2 text-xs font-light line-clamp-2 ${
                        isDark ? "text-zinc-400" : "text-zinc-600"
                      }`}>
                        {col.subtitle}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t flex items-center justify-between text-xs border-white/10">
                      <span className="text-zinc-400 font-mono text-[11px]">
                        {col.catalogNumber}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCollectionId(col.id);
                          window.scrollTo({ top: 380, behavior: "smooth" });
                        }}
                        className="text-[#E51E2B] font-bold uppercase tracking-wider hover:underline flex items-center space-x-1"
                      >
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          ORDER INQUIRY MODAL
         ========================================================= */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className={`w-full max-w-md rounded-3xl p-8 border shadow-2xl relative ${
            isDark ? "bg-[#121218] border-white/20 text-white" : "bg-white border-black/10 text-black"
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#E51E2B]/20 border border-[#E51E2B]/40 flex items-center justify-center text-[#E51E2B]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg uppercase">
                  Reserve Vinyl Pressing
                </h3>
                <span className="text-xs text-zinc-400">Direct from Velvet Noir Pressing Plant</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
              You are reserving <strong className="text-white">{orderedItemTitle}</strong>. Our booking and distribution office will respond with worldwide shipping options and invoice details.
            </p>

            <div className="flex items-center space-x-3">
              <Link
                href="/contact"
                className="flex-1 py-3 rounded-full bg-[#E51E2B] text-white text-center font-bold text-xs uppercase tracking-wider hover:bg-[#D81A26] transition-colors"
              >
                Go to Inquiry Form
              </Link>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="px-5 py-3 rounded-full border border-white/20 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

