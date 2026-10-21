"use client";

import React, { useState, useEffect } from "react";
import { Setting, SiteTheme } from "@music-label/shared";
import {
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  Sun,
  Moon,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function AdminSettingsPage() {
  const { theme, isDark, setTheme } = useTheme();
  const [settings, setSettings] = useState<Setting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/public/settings");
        const json = await res.json();
        if (json.success) {
          setSettings(json.data);
          // If server setting has a theme, align with theme provider
          if (json.data.theme && (json.data.theme === "black" || json.data.theme === "white")) {
            setTheme(json.data.theme);
          }
        }
      } catch (e) {
        setError("Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [setTheme]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSavedSuccess(false);
    setError(null);

    const payload = { ...settings, theme };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Save failed");
      }
      setSettings(json.data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleQuickThemeSelect = async (newTheme: SiteTheme) => {
    setTheme(newTheme);
    if (settings) {
      const updated = { ...settings, theme: newTheme };
      setSettings(updated);
      try {
        await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
      } catch (e) {}
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center p-20 text-zinc-500">
        <RefreshCw className="w-6 h-6 animate-spin text-[#E51E2B] mr-3" />
        <span>Loading Site Settings...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 max-w-5xl">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#E51E2B] uppercase">
            Global Configuration
          </span>
          <h1
            className={`font-heading font-extrabold text-2xl sm:text-3xl uppercase tracking-tight ${
              isDark ? "text-white" : "text-[#09090B]"
            }`}
          >
            Site & Theme Settings
          </h1>
          <p
            className={`text-xs sm:text-sm font-light mt-1 ${
              isDark ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            Switch website themes on demand, update brand identity, booking channels, and official
            social media URLs.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={saving}
          id="admin-save-settings-btn"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#E51E2B] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#D81A26] transition-all shadow-md shadow-[#E51E2B]/20 shrink-0 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : savedSuccess ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{savedSuccess ? "Settings Saved!" : saving ? "Saving..." : "Save All Settings"}</span>
        </button>
      </div>

      {/* Success & Status Alerts */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2 shadow-sm">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Global site settings saved successfully. Changes are active immediately.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2 shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* =========================================================================
            1. WEBSITE THEME CONFIGURATION (WHITE VS BLACK THEME BUTTONS)
            ========================================================================= */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 transition-all ${
            isDark ? "bg-[#121217] border-white/10 shadow-black/40" : "bg-white border-black/[0.08]"
          }`}
        >
          <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 ${
              isDark ? "border-white/10" : "border-black/[0.08]"
            }`}
          >
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#E51E2B]" />
                <h2
                  className={`font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider ${
                    isDark ? "text-white" : "text-[#09090B]"
                  }`}
                >
                  Website Theme Configuration
                </h2>
              </div>
              <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                Select the active color theme for the website and admin console. Both themes
                maintain our signature Electric Rock Red accents.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Current:
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-[#E51E2B] text-white">
                {theme === "black" ? "Obsidian Black" : "Alabaster White"}
              </span>
            </div>
          </div>

          {/* Interactive Visual Theme Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Option 1: Alabaster White & Red */}
            <div
              onClick={() => handleQuickThemeSelect("white")}
              id="theme-select-white"
              className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative group ${
                theme === "white"
                  ? "border-[#E51E2B] bg-red-50/40 shadow-lg shadow-[#E51E2B]/10 ring-2 ring-[#E51E2B]/20"
                  : isDark
                  ? "border-white/10 bg-[#16161D] hover:border-white/20"
                  : "border-black/[0.08] bg-zinc-50/50 hover:border-black/20 hover:bg-white"
              }`}
            >
              {/* Active Badge */}
              {theme === "white" && (
                <div className="absolute top-4 right-4 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E51E2B] text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
                  <Check className="w-3 h-3" />
                  <span>Active Theme</span>
                </div>
              )}

              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-black/10 flex items-center justify-center text-amber-500 shadow-sm">
                    <Sun className="w-5 h-5 text-[#E51E2B]" />
                  </div>
                  <div>
                    <h3
                      className={`font-heading font-extrabold text-base uppercase ${
                        isDark && theme !== "white" ? "text-zinc-200" : "text-[#09090B]"
                      }`}
                    >
                      Alabaster White & Red
                    </h3>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      High-Key Editorial Luxury
                    </span>
                  </div>
                </div>

                <p
                  className={`text-xs leading-relaxed font-light mb-5 ${
                    isDark && theme !== "white" ? "text-zinc-400" : "text-zinc-600"
                  }`}
                >
                  Clean alabaster canvas (
                  <code className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-black/10 text-zinc-800">
                    #FAFAFC
                  </code>
                  ) with deep typography, frosted white glassmorphism, and bold electric rock red
                  highlights.
                </p>

                {/* Visual Palette Preview */}
                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between mb-4 shadow-sm ${
                    isDark ? "bg-[#1c1c24] border-white/10" : "bg-white border-black/10"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full bg-[#FAFAFC] border border-black/20"
                      title="Canvas #FAFAFC"
                    />
                    <div className="w-6 h-6 rounded-full bg-[#09090B]" title="Text #09090B" />
                    <div className="w-6 h-6 rounded-full bg-[#E51E2B]" title="Accent #E51E2B" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">White Canvas Palette</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                id="btn-switch-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickThemeSelect("white");
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  theme === "white"
                    ? "bg-[#E51E2B] text-white shadow-md shadow-[#E51E2B]/20"
                    : isDark
                    ? "bg-white/10 border border-white/20 text-white hover:border-[#E51E2B] hover:text-[#E51E2B]"
                    : "bg-white border border-black/15 text-zinc-700 hover:border-[#E51E2B] hover:text-[#E51E2B]"
                }`}
              >
                {theme === "white" ? "Theme Selected" : "Switch To White Theme"}
              </button>
            </div>

            {/* Theme Option 2: Obsidian Black & Red */}
            <div
              onClick={() => handleQuickThemeSelect("black")}
              id="theme-select-black"
              className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative group ${
                theme === "black"
                  ? "border-[#E51E2B] bg-[#16161D] shadow-xl shadow-black/40 ring-2 ring-[#E51E2B]/20"
                  : isDark
                  ? "border-white/10 bg-[#16161D] hover:border-white/20 text-white"
                  : "border-black/[0.08] bg-[#0e0e12] hover:border-zinc-800 text-white"
              }`}
            >
              {/* Active Badge */}
              {theme === "black" && (
                <div className="absolute top-4 right-4 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E51E2B] text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
                  <Check className="w-3 h-3" />
                  <span>Active Theme</span>
                </div>
              )}

              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1e1e24] border border-white/10 flex items-center justify-center text-[#E51E2B] shadow-sm">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-white uppercase">
                      Obsidian Black & Red
                    </h3>
                    <span className="text-[11px] text-zinc-400 font-medium">
                      Underground Concert Luxury
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-light mb-5">
                  Deep obsidian canvas (
                  <code className="font-mono text-[10px] bg-black/60 px-1.5 py-0.5 rounded border border-white/10 text-zinc-300">
                    #08080A
                  </code>
                  ) with crisp white typography, dark smoked glass cards, and glowing red accents.
                </p>

                {/* Visual Palette Preview */}
                <div className="p-3.5 rounded-xl bg-[#1c1c24] border border-white/10 flex items-center justify-between mb-4 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded-full bg-[#08080A] border border-white/20"
                      title="Canvas #08080A"
                    />
                    <div className="w-6 h-6 rounded-full bg-[#F4F4F6]" title="Text #F4F4F6" />
                    <div className="w-6 h-6 rounded-full bg-[#E51E2B]" title="Accent #E51E2B" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">Obsidian Dark Palette</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                id="btn-switch-black"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickThemeSelect("black");
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  theme === "black"
                    ? "bg-[#E51E2B] text-white shadow-md shadow-[#E51E2B]/30"
                    : "bg-white/10 border border-white/20 text-white hover:border-[#E51E2B] hover:text-[#E51E2B]"
                }`}
              >
                {theme === "black" ? "Theme Selected" : "Switch To Black Theme"}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. BRAND IDENTITY & TAGLINES
            ========================================================================= */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-5 transition-all ${
            isDark ? "bg-[#121217] border-white/10 shadow-black/40" : "bg-white border-black/[0.08]"
          }`}
        >
          <h2
            className={`font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider border-b pb-3 ${
              isDark ? "text-white border-white/10" : "text-[#09090B] border-black/[0.08]"
            }`}
          >
            Brand Identity & Taglines
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                  isDark ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                Record Label Name
              </label>
              <input
                type="text"
                required
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:border-[#E51E2B] focus:ring-1 focus:ring-[#E51E2B] focus:outline-none transition-all ${
                  isDark
                    ? "bg-[#181820] border-white/10 text-white placeholder-zinc-500"
                    : "bg-zinc-50 border-black/10 text-[#09090B]"
                }`}
              />
            </div>
            <div>
              <label
                className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                  isDark ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                Official Brand Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:border-[#E51E2B] focus:ring-1 focus:ring-[#E51E2B] focus:outline-none transition-all ${
                  isDark
                    ? "bg-[#181820] border-white/10 text-white placeholder-zinc-500"
                    : "bg-zinc-50 border-black/10 text-[#09090B]"
                }`}
              />
            </div>
          </div>

          <div>
            <label
              className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Footer Mission Description
            </label>
            <textarea
              rows={3}
              value={settings.footerText}
              onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:border-[#E51E2B] focus:ring-1 focus:ring-[#E51E2B] focus:outline-none transition-all ${
                isDark
                  ? "bg-[#181820] border-white/10 text-white placeholder-zinc-500"
                  : "bg-zinc-50 border-black/10 text-[#09090B]"
              }`}
            />
          </div>
        </div>

        {/* =========================================================================
            3. PUBLIC BOOKING CONTACTS
            ========================================================= */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-5 transition-all ${
            isDark ? "bg-[#121217] border-white/10 shadow-black/40" : "bg-white border-black/[0.08]"
          }`}
        >
          <h2
            className={`font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider border-b pb-3 ${
              isDark ? "text-white border-white/10" : "text-[#09090B] border-black/[0.08]"
            }`}
          >
            Public Booking Contacts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                  isDark ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                Booking Email
              </label>
              <input
                type="email"
                required
                value={settings.bookingEmail}
                onChange={(e) => setSettings({ ...settings, bookingEmail: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:border-[#E51E2B] focus:ring-1 focus:ring-[#E51E2B] focus:outline-none transition-all ${
                  isDark
                    ? "bg-[#181820] border-white/10 text-white placeholder-zinc-500"
                    : "bg-zinc-50 border-black/10 text-[#09090B]"
                }`}
              />
            </div>
            <div>
              <label
                className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                  isDark ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                Booking Phone
              </label>
              <input
                type="tel"
                required
                value={settings.bookingPhone}
                onChange={(e) => setSettings({ ...settings, bookingPhone: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:border-[#E51E2B] focus:ring-1 focus:ring-[#E51E2B] focus:outline-none transition-all ${
                  isDark
                    ? "bg-[#181820] border-white/10 text-white placeholder-zinc-500"
                    : "bg-zinc-50 border-black/10 text-[#09090B]"
                }`}
              />
            </div>
          </div>

          <div>
            <label
              className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Studio Sanctuary Address
            </label>
            <input
              type="text"
              value={settings.address || ""}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:border-[#E51E2B] focus:ring-1 focus:ring-[#E51E2B] focus:outline-none transition-all ${
                isDark
                  ? "bg-[#181820] border-white/10 text-white placeholder-zinc-500"
                  : "bg-zinc-50 border-black/10 text-[#09090B]"
              }`}
            />
          </div>
        </div>

        {/* =========================================================================
            4. OFFICIAL SOCIAL MEDIA LINKS
            ========================================================================= */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-5 transition-all ${
            isDark ? "bg-[#121217] border-white/10 shadow-black/40" : "bg-white border-black/[0.08]"
          }`}
        >
          <h2
            className={`font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider border-b pb-3 ${
              isDark ? "text-white border-white/10" : "text-[#09090B] border-black/[0.08]"
            }`}
          >
            Official Social Media Channels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                  isDark ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.socialLinks.instagram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                  })
                }
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:border-[#E51E2B] focus:ring-1 focus:ring-[#E51E2B] focus:outline-none transition-all ${
                  isDark
                    ? "bg-[#181820] border-white/10 text-white placeholder-zinc-500"
                    : "bg-zinc-50 border-black/10 text-[#09090B]"
                }`}
              />
            </div>

            <div>
              <label
                className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                  isDark ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                YouTube URL
              </label>
              <input
                type="url"
                value={settings.socialLinks.youtube}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, youtube: e.target.value },
                  })
                }
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:border-[#E51E2B] focus:ring-1 focus:ring-[#E51E2B] focus:outline-none transition-all ${
                  isDark
                    ? "bg-[#181820] border-white/10 text-white placeholder-zinc-500"
                    : "bg-zinc-50 border-black/10 text-[#09090B]"
                }`}
              />
            </div>

            <div>
              <label
                className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                  isDark ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.socialLinks.facebook}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, facebook: e.target.value },
                  })
                }
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:border-[#E51E2B] focus:ring-1 focus:ring-[#E51E2B] focus:outline-none transition-all ${
                  isDark
                    ? "bg-[#181820] border-white/10 text-white placeholder-zinc-500"
                    : "bg-zinc-50 border-black/10 text-[#09090B]"
                }`}
              />
            </div>

            <div>
              <label
                className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                  isDark ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                Spotify Profile URL
              </label>
              <input
                type="url"
                value={settings.socialLinks.spotify}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, spotify: e.target.value },
                  })
                }
                className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:border-[#E51E2B] focus:ring-1 focus:ring-[#E51E2B] focus:outline-none transition-all ${
                  isDark
                    ? "bg-[#181820] border-white/10 text-white placeholder-zinc-500"
                    : "bg-zinc-50 border-black/10 text-[#09090B]"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div
          className={`flex items-center justify-between p-6 rounded-2xl border shadow-sm transition-all ${
            isDark ? "bg-[#121217] border-white/10" : "bg-white border-black/[0.08]"
          }`}
        >
          <div className="flex items-center space-x-2 text-xs text-zinc-400">
            <ExternalLink className="w-4 h-4 text-[#E51E2B]" />
            <span>Theme and setting modifications are active across all routes immediately.</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#E51E2B] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#D81A26] transition-all shadow-md shadow-[#E51E2B]/20 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : savedSuccess ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{savedSuccess ? "Saved!" : saving ? "Saving..." : "Save All Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
