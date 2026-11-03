"use client";

import React, { useState, useRef, useEffect } from "react";
import { MusicItem } from "@music-label/shared";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Disc3,
  Sparkles,
  Music,
  Clock,
  Radio,
  ExternalLink,
  X,
  ArrowLeft,
  ChevronRight,
  Headphones,
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

import { useSearchParams } from "next/navigation";

interface MusicClientProps {
  tracks: MusicItem[];
}

export default function MusicClient({ tracks }: MusicClientProps) {
  const { isDark } = useTheme();
  const searchParams = useSearchParams();
  const [selectedTrack, setSelectedTrack] = useState<MusicItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [activeGenre, setActiveGenre] = useState<string>("All");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClosePanel = () => {
    setSelectedTrack(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const handleOpenPanel = (track: MusicItem) => {
    setSelectedTrack(track);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl || "/audio/track-1.mp3";
      audioRef.current.load();
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  // Support direct deep link via ?id=track-id
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const match = tracks.find((t) => t.id === id);
      if (match) {
        handleOpenPanel(match);
      }
    }
  }, [searchParams, tracks]);

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

  // Sync audio source when selected track changes
  useEffect(() => {
    if (!audioRef.current || !selectedTrack) return;
    audioRef.current.src = selectedTrack.audioUrl || "/audio/track-1.mp3";
    audioRef.current.load();
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrack?.id]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  const handleNext = () => {
    if (!selectedTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === selectedTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setSelectedTrack(tracks[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (!selectedTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === selectedTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setSelectedTrack(tracks[prevIndex]);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  const genres = ["All", ...Array.from(new Set(tracks.map((t) => t.genre).filter(Boolean)))];

  // Filtering by genre
  const filteredTracks =
    activeGenre === "All" ? tracks : tracks.filter((track) => track.genre === activeGenre);

  return (
    <div className="w-full pb-36">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
      />

      {/* 1. Header Section */}
      <section className="relative pt-32 pb-16 px-6 lg:px-12 overflow-hidden border-b border-[var(--subtle-border)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-96 bg-[#E51E2B]/10 blur-[150px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[#E51E2B]/40 bg-[#E51E2B]/10 text-[#E51E2B] text-xs font-bold tracking-[0.2em] uppercase mb-6 shadow-sm">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Sonic Vinyl &amp; Audio Archive</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-[var(--foreground)] max-w-4xl">
            DISCOGRAPHY &amp; MASTER TRACKS
          </h1>

          <p className="mt-6 text-sm sm:text-base max-w-2xl text-zinc-400 font-light leading-relaxed">
            Direct analog cuts, lossless digital masters, and orchestral sessions. Click any track
            to open its dedicated studio audition deck, acoustic details, and streaming hubs.
          </p>

          {/* Genre Filters */}
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

      {/* 2. Discography Track Catalog List */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-14">
        <div className="flex items-center justify-between mb-8 border-b border-[var(--subtle-border)] pb-4">
          <div>
            <h2 className="font-heading font-extrabold text-2xl uppercase tracking-wider text-[var(--foreground)]">
              {activeGenre === "All" ? "Master Audio Catalog" : `${activeGenre} Tracks`}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Showing {filteredTracks.length} of {tracks.length} master recordings
            </p>
          </div>
        </div>

        {filteredTracks.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center text-zinc-400 text-sm">
            <Music className="w-12 h-12 text-zinc-600 mb-3 stroke-[1.5]" />
            <p className="font-semibold text-base text-[var(--foreground)] mb-1">
              No audio tracks cataloged under this genre yet
            </p>
            <p className="text-xs max-w-sm text-zinc-500 mb-4">
              Switch genre filter to view all available tracks or use global search.
            </p>
            <button
              type="button"
              onClick={() => setActiveGenre("All")}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E51E2B] text-white hover:bg-[#D81A26] transition-colors"
            >
              Show All Tracks
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--subtle-border)] bg-[var(--card)] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--subtle-border)] text-zinc-400">
                    <th className="py-4 pl-6 pr-3 font-semibold uppercase tracking-wider w-12">#</th>
                    <th className="py-4 px-4 font-semibold uppercase tracking-wider">Track &amp; Artist</th>
                    <th className="py-4 px-4 font-semibold uppercase tracking-wider hidden sm:table-cell">
                      Genre
                    </th>
                    <th className="py-4 px-4 font-semibold uppercase tracking-wider hidden md:table-cell">
                      Release Year
                    </th>
                    <th className="py-4 px-4 font-semibold uppercase tracking-wider text-right">Duration</th>
                    <th className="py-4 pr-6 pl-4 font-semibold uppercase tracking-wider text-right">Audition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--subtle-border)]">
                  {filteredTracks.map((track, idx) => {
                    const isSelected = selectedTrack?.id === track.id;
                    const isCurrentlyPlaying = isSelected && isPlaying;
                    return (
                      <tr
                        key={track.id}
                        onClick={() => handleOpenPanel(track)}
                        className={`transition-colors cursor-pointer group ${
                          isSelected
                            ? isDark
                              ? "bg-[#E51E2B]/10 text-white"
                              : "bg-red-50/70 text-black"
                            : isDark
                            ? "hover:bg-white/[0.04]"
                            : "hover:bg-black/[0.02]"
                        }`}
                      >
                        {/* Play Icon / Index */}
                        <td className="py-4 pl-6 pr-3 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenPanel(track);
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              isCurrentlyPlaying
                                ? "bg-[#E51E2B] text-white shadow-md shadow-[#E51E2B]/30"
                                : "text-zinc-400 group-hover:text-[#E51E2B] group-hover:bg-[#E51E2B]/10"
                            }`}
                          >
                            {isCurrentlyPlaying ? (
                              <Pause className="w-3.5 h-3.5 fill-white" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            )}
                          </button>
                        </td>

                        {/* Artwork & Track Title */}
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-11 h-11 rounded-lg overflow-hidden border border-[var(--subtle-border)] shrink-0 bg-black relative">
                              <img
                                src={track.thumbnailUrl}
                                alt={track.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span
                                className={`font-heading font-extrabold text-sm uppercase tracking-wide truncate ${
                                  isSelected ? "text-[#E51E2B]" : "text-[var(--foreground)] group-hover:text-[#E51E2B]"
                                }`}
                              >
                                {track.title}
                              </span>
                              <span className="text-xs text-zinc-400 font-medium truncate">
                                {track.artist}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Genre */}
                        <td className="py-4 px-4 hidden sm:table-cell whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full border border-[var(--subtle-border)] text-[10px] font-semibold text-zinc-400">
                            {track.genre}
                          </span>
                        </td>

                        {/* Year */}
                        <td className="py-4 px-4 hidden md:table-cell text-zinc-400">
                          {track.year}
                        </td>

                        {/* Duration */}
                        <td className="py-4 px-4 text-right whitespace-nowrap text-zinc-400 font-mono">
                          {track.duration}
                        </td>

                        {/* Open Details Action */}
                        <td className="py-4 pr-6 pl-4 text-right whitespace-nowrap">
                          <span className="text-xs font-bold text-[#E51E2B] uppercase tracking-wider inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            <span>Open Details</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* 3. Dedicated Track Details & Master Player Slide Panel */}
      {selectedTrack && (
        <div className="fixed inset-0 z-[70] flex items-center justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          {/* Backdrop click area */}
          <div className="absolute inset-0" onClick={handleClosePanel} />

          {/* Slide-over Container */}
          <div
            className={`relative z-10 w-full max-w-2xl h-full overflow-y-auto border-l shadow-2xl flex flex-col transition-all duration-300 ${
              isDark
                ? "bg-[#0A0A0E] border-white/10 text-white"
                : "bg-white border-black/10 text-black"
            }`}
          >
            {/* Sticky Header with Prominent Back Button */}
            <div
              className={`sticky top-0 z-20 px-6 py-4 border-b flex items-center justify-between backdrop-blur-xl ${
                isDark ? "bg-[#0E0E14]/90 border-white/10" : "bg-white/90 border-black/10"
              }`}
            >
              <button
                type="button"
                onClick={handleClosePanel}
                className="group flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white bg-white/5 hover:bg-[#E51E2B] transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>← Back to Tracklist</span>
              </button>

              <button
                type="button"
                onClick={handleClosePanel}
                className="p-2 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:border-white transition-colors cursor-pointer"
                title="Close Panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vinyl & Artwork Deck */}
            <div className="p-8 sm:p-10 flex flex-col items-center text-center bg-gradient-to-b from-red-950/20 via-transparent to-transparent border-b border-white/5">
              {/* Spinning Vinyl Visualizer */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 mb-6">
                <div
                  className={`absolute inset-0 rounded-full bg-[#111116] border-4 border-black/80 shadow-2xl flex items-center justify-center transition-transform duration-700 ${
                    isPlaying
                      ? "translate-x-8 sm:translate-x-12 rotate-45"
                      : "translate-x-0 rotate-0"
                  }`}
                >
                  <div className="w-full h-full rounded-full border border-white/5 flex items-center justify-center">
                    <div className="w-44 h-44 rounded-full border border-white/5 flex items-center justify-center">
                      <div className="w-28 h-28 rounded-full border border-white/5 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-[#E51E2B] flex items-center justify-center shadow-lg shadow-[#E51E2B]/50">
                          <div className="w-3.5 h-3.5 rounded-full bg-black" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Album Cover Art */}
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black z-10">
                  <img
                    src={selectedTrack.thumbnailUrl}
                    alt={selectedTrack.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#E51E2B] text-white text-[10px] font-bold uppercase tracking-wider">
                      {selectedTrack.genre}
                    </span>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center space-x-1.5 text-xs text-[#E51E2B] font-bold tracking-widest uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Velvet Noir Master Audio</span>
              </div>

              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white">
                {selectedTrack.title}
              </h3>

              <p className="text-sm text-zinc-300 font-medium mt-1">
                {selectedTrack.artist} • <span className="text-zinc-500">{selectedTrack.year}</span>
              </p>

              {/* Animated Waveform Equalizer */}
              <div className="flex items-end justify-center space-x-1.5 h-8 py-1 bg-black/40 rounded-xl px-4 border border-white/5 mt-4 w-full max-w-sm">
                <div className="flex items-center space-x-1 text-xs text-zinc-400 mr-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E51E2B] animate-ping" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#E51E2B]">
                    {isPlaying ? "Transmitting" : "Ready"}
                  </span>
                </div>
                {[...Array(18)].map((_, i) => {
                  const waveClass = `wave-bar-${(i % 4) + 1}`;
                  return (
                    <div
                      key={i}
                      className={`w-1 rounded-full bg-gradient-to-t from-[#E51E2B] to-[#FF4D5A] transition-all duration-300 ${
                        isPlaying ? waveClass : "h-1 opacity-30"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Audio Controls Board */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Seek Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration || 180)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={duration || 180}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#E51E2B]"
                />
              </div>

              {/* Playback Controls & Volume */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-3 rounded-full border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Previous Track"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-13 h-13 rounded-full bg-[#E51E2B] hover:bg-[#D81A26] text-white flex items-center justify-center shadow-xl shadow-[#E51E2B]/40 transition-transform hover:scale-105 cursor-pointer"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-white" />
                    ) : (
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-3 rounded-full border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Next Track"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#E51E2B]"
                  />
                </div>
              </div>

              {/* Detailed Acoustic Notes & Description */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#E51E2B]">
                  Acoustic Details &amp; Liner Notes
                </h4>
                <p className="text-sm leading-relaxed text-zinc-300 font-light whitespace-pre-line">
                  {selectedTrack.description}
                </p>
              </div>

              {/* External Streaming Platform Hub */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Listen on Streaming Platforms
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  {selectedTrack.spotifyUrl && (
                    <a
                      href={selectedTrack.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl border border-white/10 hover:border-emerald-500/50 text-xs font-bold text-zinc-300 hover:text-emerald-400 transition-colors flex items-center space-x-1.5 bg-white/[0.02]"
                    >
                      <span>Spotify</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {selectedTrack.soundcloudUrl && (
                    <a
                      href={selectedTrack.soundcloudUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl border border-white/10 hover:border-orange-500/50 text-xs font-bold text-zinc-300 hover:text-orange-400 transition-colors flex items-center space-x-1.5 bg-white/[0.02]"
                    >
                      <span>SoundCloud</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {selectedTrack.appleMusicUrl && (
                    <a
                      href={selectedTrack.appleMusicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl border border-white/10 hover:border-rose-500/50 text-xs font-bold text-zinc-300 hover:text-rose-400 transition-colors flex items-center space-x-1.5 bg-white/[0.02]"
                    >
                      <span>Apple Music</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {selectedTrack.youtubeUrl && (
                    <a
                      href={selectedTrack.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl border border-white/10 hover:border-red-500/50 text-xs font-bold text-zinc-300 hover:text-red-400 transition-colors flex items-center space-x-1.5 bg-white/[0.02]"
                    >
                      <span>YouTube Music</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Bottom Back Button */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleClosePanel}
                  className="px-5 py-2.5 rounded-xl border border-white/20 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  ← Back to Music Catalog
                </button>
                <span className="text-xs text-zinc-500 font-mono">
                  Master 96kHz / 24-bit
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
