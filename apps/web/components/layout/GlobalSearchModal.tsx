"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Film,
  Music,
  Compass,
  ArrowRight,
  Disc3,
  Clapperboard,
  CornerDownLeft,
} from "lucide-react";
import { MovieItem, MusicItem } from "@music-label/shared";
import { useTheme } from "@/components/theme/ThemeProvider";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sitePages = [
  { name: "Home", href: "/", description: "One Roof official portal, showcase & roster" },
  { name: "Movies & Cinema", href: "/movies", description: "4K concert films, feature documentaries & cinema" },
  { name: "Music & Discography", href: "/music", description: "Direct master vinyl cuts & high-resolution audio" },
  { name: "Album & Visual Archive", href: "/gallery", description: "Album stills, photography & visual archive" },
  { name: "About the Label", href: "/about", description: "Acoustic architecture, history & label philosophy" },
  { name: "Contact & Booking", href: "/contact", description: "Press inquiries, management & studio licensing" },
];

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const { isDark } = useTheme();
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [musicTracks, setMusicTracks] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus input when opened and fetch catalog
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setLoading(true);
      Promise.all([
        fetch("/api/public/movies").then((r) => r.json()).catch(() => ({ success: false })),
        fetch("/api/public/music").then((r) => r.json()).catch(() => ({ success: false })),
      ])
        .then(([movRes, musRes]) => {
          if (movRes.success) setMovies(movRes.data || []);
          if (musRes.success) setMusicTracks(musRes.data || []);
        })
        .finally(() => setLoading(false));
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  const matchedMovies = cleanQuery
    ? movies.filter(
        (m) =>
          m.title.toLowerCase().includes(cleanQuery) ||
          m.director?.toLowerCase().includes(cleanQuery) ||
          m.description?.toLowerCase().includes(cleanQuery)
      )
    : movies.slice(0, 3);

  const matchedMusic = cleanQuery
    ? musicTracks.filter(
        (t) =>
          t.title.toLowerCase().includes(cleanQuery) ||
          t.artist?.toLowerCase().includes(cleanQuery) ||
          t.genre?.toLowerCase().includes(cleanQuery) ||
          t.description?.toLowerCase().includes(cleanQuery)
      )
    : musicTracks.slice(0, 3);

  const matchedPages = cleanQuery
    ? sitePages.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.description.toLowerCase().includes(cleanQuery)
      )
    : sitePages.slice(0, 3);

  const hasResults =
    matchedMovies.length > 0 || matchedMusic.length > 0 || matchedPages.length > 0;

  const handleSelectMovie = (movie: MovieItem) => {
    onClose();
    router.push(`/movies?id=${movie.id}`);
  };

  const handleSelectMusic = (track: MusicItem) => {
    onClose();
    router.push(`/music?id=${track.id}`);
  };

  const handleSelectPage = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div
        className={`relative z-10 w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all duration-300 ${
          isDark
            ? "bg-[#101016] border-white/15 text-white"
            : "bg-white border-black/15 text-black"
        }`}
      >
        {/* Search Input Bar */}
        <div
          className={`flex items-center px-4 py-3.5 border-b ${
            isDark ? "border-white/10 bg-[#14141D]" : "border-black/10 bg-zinc-50"
          }`}
        >
          <Search className="w-5 h-5 text-[#e11d48] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search films, audio tracks, artists, genres, or pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base outline-none placeholder-zinc-500 font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 mr-2 transition-colors cursor-pointer"
              title="Clear text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 rounded-md border border-zinc-700/50 text-[10px] font-mono text-zinc-400 uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {loading ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              Loading catalog index...
            </div>
          ) : !hasResults ? (
            <div className="py-12 text-center flex flex-col items-center justify-center text-zinc-500 text-xs">
              <Search className="w-8 h-8 text-zinc-600 mb-2 stroke-[1.5]" />
              <p className="font-semibold text-sm text-[var(--foreground)] mb-1">
                No matching results found
              </p>
              <p>Try searching for a different keyword or browsing by category.</p>
            </div>
          ) : (
            <>
              {/* Movies Section */}
              {matchedMovies.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-amber-500 mb-3 px-1">
                    <Film className="w-3.5 h-3.5" />
                    <span>Cinema &amp; Feature Films ({matchedMovies.length})</span>
                  </div>
                  <div className="space-y-2">
                    {matchedMovies.map((movie) => (
                      <div
                        key={movie.id}
                        onClick={() => handleSelectMovie(movie)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer group ${
                          isDark
                            ? "bg-[#151520] border-white/5 hover:border-[#e11d48]/50 hover:bg-[#1a1a28]"
                            : "bg-zinc-50 border-black/5 hover:border-[#e11d48]/50 hover:bg-zinc-100"
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-14 h-9 rounded-lg overflow-hidden bg-black shrink-0 relative">
                            {movie.thumbnailUrl && (
                              <img
                                src={movie.thumbnailUrl}
                                alt={movie.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wide truncate group-hover:text-[#e11d48] transition-colors">
                              {movie.title}
                            </h4>
                            <div className="text-[10px] text-zinc-400 flex items-center space-x-1.5 mt-0.5">
                              <span>Dir. {movie.director}</span>
                              <span>•</span>
                              <span>{movie.year}</span>
                              <span>•</span>
                              <span>{movie.duration}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0 pl-2">
                          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                            {movie.year}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#e11d48] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Music Section */}
              {matchedMusic.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-[#e11d48] mb-3 px-1">
                    <Music className="w-3.5 h-3.5" />
                    <span>Master Audio Tracks ({matchedMusic.length})</span>
                  </div>
                  <div className="space-y-2">
                    {matchedMusic.map((track) => (
                      <div
                        key={track.id}
                        onClick={() => handleSelectMusic(track)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer group ${
                          isDark
                            ? "bg-[#151520] border-white/5 hover:border-[#e11d48]/50 hover:bg-[#1a1a28]"
                            : "bg-zinc-50 border-black/5 hover:border-[#e11d48]/50 hover:bg-zinc-100"
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-black shrink-0 relative">
                            {track.thumbnailUrl && (
                              <img
                                src={track.thumbnailUrl}
                                alt={track.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wide truncate group-hover:text-[#e11d48] transition-colors">
                              {track.title}
                            </h4>
                            <div className="text-[10px] text-zinc-400 flex items-center space-x-1.5 mt-0.5">
                              <span>{track.artist}</span>
                              <span>•</span>
                              <span>{track.genre}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0 pl-2">
                          <span className="hidden sm:inline-block font-mono text-[10px] text-zinc-400">
                            {track.duration}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#e11d48] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Pages */}
              {matchedPages.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3 px-1">
                    <Compass className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Navigation &amp; Pages</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedPages.map((page) => (
                      <div
                        key={page.name}
                        onClick={() => handleSelectPage(page.href)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer group flex items-center justify-between ${
                          isDark
                            ? "bg-[#151520] border-white/5 hover:border-white/20 hover:bg-[#1a1a28]"
                            : "bg-zinc-50 border-black/5 hover:border-black/20 hover:bg-zinc-100"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold uppercase tracking-wide group-hover:text-[#e11d48] transition-colors">
                            {page.name}
                          </div>
                          <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                            {page.description}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#e11d48] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Tip */}
        <div
          className={`px-4 py-2.5 border-t flex items-center justify-between text-[11px] text-zinc-500 ${
            isDark ? "border-white/10 bg-[#12121A]" : "border-black/10 bg-zinc-100"
          }`}
        >
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-zinc-400">Tip:</span>
            <span>Press Enter to select or Esc to dismiss</span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#e11d48]">
            One Roof Global Search
          </span>
        </div>
      </div>
    </div>
  );
}
