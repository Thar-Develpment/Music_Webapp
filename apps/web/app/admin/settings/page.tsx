"use client";

import React, { useState, useEffect } from "react";
import { Setting } from "@music-label/shared";
import { Save, Check, AlertCircle, RefreshCw, Globe, Mail, Phone, MapPin } from "lucide-react";

export default function AdminSettingsPage() {
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
        }
      } catch (e) {
        setError("Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSavedSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Save failed");
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center p-20 text-zinc-400">
        <RefreshCw className="w-6 h-6 animate-spin text-[#D4AF37] mr-3" />
        <span>Loading Site Settings...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
            Global Configuration
          </span>
          <h1 className="font-heading font-extrabold text-3xl text-white uppercase tracking-tight">
            Site & Social Settings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Update header brand name, footer statement, booking contacts, and global social media URLs.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          id="admin-save-settings-btn"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#D4AF37] text-[#070709] font-bold text-xs uppercase tracking-wider hover:bg-[#F5D77F] transition-all shadow-lg shrink-0 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : savedSuccess ? (
            <Check className="w-4 h-4 text-emerald-950" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{savedSuccess ? "Settings Saved!" : saving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Global site settings updated successfully. Changes are live immediately.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Brand Information */}
        <div className="p-6 rounded-2xl glass-panel space-y-4 border border-white/10">
          <h2 className="font-heading font-bold text-sm text-[#F5D77F] uppercase tracking-wider border-b border-white/10 pb-3">
            Brand Identity & Taglines
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                Label / Brand Name
              </label>
              <input
                type="text"
                required
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
              Footer Mission Description
            </label>
            <textarea
              rows={3}
              value={settings.footerText}
              onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>

        {/* Bookings & Contact Info */}
        <div className="p-6 rounded-2xl glass-panel space-y-4 border border-white/10">
          <h2 className="font-heading font-bold text-sm text-[#F5D77F] uppercase tracking-wider border-b border-white/10 pb-3">
            Public Booking Contacts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                Booking Email
              </label>
              <input
                type="email"
                required
                value={settings.bookingEmail}
                onChange={(e) => setSettings({ ...settings, bookingEmail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                Booking Phone
              </label>
              <input
                type="tel"
                required
                value={settings.bookingPhone}
                onChange={(e) => setSettings({ ...settings, bookingPhone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
              Studio Address
            </label>
            <input
              type="text"
              value={settings.address || ""}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="p-6 rounded-2xl glass-panel space-y-4 border border-white/10">
          <h2 className="font-heading font-bold text-sm text-[#F5D77F] uppercase tracking-wider border-b border-white/10 pb-3">
            Official Social Media Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
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
                className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
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
                className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
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
                className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
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
                className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
