"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileEdit,
  Image as ImageIcon,
  Users,
  LayoutGrid,
  FolderOpen,
  Settings,
  Mail,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function AdminDashboard() {
  const { isDark } = useTheme();
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
    },
    {
      title: "Gallery & Media",
      desc: "Manage categories, upload concert photos, embed videos, and reorder items.",
      href: "/admin/gallery",
      icon: ImageIcon,
    },
    {
      title: "Documentary Team",
      desc: "Update profiles for directors, cinematographers, sound designers, and visual crew.",
      href: "/admin/documentary",
      icon: Users,
    },
    {
      title: "Home Extras & Roster",
      desc: "Manage testimonials, executive manager portraits, upcoming releases, and counters.",
      href: "/admin/home-extras",
      icon: LayoutGrid,
    },
    {
      title: "Media Asset Library",
      desc: "Search, preview, and reuse uploaded images and external video URLs across all pages.",
      href: "/admin/media",
      icon: FolderOpen,
    },
    {
      title: "Site & Social Settings",
      desc: "Configure brand theme (white/black), statement, booking contacts, and social links.",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex flex-col space-y-10">
      {/* Welcome Banner */}
      <div
        className={`rounded-3xl p-8 sm:p-10 border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
          isDark
            ? "bg-gradient-to-r from-[#181820] to-[#121217] border-white/10 text-white shadow-xl shadow-black/40"
            : "bg-gradient-to-r from-red-50 to-white border-[#E51E2B]/20 text-[#09090B] shadow-sm"
        }`}
      >
        <div>
          <span className="text-xs font-bold tracking-widest text-[#E51E2B] uppercase">
            Label Management Console
          </span>
          <h1
            className={`mt-2 font-heading font-extrabold text-3xl sm:text-4xl uppercase tracking-tight ${
              isDark ? "text-white" : "text-[#09090B]"
            }`}
          >
            Velvet Noir Admin Dashboard
          </h1>
          <p
            className={`mt-3 text-sm max-w-xl font-light ${
              isDark ? "text-zinc-300" : "text-zinc-600"
            }`}
          >
            Update copy, switch between dark and white themes, upload high-resolution media assets,
            and respond to incoming booking transmissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/admin/settings"
            className="px-5 py-2.5 rounded-full bg-[#E51E2B] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#D81A26] transition-all shadow-md shadow-[#E51E2B]/20"
          >
            Switch Site Theme
          </Link>
          <Link
            href="/"
            target="_blank"
            className={`px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all ${
              isDark
                ? "border-white/20 text-white hover:bg-white/10"
                : "border-black/15 text-zinc-700 hover:bg-black/5"
            }`}
          >
            Live Site
          </Link>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className={`p-6 rounded-2xl border flex flex-col transition-all ${
            isDark ? "bg-[#121217] border-white/10" : "bg-white border-black/[0.08] shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
              Enquiries
            </span>
            <Mail className="w-4 h-4 text-[#E51E2B]" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span
              className={`font-heading font-extrabold text-3xl ${
                isDark ? "text-white" : "text-[#09090B]"
              }`}
            >
              {stats.unreadEnquiries}
            </span>
            <span className="text-xs text-zinc-400">new / {stats.totalEnquiries} total</span>
          </div>
          <Link
            href="/admin/enquiries"
            className="mt-4 text-xs text-[#E51E2B] hover:underline flex items-center space-x-1 font-bold"
          >
            <span>View Inbox</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div
          className={`p-6 rounded-2xl border flex flex-col transition-all ${
            isDark ? "bg-[#121217] border-white/10" : "bg-white border-black/[0.08] shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
              Gallery Media
            </span>
            <ImageIcon className="w-4 h-4 text-[#E51E2B]" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span
              className={`font-heading font-extrabold text-3xl ${
                isDark ? "text-white" : "text-[#09090B]"
              }`}
            >
              {stats.galleryCount}
            </span>
            <span className="text-xs text-zinc-400">active assets</span>
          </div>
          <Link
            href="/admin/gallery"
            className="mt-4 text-xs text-[#E51E2B] hover:underline flex items-center space-x-1 font-bold"
          >
            <span>Manage Gallery</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div
          className={`p-6 rounded-2xl border flex flex-col transition-all ${
            isDark ? "bg-[#121217] border-white/10" : "bg-white border-black/[0.08] shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
              Documentary Crew
            </span>
            <Users className="w-4 h-4 text-[#E51E2B]" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span
              className={`font-heading font-extrabold text-3xl ${
                isDark ? "text-white" : "text-[#09090B]"
              }`}
            >
              {stats.teamCount}
            </span>
            <span className="text-xs text-zinc-400">production roles</span>
          </div>
          <Link
            href="/admin/documentary"
            className="mt-4 text-xs text-[#E51E2B] hover:underline flex items-center space-x-1 font-bold"
          >
            <span>Edit Credits</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div
          className={`p-6 rounded-2xl border flex flex-col transition-all ${
            isDark ? "bg-[#121217] border-white/10" : "bg-white border-black/[0.08] shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
              Roster Artists
            </span>
            <TrendingUp className="w-4 h-4 text-[#E51E2B]" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span
              className={`font-heading font-extrabold text-3xl ${
                isDark ? "text-white" : "text-[#09090B]"
              }`}
            >
              {stats.artistCount}
            </span>
            <span className="text-xs text-zinc-400">collective</span>
          </div>
          <Link
            href="/admin/home-extras"
            className="mt-4 text-xs text-[#E51E2B] hover:underline flex items-center space-x-1 font-bold"
          >
            <span>Edit Roster</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Quick Shortcuts Grid */}
      <div>
        <h2
          className={`font-heading font-extrabold text-xl uppercase tracking-wider mb-6 ${
            isDark ? "text-white" : "text-[#09090B]"
          }`}
        >
          Content Management Shortcuts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shortcuts.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.title}
                href={s.href}
                className={`group p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                  isDark
                    ? "bg-[#121217] border-white/10 hover:border-[#E51E2B]/50 shadow-black/40"
                    : "bg-white border-black/[0.08] hover:border-[#E51E2B]/50 shadow-sm"
                }`}
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center text-[#E51E2B] group-hover:scale-110 transition-transform ${
                      isDark ? "bg-white/[0.04] border-white/10" : "bg-red-50 border-[#E51E2B]/20"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3
                    className={`mt-4 font-heading font-extrabold text-lg transition-colors ${
                      isDark
                        ? "text-white group-hover:text-[#FF4D58]"
                        : "text-[#09090B] group-hover:text-[#E51E2B]"
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p
                    className={`mt-2 text-xs sm:text-sm font-light leading-relaxed ${
                      isDark ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#E51E2B] group-hover:translate-x-1 transition-transform">
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
