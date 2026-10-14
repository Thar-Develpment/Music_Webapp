"use client";

import React, { useState, useEffect } from "react";
import { Artist, Manager, Testimonial, Counter } from "@music-label/shared";
import { Plus, Trash2, Check, AlertCircle, Sparkles, Quote, Users, Hash } from "lucide-react";

export default function AdminHomeExtras() {
  const [activeTab, setActiveTab] = useState<"artists" | "testimonials" | "managers" | "counters">("artists");

  const [artists, setArtists] = useState<Artist[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [counters, setCounters] = useState<Counter[]>([]);

  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Quick Add forms state
  const [artistForm, setArtistForm] = useState({ name: "", genre: "", photoUrl: "", spotifyUrl: "" });
  const [testimonialForm, setTestimonialForm] = useState({ name: "", role: "", quote: "", photoUrl: "" });
  const [managerForm, setManagerForm] = useState({ name: "", role: "", photoUrl: "" });
  const [counterForm, setCounterForm] = useState({ label: "", value: 100, suffix: "+" });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/public/home-extras");
      const json = await res.json();
      if (json.success) {
        setArtists(json.data.artists);
        setTestimonials(json.data.testimonials);
        setManagers(json.data.managers);
        setCounters(json.data.counters);
      }
    } catch (e) {
      setNotification({ type: "error", msg: "Failed to load home extras" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotice = (type: "success" | "error", msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4000);
  };

  // Add Item Handler
  const handleAddItem = async (type: string, itemData: unknown) => {
    try {
      const res = await fetch("/api/admin/home-extras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, item: itemData }),
      });
      const json = await res.json();
      if (json.success) {
        showNotice("success", `Added new ${type}!`);
        fetchData();
        // Reset forms
        if (type === "artist") setArtistForm({ name: "", genre: "", photoUrl: "", spotifyUrl: "" });
        if (type === "testimonial") setTestimonialForm({ name: "", role: "", quote: "", photoUrl: "" });
        if (type === "manager") setManagerForm({ name: "", role: "", photoUrl: "" });
        if (type === "counter") setCounterForm({ label: "", value: 100, suffix: "+" });
      } else {
        showNotice("error", json.error || "Failed to add");
      }
    } catch (e) {
      showNotice("error", "Error creating item");
    }
  };

  // Delete Item Handler
  const handleDeleteItem = async (type: "artists" | "testimonials" | "managers" | "counters", id: string) => {
    let updated;
    if (type === "artists") updated = artists.filter((i) => i.id !== id);
    else if (type === "testimonials") updated = testimonials.filter((i) => i.id !== id);
    else if (type === "managers") updated = managers.filter((i) => i.id !== id);
    else updated = counters.filter((i) => i.id !== id);

    try {
      const res = await fetch("/api/admin/home-extras", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, items: updated }),
      });
      const json = await res.json();
      if (json.success) {
        showNotice("success", "Item removed.");
        fetchData();
      }
    } catch (e) {
      showNotice("error", "Failed to delete item");
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
          Roster & Showcase Content
        </span>
        <h1 className="font-heading font-extrabold text-3xl text-white uppercase tracking-tight">
          Home Extras & Roster Manager
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
          Manage the signed artists image grid, critical testimonials, executive leadership, and animated statistics.
        </p>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center space-x-2 ${
            notification.type === "success"
              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
              : "bg-red-950/60 border-red-500/40 text-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("artists")}
          className={`px-5 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "artists"
              ? "bg-[#D4AF37] text-[#070709] font-bold shadow-md shadow-[#D4AF37]/20"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Artists Roster ({artists.length})
        </button>
        <button
          onClick={() => setActiveTab("testimonials")}
          className={`px-5 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "testimonials"
              ? "bg-[#D4AF37] text-[#070709] font-bold shadow-md shadow-[#D4AF37]/20"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Testimonials Slider ({testimonials.length})
        </button>
        <button
          onClick={() => setActiveTab("managers")}
          className={`px-5 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "managers"
              ? "bg-[#D4AF37] text-[#070709] font-bold shadow-md shadow-[#D4AF37]/20"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Managers ({managers.length})
        </button>
        <button
          onClick={() => setActiveTab("counters")}
          className={`px-5 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "counters"
              ? "bg-[#D4AF37] text-[#070709] font-bold shadow-md shadow-[#D4AF37]/20"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Counters ({counters.length})
        </button>
      </div>

      {/* 1. ARTISTS ROSTER */}
      {activeTab === "artists" && (
        <div className="space-y-8">
          {/* Quick Add Form */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h2 className="font-heading font-bold text-sm text-[#F5D77F] uppercase tracking-wider">
              Add Signed Artist to Grid
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Artist Name"
                value={artistForm.name}
                onChange={(e) => setArtistForm({ ...artistForm, name: e.target.value })}
                className="px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
              />
              <input
                type="text"
                placeholder="Genre / Sound Signature"
                value={artistForm.genre}
                onChange={(e) => setArtistForm({ ...artistForm, genre: e.target.value })}
                className="px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
              />
              <input
                type="url"
                placeholder="Photo URL"
                value={artistForm.photoUrl}
                onChange={(e) => setArtistForm({ ...artistForm, photoUrl: e.target.value })}
                className="px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
              />
              <input
                type="url"
                placeholder="Spotify URL (optional)"
                value={artistForm.spotifyUrl}
                onChange={(e) => setArtistForm({ ...artistForm, spotifyUrl: e.target.value })}
                className="px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
              />
            </div>
            <button
              onClick={() => handleAddItem("artist", artistForm)}
              disabled={!artistForm.name || !artistForm.genre || !artistForm.photoUrl}
              className="px-5 py-2.5 rounded-full bg-[#D4AF37] text-[#070709] font-bold text-xs uppercase tracking-wider hover:bg-[#F5D77F] disabled:opacity-40 cursor-pointer"
            >
              Add Artist
            </button>
          </div>

          {/* List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artists.map((art) => (
              <div key={art.id} className="rounded-2xl glass-panel p-4 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-black">
                    <img src={art.photoUrl} alt={art.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-white">{art.name}</h3>
                  <p className="text-xs text-[#D4AF37]">{art.genre}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                  <button
                    onClick={() => handleDeleteItem("artists", art.id)}
                    className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TESTIMONIALS SLIDER */}
      {activeTab === "testimonials" && (
        <div className="space-y-8">
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h2 className="font-heading font-bold text-sm text-[#F5D77F] uppercase tracking-wider">
              Add Critical Testimonial
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Author Name"
                value={testimonialForm.name}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                className="px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
              />
              <input
                type="text"
                placeholder="Role / Publication"
                value={testimonialForm.role}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                className="px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
              />
              <input
                type="url"
                placeholder="Author Photo URL"
                value={testimonialForm.photoUrl}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, photoUrl: e.target.value })}
                className="px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Quote text..."
              value={testimonialForm.quote}
              onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
            />
            <button
              onClick={() => handleAddItem("testimonial", testimonialForm)}
              disabled={!testimonialForm.name || !testimonialForm.quote || !testimonialForm.photoUrl}
              className="px-5 py-2.5 rounded-full bg-[#D4AF37] text-[#070709] font-bold text-xs uppercase tracking-wider hover:bg-[#F5D77F] disabled:opacity-40 cursor-pointer"
            >
              Add Testimonial
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="rounded-2xl glass-panel p-6 border border-white/10 flex flex-col justify-between">
                <div>
                  <Quote className="w-6 h-6 text-[#D4AF37]/40 mb-3" />
                  <p className="text-xs text-zinc-200 italic font-light leading-relaxed mb-4">
                    “{t.quote}”
                  </p>
                  <div className="flex items-center space-x-3">
                    <img src={t.photoUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/30" />
                    <div>
                      <h4 className="font-heading font-bold text-sm text-white">{t.name}</h4>
                      <p className="text-[11px] text-[#D4AF37]">{t.role}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                  <button
                    onClick={() => handleDeleteItem("testimonials", t.id)}
                    className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MANAGERS */}
      {activeTab === "managers" && (
        <div className="space-y-8">
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h2 className="font-heading font-bold text-sm text-[#F5D77F] uppercase tracking-wider">
              Add Executive Manager
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Manager Name"
                value={managerForm.name}
                onChange={(e) => setManagerForm({ ...managerForm, name: e.target.value })}
                className="px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
              />
              <input
                type="text"
                placeholder="Role / Title"
                value={managerForm.role}
                onChange={(e) => setManagerForm({ ...managerForm, role: e.target.value })}
                className="px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
              />
              <input
                type="url"
                placeholder="Photo URL"
                value={managerForm.photoUrl}
                onChange={(e) => setManagerForm({ ...managerForm, photoUrl: e.target.value })}
                className="px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
              />
            </div>
            <button
              onClick={() => handleAddItem("manager", managerForm)}
              disabled={!managerForm.name || !managerForm.role || !managerForm.photoUrl}
              className="px-5 py-2.5 rounded-full bg-[#D4AF37] text-[#070709] font-bold text-xs uppercase tracking-wider hover:bg-[#F5D77F] disabled:opacity-40 cursor-pointer"
            >
              Add Manager
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {managers.map((m) => (
              <div key={m.id} className="rounded-2xl glass-panel p-6 border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={m.photoUrl} alt={m.name} className="w-16 h-16 rounded-full object-cover border border-[#D4AF37]/30" />
                  <div>
                    <h4 className="font-heading font-bold text-base text-white">{m.name}</h4>
                    <p className="text-xs text-[#D4AF37]">{m.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteItem("managers", m.id)}
                  className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. COUNTERS */}
      {activeTab === "counters" && (
        <div className="space-y-8">
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h2 className="font-heading font-bold text-sm text-[#F5D77F] uppercase tracking-wider">
              Add Animated Counter Metric
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Metric Label (e.g. Global Streams)"
                value={counterForm.label}
                onChange={(e) => setCounterForm({ ...counterForm, label: e.target.value })}
                className="px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
              />
              <input
                type="number"
                placeholder="Number Value (e.g. 250)"
                value={counterForm.value}
                onChange={(e) => setCounterForm({ ...counterForm, value: Number(e.target.value) })}
                className="px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
              />
              <input
                type="text"
                placeholder="Suffix (e.g. M+, +, Countries)"
                value={counterForm.suffix}
                onChange={(e) => setCounterForm({ ...counterForm, suffix: e.target.value })}
                className="px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
              />
            </div>
            <button
              onClick={() => handleAddItem("counter", counterForm)}
              disabled={!counterForm.label}
              className="px-5 py-2.5 rounded-full bg-[#D4AF37] text-[#070709] font-bold text-xs uppercase tracking-wider hover:bg-[#F5D77F] disabled:opacity-40 cursor-pointer"
            >
              Add Counter
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {counters.map((c) => (
              <div key={c.id} className="rounded-2xl glass-panel p-6 border border-white/10 flex flex-col justify-between">
                <div>
                  <span className="font-heading font-extrabold text-3xl gold-text-gradient">
                    {c.value}{c.suffix}
                  </span>
                  <p className="text-xs text-zinc-400 font-semibold uppercase mt-1">{c.label}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                  <button
                    onClick={() => handleDeleteItem("counters", c.id)}
                    className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
