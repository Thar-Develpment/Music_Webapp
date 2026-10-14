"use client";

import React, { useState, useEffect } from "react";
import { MediaAsset } from "@music-label/shared";
import {
  Search,
  Plus,
  Copy,
  Check,
  Play,
  Upload,
  Link as LinkIcon,
  X,
  ExternalLink,
  Filter,
} from "lucide-react";

export default function AdminMediaLibrary() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | "image" | "video">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Add Asset Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [url, setUrl] = useState("");
  const [kind, setKind] = useState<"image" | "video">("image");
  const [saving, setSaving] = useState(false);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/admin/media");
      const json = await res.json();
      if (json.success) {
        setAssets(json.data);
      }
    } catch (e) {
      // quiet
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, alt, url, kind, source: "url" }),
      });
      const json = await res.json();
      if (json.success) {
        fetchMedia();
        setIsAddModalOpen(false);
        setTitle("");
        setAlt("");
        setUrl("");
      }
    } catch (e) {
      // quiet
    } finally {
      setSaving(false);
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKind = kindFilter === "all" || asset.kind === kindFilter;
    return matchesSearch && matchesKind;
  });

  return (
    <div className="flex flex-col space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
            Asset Repository
          </span>
          <h1 className="font-heading font-extrabold text-3xl text-white uppercase tracking-tight">
            Media Library
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Search, preview, copy URLs, and reuse images and video assets across all site sections.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#D4AF37] text-[#070709] font-bold text-xs uppercase tracking-wider hover:bg-[#F5D77F] transition-all shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register Asset</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search assets by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#D4AF37]" />
          {(["all", "image", "video"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setKindFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all cursor-pointer ${
                kindFilter === filter
                  ? "bg-[#D4AF37] text-[#070709]"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="group rounded-2xl glass-panel overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between"
          >
            {/* Image / Video preview */}
            <div className="relative aspect-video bg-black/80 overflow-hidden">
              <img
                src={asset.url}
                alt={asset.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {asset.kind === "video" && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[#D4AF37]">
                  <Play className="w-5 h-5 fill-current" />
                </div>
              )}
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[9px] uppercase tracking-wider text-[#D4AF37] font-bold">
                {asset.kind}
              </span>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <h4 className="font-heading font-semibold text-xs text-white truncate">
                  {asset.title}
                </h4>
                <p className="text-[10px] text-zinc-400 truncate mt-0.5">{asset.alt}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => copyToClipboard(asset.url, asset.id)}
                  className="inline-flex items-center space-x-1 text-[11px] text-[#D4AF37] hover:underline cursor-pointer"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <a
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-white"
                  title="Open source"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: REGISTER MEDIA ASSET */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl glass-panel-gold p-8 border border-[#D4AF37]/40 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-heading font-extrabold text-lg text-white uppercase tracking-wider">
                Register Media Asset
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedia} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Asset Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Vinyl Sleeve"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Alt Text (Screen Readers)
                </label>
                <input
                  type="text"
                  required
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="e.g. Gold vinyl gatefold on marble surface"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Media Kind
                </label>
                <select
                  value={kind}
                  onChange={(e) => setKind(e.target.value as "image" | "video")}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="image" className="bg-black">Image</option>
                  <option value="video" className="bg-black">Video Link</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Direct URL
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 rounded-xl bg-[#D4AF37] text-[#070709] font-bold text-xs uppercase tracking-wider hover:bg-[#F5D77F] transition-all cursor-pointer"
              >
                {saving ? "Registering..." : "Save to Media Library"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
