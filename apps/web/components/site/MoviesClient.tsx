"use client";

import React, { useState, useEffect } from "react";
import { MovieItem } from "@music-label/shared";
import {
  Play,
  X,
  Film,
  Clock,
  Calendar,
  User,
  ExternalLink,
  Sparkles,
  Clapperboard,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

interface MoviesClientProps {
  movies: MovieItem[];
}

function extractYouTubeId(url: string): string {
  if (!url) return "";
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : url;
}

import { useSearchParams } from "next/navigation";

export default function MoviesClient({ movies }: MoviesClientProps) {
  const { isDark } = useTheme();
  const searchParams = useSearchParams();
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
  const [activeGenre, setActiveGenre] = useState<string>("All");
  const [isPlayingTrailer, setIsPlayingTrailer] = useState<boolean>(false);

  const handleClosePanel = () => {
    setSelectedMovie(null);
    setIsPlayingTrailer(false);
  };

  const handleOpenPanel = (movie: MovieItem) => {
    setSelectedMovie(movie);
    setIsPlayingTrailer(false);
  };

  // Support direct deep link via ?id=movie-id
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const match = movies.find((m) => m.id === id);
      if (match) {
        handleOpenPanel(match);
      }
    }
  }, [searchParams, movies]);

  // Close panel on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClosePanel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // When panel opens/closes, prevent background body scrolling
  useEffect(() => {
    if (selectedMovie) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMovie]);

  const genres = ["All", ...Array.from(new Set(movies.map((m) => m.genre).filter(Boolean)))];

  // Filtering by genre
  const filteredMovies =
    activeGenre === "All" ? movies : movies.filter((movie) => movie.genre === activeGenre);

  return (
    <div className="w-full pb-24">
      {/* 1. Cinematic Hero Header */}
      <section className="relative pt-32 pb-16 px-6 lg:px-12 overflow-hidden border-b border-[var(--subtle-border)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-96 bg-[#E51E2B]/10 blur-[150px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[#E51E2B]/40 bg-[#E51E2B]/10 text-[#E51E2B] text-xs font-bold tracking-[0.2em] uppercase mb-6 shadow-sm">
            <Clapperboard className="w-3.5 h-3.5" />
            <span>Cinematic Noir Visual Archive</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-[var(--foreground)] max-w-4xl">
            FEATURE FILMS &amp; CINEMA
          </h1>

          <p className="mt-6 text-sm sm:text-base max-w-2xl text-zinc-400 font-light leading-relaxed">
            Immersion into feature-length documentaries, 4K concert films, and avant-garde visual
            narratives. Click any production to inspect full credits, synopsis, and stream presentation.
          </p>

          {/* Genre Filter Pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {genres.map((genre) => {
              const active = activeGenre === genre;
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setActiveGenre(genre)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    active
                      ? "bg-[#E51E2B] text-white shadow-lg shadow-[#E51E2B]/30 font-bold"
                      : "border border-[var(--subtle-border)] bg-[var(--card)] text-zinc-400 hover:text-[var(--foreground)] hover:border-[#E51E2B]/40"
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Movie List Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-14">
        <div className="flex items-center justify-between mb-8 border-b border-[var(--subtle-border)] pb-4">
          <div>
            <h2 className="font-heading font-extrabold text-2xl uppercase tracking-wider text-[var(--foreground)]">
              {activeGenre === "All" ? "Complete Film Catalog" : `${activeGenre} Selections`}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Showing {filteredMovies.length} of {movies.length} cinematic productions
            </p>
          </div>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center text-zinc-400 text-sm">
            <Film className="w-12 h-12 text-zinc-600 mb-3 stroke-[1.5]" />
            <p className="font-semibold text-base text-[var(--foreground)] mb-1">
              No films cataloged under this genre yet
            </p>
            <p className="text-xs max-w-sm text-zinc-500 mb-4">
              Switch genre filter to view all available productions or use global search.
            </p>
            <button
              type="button"
              onClick={() => setActiveGenre("All")}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E51E2B] text-white hover:bg-[#D81A26] transition-colors"
            >
              Show All Films
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMovies.map((movie) => {
              return (
                <div
                  key={movie.id}
                  className="group rounded-2xl overflow-hidden border border-[var(--subtle-border)] bg-[var(--card)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-[#E51E2B]/50 hover:shadow-2xl hover:shadow-[#E51E2B]/10 cursor-pointer"
                  onClick={() => handleOpenPanel(movie)}
                >
                  <div>
                    {/* Widescreen Thumbnail with Play Badge */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                      <img
                        src={movie.thumbnailUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                      {/* Play Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-[#E51E2B] text-white flex items-center justify-center shadow-lg shadow-[#E51E2B]/40 transform group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </div>
                      </div>

                      {/* Genre & Duration Badges */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white font-medium">
                        <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 font-bold uppercase tracking-wider text-[10px]">
                          {movie.genre}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 font-mono text-[10px]">
                          {movie.duration}
                        </span>
                      </div>
                    </div>

                    {/* Movie Card Summary Info */}
                    <div className="p-6">
                      <div className="flex items-center space-x-2 text-[11px] text-zinc-400 mb-2">
                        <span>{movie.year}</span>
                        <span>•</span>
                        <span>Dir. {movie.director}</span>
                      </div>

                      <h3 className="font-heading font-extrabold text-xl uppercase tracking-wider text-[var(--foreground)] group-hover:text-[#E51E2B] transition-colors line-clamp-1">
                        {movie.title}
                      </h3>

                      {movie.featured && (
                        <div className="mt-2.5 inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-widest text-amber-500">
                          <Sparkles className="w-3 h-3" />
                          <span>Official Premiere</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-6 pb-6 pt-3 border-t border-[var(--subtle-border)] flex items-center justify-between text-xs">
                    <span className="text-[#E51E2B] font-bold tracking-wider uppercase flex items-center space-x-1 group-hover:underline">
                      <span>View Details &amp; Stream</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>

                    <span className="text-zinc-500 text-[11px]">4K Master</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Dedicated Movie Details & Player Cinematic Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          {/* Backdrop click area */}
          <div className="absolute inset-0" onClick={handleClosePanel} />

          {/* Modal Container */}
          <div
            className={`relative z-10 w-full max-w-6xl xl:max-w-7xl max-h-[92vh] overflow-y-auto rounded-3xl border shadow-2xl flex flex-col transition-all duration-300 ${
              isDark
                ? "bg-[#0B0B0F] border-white/15 text-white"
                : "bg-white border-black/10 text-black"
            }`}
          >
            {/* Header with Back Button and Close Button */}
            <div
              className={`sticky top-0 z-20 px-6 py-4 border-b flex items-center justify-between backdrop-blur-xl ${
                isDark ? "bg-[#0E0E14]/95 border-white/10" : "bg-white/95 border-black/10"
              }`}
            >
              <button
                type="button"
                onClick={handleClosePanel}
                className="group flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white bg-white/5 hover:bg-[#E51E2B] transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>← Back to Movies</span>
              </button>

              <div className="flex items-center space-x-3">
                <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline-block">
                  Press ESC to close
                </span>
                <button
                  type="button"
                  onClick={handleClosePanel}
                  className="p-2 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:border-white transition-colors cursor-pointer"
                  title="Close Panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Content: 2-Column Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-10 items-start">
              {/* LEFT SIDE: Movie Title, Badges, Director, Detailed Synopsis & Storyline */}
              <div className="lg:col-span-6 xl:col-span-7 space-y-6 flex flex-col justify-between order-2 lg:order-1">
                <div>
                  {/* Genre, Duration, Year, Featured Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#E51E2B] text-white text-[11px] font-bold uppercase tracking-wider shadow-md shadow-[#E51E2B]/20">
                      {selectedMovie.genre}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full border text-[11px] font-semibold ${
                        isDark ? "border-white/15 text-zinc-300" : "border-black/15 text-zinc-700"
                      }`}
                    >
                      {selectedMovie.duration}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full border text-[11px] font-semibold ${
                        isDark ? "border-white/15 text-zinc-300" : "border-black/15 text-zinc-700"
                      }`}
                    >
                      {selectedMovie.year}
                    </span>
                    {selectedMovie.featured && (
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Premiere</span>
                      </span>
                    )}
                  </div>

                  {/* Movie Title */}
                  <h2
                    className={`font-heading font-extrabold text-3xl sm:text-4xl xl:text-5xl uppercase tracking-tight leading-tight mb-3 ${
                      isDark ? "text-white" : "text-[#09090B]"
                    }`}
                  >
                    {selectedMovie.title}
                  </h2>

                  {/* Director Credit */}
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-zinc-400 mb-6">
                    <User className="w-4 h-4 text-[#E51E2B]" />
                    <span>
                      Directed by{" "}
                      <strong className={isDark ? "text-zinc-200" : "text-zinc-800"}>
                        {selectedMovie.director}
                      </strong>
                    </span>
                  </div>

                  {/* Detailed Description & Storyline Synopsis */}
                  <div
                    className={`pt-6 border-t space-y-3 ${
                      isDark ? "border-white/10" : "border-black/10"
                    }`}
                  >
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#E51E2B] flex items-center gap-1.5">
                      <Clapperboard className="w-3.5 h-3.5" />
                      <span>Synopsis &amp; Narrative</span>
                    </h3>
                    <p
                      className={`text-sm sm:text-base leading-relaxed font-light whitespace-pre-line ${
                        isDark ? "text-zinc-300" : "text-zinc-700"
                      }`}
                    >
                      {selectedMovie.description}
                    </p>
                  </div>

                  {/* Technical Specifications */}
                  <div
                    className={`pt-6 mt-6 border-t grid grid-cols-2 gap-4 text-xs ${
                      isDark ? "border-white/10" : "border-black/10"
                    }`}
                  >
                    <div
                      className={`p-4 rounded-2xl border space-y-1 ${
                        isDark ? "bg-white/[0.03] border-white/5" : "bg-black/[0.02] border-black/5"
                      }`}
                    >
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
                        Cinema Master
                      </span>
                      <span className={`font-bold ${isDark ? "text-white" : "text-black"}`}>
                        4K UHD Dolby Vision
                      </span>
                    </div>
                    <div
                      className={`p-4 rounded-2xl border space-y-1 ${
                        isDark ? "bg-white/[0.03] border-white/5" : "bg-black/[0.02] border-black/5"
                      }`}
                    >
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
                        Acoustic Format
                      </span>
                      <span className={`font-bold ${isDark ? "text-white" : "text-black"}`}>
                        Dolby Atmos 9.1 Spatial
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Actions on Left */}
                <div
                  className={`pt-6 mt-6 border-t flex flex-wrap items-center gap-4 ${
                    isDark ? "border-white/10" : "border-black/10"
                  }`}
                >
                  {!isPlayingTrailer && (
                    <button
                      type="button"
                      onClick={() => setIsPlayingTrailer(true)}
                      className="px-6 py-3 rounded-full bg-[#E51E2B] hover:bg-[#D81A26] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#E51E2B]/30 transition-all flex items-center space-x-2 cursor-pointer hover:scale-105"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Stream Trailer</span>
                    </button>
                  )}

                  <a
                    href={selectedMovie.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-5 py-3 rounded-full border text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 ${
                      isDark
                        ? "border-white/15 bg-white/5 text-zinc-200 hover:text-white hover:border-[#E51E2B]/50"
                        : "border-black/15 bg-black/5 text-zinc-800 hover:text-black hover:border-[#E51E2B]/50"
                    }`}
                  >
                    <span>Open in YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={handleClosePanel}
                    className="px-5 py-3 rounded-full border border-white/15 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* RIGHT SIDE: Thumbnail Poster & Video Player */}
              <div className="lg:col-span-6 xl:col-span-5 flex flex-col space-y-4 order-1 lg:order-2">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl shrink-0">
                  {isPlayingTrailer ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeId(
                        selectedMovie.youtubeUrl
                      )}?autoplay=1&rel=0`}
                      title={selectedMovie.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="relative w-full h-full group">
                      <img
                        src={selectedMovie.thumbnailUrl}
                        alt={selectedMovie.title}
                        className="w-full h-full object-cover filter brightness-90 group-hover:brightness-75 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                      {/* Play Presentation Center Button */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <button
                          type="button"
                          onClick={() => setIsPlayingTrailer(true)}
                          className="px-7 py-4 rounded-full bg-[#E51E2B] hover:bg-[#D81A26] text-white font-bold text-xs uppercase tracking-wider shadow-2xl shadow-[#E51E2B]/60 transition-all flex items-center space-x-3 cursor-pointer hover:scale-105"
                        >
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </div>
                          <span>Play Feature Trailer</span>
                        </button>
                        <span className="text-[11px] text-zinc-300 mt-3 font-mono drop-shadow">
                          Official YouTube 4K Stream
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtitle / Tip under video on right */}
                <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    4K Ultra HD • High Bitrate
                  </span>
                  {isPlayingTrailer && (
                    <button
                      type="button"
                      onClick={() => setIsPlayingTrailer(false)}
                      className="text-[#E51E2B] hover:underline font-bold text-[11px] uppercase tracking-wider cursor-pointer"
                    >
                      Show Poster
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
