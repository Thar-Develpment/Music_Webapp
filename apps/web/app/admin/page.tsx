"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileEdit,
  Image as ImageIcon,
  Users,
  Sparkles,
  FolderOpen,
  Settings,
  Mail,
  ArrowRight,
  Eye,
  TrendingUp,
  Disc3,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    galleryCount: 0,
    teamCount: 0,
    artistCount: 0,
    unreadEnquiries: 0,
    totalEnquiries: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [galRes, teamRes, homeRes, enqRes] = await Promise.all([
          fetch("/api/public/gallery"),
          fetch("/api/public/team"),
          fetch("/api/public/home-extras"),
          fetch("/api/admin/enquiries"),
        ]);

        const galData = await galRes.json();
        const teamData = await teamRes.json();
        const homeData = await homeRes.json();
        const enqData = await enqRes.json();

        setStats({
          galleryCount: galData.data?.items?.length || 0,
          teamCount: teamData.data?.length || 0,
          artistCount: homeData.data?.artists?.length || 0,
          unreadEnquiries: enqData.meta?.unread || 0,
          totalEnquiries: enqData.meta?.total || 0,
        });
      } catch (e) {
        // quiet fallback
      }
    }
    loadStats();
  }, []);

  const shortcuts = [
    {
      title: "Pages Content",
      desc: "Edit headlines, body copy, hero videos, and buttons across Home, About, and Contact.",
      href: "/admin/pages",
      icon: FileEdit,
      color: "from-amber-500/20 to-yellow-500/10",
      border: "border-amber-500/30",
    },
    {
      title: "Gallery & Media",
      desc: "Manage categories, upload concert photos, embed videos, and reorder items.",
      href: "/admin/gallery",
      icon: ImageIcon,
      color: "from-blue-500/20 to-indigo-500/10",
      border: "border-blue-500/30",
    },
    {
      title: "Documentary Team",
      desc: "Update profiles for directors, cinematographers, sound designers, and visual crew.",
      href: "/admin/documentary",
      icon: Users,
      color: "from-purple-500/20 to-violet-500/10",
      border: "border-purple-500/30",
    },
    {
      title: "Home Extras & Roster",
      desc: "Manage testimonials, executive manager portraits, upcoming releases, and counters.",
      href: "/admin/home-extras",
      icon: Sparkles,
      color: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-500/30",
    },
    {
      title: "Media Asset Library",
      desc: "Search, preview, and reuse uploaded images and external video URLs across all pages.",
      href: "/admin/media",
      icon: FolderOpen,
      color: "from-cyan-500/20 to-sky-500/10",
      border: "border-cyan-500/30",
    },
    {
      title: "Site & Social Settings",
      desc: "Configure brand logo, header/footer statement, booking contacts, and social links.",
      href: "/admin/settings",
      icon: Settings,
      color: "from-rose-500/20 to-pink-500/10",
      border: "border-rose-500/30",
    },
  ];

  return (
    <div className="flex flex-col space-y-10">
      {/* Welcome Banner */}
      <div className="rounded-3xl glass-panel-gold p-8 sm:p-10 border border-[#D4AF37]/30 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
            Label Management Console
          </span>
          <h1 className="mt-2 font-heading font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            Velvet Noir Admin Dashboard
          </h1>
          <p className="mt-3 text-zinc-300 text-sm max-w-xl font-light">
            Update copy, upload high-resolution media assets, adjust your artist roster, and respond to incoming booking transmissions.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#D4AF37] text-[#070709] font-bold text-xs uppercase tracking-wider hover:bg-[#F5D77F] transition-all shadow-lg shrink-0"
        >
          <Eye className="w-4 h-4" />
          <span>Preview Live Site</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col">
          <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
            Unread Enquiries
          </span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="font-heading font-extrabold text-3xl text-[#F5D77F]">
              {stats.unreadEnquiries}
            </span>
            <span className="text-xs text-zinc-500">of {stats.totalEnquiries} total</span>
          </div>
          <Link
            href="/admin/enquiries"
            className="mt-4 text-xs text-[#D4AF37] hover:underline flex items-center space-x-1"
          >
            <span>View Inbox</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col">
          <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
            Gallery Media
          </span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="font-heading font-extrabold text-3xl text-white">
              {stats.galleryCount}
            </span>
            <span className="text-xs text-zinc-500">active assets</span>
          </div>
          <Link
            href="/admin/gallery"
            className="mt-4 text-xs text-[#D4AF37] hover:underline flex items-center space-x-1"
          >
            <span>Manage Gallery</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col">
          <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
            Documentary Crew
          </span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="font-heading font-extrabold text-3xl text-white">
              {stats.teamCount}
            </span>
            <span className="text-xs text-zinc-500">production roles</span>
          </div>
          <Link
            href="/admin/documentary"
            className="mt-4 text-xs text-[#D4AF37] hover:underline flex items-center space-x-1"
          >
            <span>Edit Credits</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col">
          <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
            Roster Artists
          </span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="font-heading font-extrabold text-3xl text-white">
              {stats.artistCount}
            </span>
            <span className="text-xs text-zinc-500">collective</span>
          </div>
          <Link
            href="/admin/home-extras"
            className="mt-4 text-xs text-[#D4AF37] hover:underline flex items-center space-x-1"
          >
            <span>Edit Roster</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Quick Shortcuts Grid */}
      <div>
        <h2 className="font-heading font-bold text-xl text-white uppercase tracking-wider mb-6">
          Content Management Shortcuts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shortcuts.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.title}
                href={s.href}
                className="group p-6 rounded-2xl glass-panel glass-panel-hover border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-4 font-heading font-bold text-lg text-white group-hover:text-[#F5D77F] transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] group-hover:translate-x-1 transition-transform">
                  <span>Open Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
