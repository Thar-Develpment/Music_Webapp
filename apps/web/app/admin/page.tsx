"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Film,
  Music,
  Mail,
  ShieldCheck,
  ArrowRight,
  Plus,
  Disc3,
  ExternalLink,
} from "lucide-react";
import { MovieItem, MusicItem, EnquiryRecord } from "@music-label/shared";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function AdminDashboardPage() {
  const { isDark } = useTheme();
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [musicList, setMusicList] = useState<MusicItem[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [movRes, musRes, enqRes] = await Promise.all([
          fetch("/api/admin/movies"),
          fetch("/api/admin/music"),
          fetch("/api/admin/enquiries"),
        ]);

        if (movRes.ok) {
          const mData = await movRes.json();
          if (mData.success) setMovies(mData.data || []);
        }
        if (musRes.ok) {
          const muData = await musRes.json();
          if (muData.success) setMusicList(muData.data || []);
        }
        if (enqRes.ok) {
          const eData = await enqRes.json();
          if (eData.success) {
            setEnquiries(eData.data || []);
            setUnreadCount(eData.meta?.unread || 0);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 ${
          isDark
            ? "bg-gradient-to-r from-[#181820] via-[#14141c] to-[#121217] border-white/10"
            : "bg-gradient-to-r from-red-50/40 via-white to-zinc-50 border-black/10 shadow-sm"
        }`}
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#e11d48]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#e11d48] bg-[#e11d48]/10 px-2.5 py-0.5 rounded-full border border-[#e11d48]/20">
                One Roof Central CMS
              </span>
              <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Protected Session
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
              Executive Label Console
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Manage cinema productions, music releases, and inbound press enquiries with secure
              real-time publishing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/movies"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase bg-[#e11d48] text-white hover:bg-[#D81A26] transition-colors shadow-md shadow-[#e11d48]/20"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Add Movie</span>
            </Link>
            <Link
              href="/admin/music"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase border border-[#e11d48]/40 hover:bg-[#e11d48]/10 text-[#e11d48] transition-colors"
            >
              <Music className="w-3.5 h-3.5" />
              <span>Add Music</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Movies Card */}
        <Link
          href="/admin/movies"
          className={`group rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.01] ${
            isDark
              ? "bg-[#14141A] border-white/10 hover:border-[#e11d48]/40"
              : "bg-white border-black/10 hover:border-[#e11d48]/40 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Film className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1 group-hover:text-[#e11d48] transition-colors">
              Manage <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
          <div className="font-heading text-3xl font-extrabold mb-1">
            {loading ? "..." : movies.length}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Cinema Films & Teasers
          </div>
          <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Live on /movies</span>
            <span className="text-amber-500 font-semibold">
              {movies.filter((m) => m.featured).length} Featured
            </span>
          </div>
        </Link>

        {/* Music Card */}
        <Link
          href="/admin/music"
          className={`group rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.01] ${
            isDark
              ? "bg-[#14141A] border-white/10 hover:border-[#e11d48]/40"
              : "bg-white border-black/10 hover:border-[#e11d48]/40 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[#e11d48] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Music className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1 group-hover:text-[#e11d48] transition-colors">
              Manage <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
          <div className="font-heading text-3xl font-extrabold mb-1">
            {loading ? "..." : musicList.length}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Master Audio Tracks
          </div>
          <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Live on /music</span>
            <span className="text-[#e11d48] font-semibold">
              {musicList.filter((m) => m.featured).length} Spotlight
            </span>
          </div>
        </Link>

        {/* Enquiries Card */}
        <Link
          href="/admin/enquiries"
          className={`group rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.01] ${
            isDark
              ? "bg-[#14141A] border-white/10 hover:border-[#e11d48]/40"
              : "bg-white border-black/10 hover:border-[#e11d48]/40 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1 group-hover:text-[#e11d48] transition-colors">
              Inbox <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
          <div className="font-heading text-3xl font-extrabold mb-1">
            {loading ? "..." : enquiries.length}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Press & Booking Enquiries
          </div>
          <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Inbound Messages</span>
            {unreadCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-[#e11d48] text-white font-bold text-[10px]">
                {unreadCount} Unread
              </span>
            ) : (
              <span className="text-emerald-500 font-semibold">All Read</span>
            )}
          </div>
        </Link>
      </div>

      {/* Two Modules Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Movies */}
        <div
          className={`rounded-2xl border p-6 flex flex-col justify-between ${
            isDark ? "bg-[#14141A] border-white/10" : "bg-white border-black/10 shadow-sm"
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-500" />
                <h2 className="font-heading font-extrabold text-sm uppercase tracking-wider">
                  Cinema & Film Catalog
                </h2>
              </div>
              <Link
                href="/admin/movies"
                className="text-xs font-bold uppercase tracking-wider text-[#e11d48] hover:underline flex items-center gap-1"
              >
                <span>Edit All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="py-8 text-center text-xs text-zinc-500">Loading movies...</div>
              ) : movies.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500">No movies added yet.</div>
              ) : (
                movies.slice(0, 3).map((movie) => (
                  <div
                    key={movie.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${
                      isDark ? "bg-[#181822] border-white/5" : "bg-zinc-50 border-black/5"
                    }`}
                  >
                    <div className="w-16 h-10 rounded-lg overflow-hidden shrink-0 bg-black/40 relative">
                      {movie.thumbnailUrl ? (
                        <img
                          src={movie.thumbnailUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-4 h-4 text-zinc-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">{movie.title}</div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                        <span>{movie.year}</span>
                        <span>•</span>
                        <span>{movie.duration}</span>
                        <span>•</span>
                        <span>Dir. {movie.director}</span>
                      </div>
                    </div>
                    {movie.featured && (
                      <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                        Featured
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
            <Link
              href="/movies"
              target="_blank"
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#e11d48]" />
              <span>Preview Live Cinema Page</span>
            </Link>
            <Link
              href="/admin/movies"
              className="text-xs font-bold uppercase tracking-wider text-[#e11d48] flex items-center gap-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Film</span>
            </Link>
          </div>
        </div>

        {/* Recent Music */}
        <div
          className={`rounded-2xl border p-6 flex flex-col justify-between ${
            isDark ? "bg-[#14141A] border-white/10" : "bg-white border-black/10 shadow-sm"
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-[#e11d48]" />
                <h2 className="font-heading font-extrabold text-sm uppercase tracking-wider">
                  Audio & Vinyl Library
                </h2>
              </div>
              <Link
                href="/admin/music"
                className="text-xs font-bold uppercase tracking-wider text-[#e11d48] hover:underline flex items-center gap-1"
              >
                <span>Edit All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="py-8 text-center text-xs text-zinc-500">Loading audio...</div>
              ) : musicList.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500">No tracks added yet.</div>
              ) : (
                musicList.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${
                      isDark ? "bg-[#181822] border-white/5" : "bg-zinc-50 border-black/5"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black/40 relative">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Disc3 className="w-4 h-4 text-zinc-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">{item.title}</div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                        <span className="truncate">{item.artist}</span>
                        <span>•</span>
                        <span>{item.duration}</span>
                      </div>
                    </div>
                    {item.featured && (
                      <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-[#e11d48] border border-rose-500/20 shrink-0">
                        Spotlight
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
            <Link
              href="/music"
              target="_blank"
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#e11d48]" />
              <span>Preview Live Audio Deck</span>
            </Link>
            <Link
              href="/admin/music"
              className="text-xs font-bold uppercase tracking-wider text-[#e11d48] flex items-center gap-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Audio</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
