"use client";

import React, { useState, useEffect, useRef } from "react";
import { MusicItem } from "@music-label/shared";
import {
  Music,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Upload,
  Play,
  Pause,
  X,
  CheckCircle,
  Radio,
  FileAudio,
  Disc3,
  Sparkles,
  Headphones,
  Sliders,
  Loader2,
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function AdminMusicPage() {
  const { isDark } = useTheme();
  const [musicItems, setMusicItems] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMusic, setEditingMusic] = useState<MusicItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);
  const [modalAudioPlaying, setModalAudioPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const modalAudioRef = useRef<HTMLAudioElement | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    artist: "Aethelgard",
    description: "",
    thumbnailUrl: "",
    audioUrl: "",
    duration: "3:45",
    genre: "Electronic / Orchestral",
    year: "2026",
    spotifyUrl: "",
    soundcloudUrl: "",
    appleMusicUrl: "",
    youtubeUrl: "",
    featured: false,
    order: 0,
  });

  const fetchMusic = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/music");
      const json = await res.json();
      if (json.success) {
        setMusicItems(json.data);
      }
    } catch (err) {
      // quiet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusic();
    const audio = new Audio();
    audio.onended = () => setActivePreviewId(null);
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleTogglePreview = (id: string, url: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (activePreviewId === id) {
      audio.pause();
      setActivePreviewId(null);
    } else {
      audio.src = url || "/audio/track-1.mp3";
      audio.play().catch(() => setActivePreviewId(null));
      setActivePreviewId(id);
    }
  };

  const handleOpenAddModal = () => {
    setEditingMusic(null);
    setFormData({
      title: "",
      artist: "Aethelgard",
      description: "",
      thumbnailUrl: "",
      audioUrl: "",
      duration: "3:45",
      genre: "Electronic / Orchestral",
      year: "2026",
      spotifyUrl: "",
      soundcloudUrl: "",
      appleMusicUrl: "",
      youtubeUrl: "",
      featured: false,
      order: musicItems.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (track: MusicItem) => {
    setEditingMusic(track);
    setFormData({
      title: track.title,
      artist: track.artist,
      description: track.description,
      thumbnailUrl: track.thumbnailUrl,
      audioUrl: track.audioUrl,
      duration: track.duration,
      genre: track.genre,
      year: track.year,
      spotifyUrl: track.spotifyUrl || "",
      soundcloudUrl: track.soundcloudUrl || "",
      appleMusicUrl: track.appleMusicUrl || "",
      youtubeUrl: track.youtubeUrl || "",
      featured: track.featured,
      order: track.order,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, thumbnailUrl: data.url }));
        showNotification("Cover artwork uploaded successfully");
      }
    } catch (err) {
      alert("Failed to upload cover art");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAudio(true);
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, audioUrl: data.url }));
        showNotification("Audio track file uploaded successfully");
      }
    } catch (err) {
      alert("Failed to upload audio file");
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleCloseModal = () => {
    if (modalAudioRef.current) {
      modalAudioRef.current.pause();
      modalAudioRef.current.src = "";
    }
    setModalAudioPlaying(false);
    setModalOpen(false);
  };

  const handleToggleModalAudio = () => {
    let audio = modalAudioRef.current;
    if (!audio) {
      audio = new Audio();
      modalAudioRef.current = audio;
    }

    if (modalAudioPlaying) {
      audio.pause();
      setModalAudioPlaying(false);
    } else {
      const src = formData.audioUrl || "/audio/track-1.mp3";
      audio.src = src;
      audio.play().then(() => {
        setModalAudioPlaying(true);
        audio.onended = () => setModalAudioPlaying(false);
      }).catch(() => {
        setModalAudioPlaying(false);
        alert("Unable to play audio. Check URL format or CORS permissions.");
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      alert("Please provide at least a Track Title.");
      return;
    }

    try {
      setIsSubmitting(true);
      const isEditing = !!editingMusic;
      const url = isEditing ? `/api/admin/music/${editingMusic.id}` : "/api/admin/music";
      const method = isEditing ? "PUT" : "POST";

      const resolvedTitle = formData.title.trim();
      const resolvedArtist = formData.artist?.trim() || "Aethelgard";
      const resolvedDescription =
        formData.description?.trim() ||
        `${resolvedTitle} — Master studio audio recording released by ${resolvedArtist}.`;
      const resolvedThumbnail =
        formData.thumbnailUrl?.trim() || "/logo-icon.png";
      const resolvedDuration = formData.duration?.trim() || "3:45";
      const resolvedGenre = formData.genre?.trim() || "Electronic / Orchestral";
      const resolvedYear = formData.year?.trim() || new Date().getFullYear().toString();

      const payload = {
        ...formData,
        title: resolvedTitle,
        artist: resolvedArtist,
        description: resolvedDescription,
        thumbnailUrl: resolvedThumbnail,
        duration: resolvedDuration,
        genre: resolvedGenre,
        year: resolvedYear,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        showNotification(isEditing ? "Track updated successfully" : "New audio track published successfully");
        handleCloseModal();
        fetchMusic();
      } else {
        alert(json.error || "Failed to save track");
      }
    } catch (err) {
      alert("Network error saving track");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete track "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/music/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        showNotification(`Track "${title}" removed`);
        setMusicItems((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      alert("Failed to delete track");
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#e11d48] text-white text-xs font-semibold shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#e11d48] mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Audio &amp; Discography Manager</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl uppercase tracking-wider text-[var(--foreground)]">
            Music Audio Catalog
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage audio tracks, upload MP3/WAV files, set cover artwork, and link streaming platforms
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          id="admin-add-music-btn"
          className="px-5 py-2.5 rounded-full bg-[#e11d48] hover:bg-[#D81A26] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e11d48]/20 transition-all flex items-center space-x-2 cursor-pointer self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Track</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-between border-b border-[var(--subtle-border)] pb-4">
        <div className="text-xs text-zinc-400 font-medium">
          Total Tracks: <span className="font-bold text-[var(--foreground)]">{musicItems.length}</span> master recordings
        </div>
      </div>

      {/* Music Table */}
      {loading ? (
        <div className="py-20 text-center text-zinc-400 text-sm">Loading music tracks...</div>
      ) : musicItems.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[var(--subtle-border)] rounded-2xl p-8">
          <Music className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
          <p className="text-sm font-semibold text-[var(--foreground)]">No music tracks cataloged</p>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            Click &quot;Add New Track&quot; to upload your first audio track or single.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--subtle-border)] bg-[var(--card)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--subtle-border)] text-zinc-400">
                  <th className="py-4 pl-6 pr-3 font-semibold uppercase tracking-wider w-12">Play</th>
                  <th className="py-4 px-4 font-semibold uppercase tracking-wider">Track &amp; Artist</th>
                  <th className="py-4 px-4 font-semibold uppercase tracking-wider hidden sm:table-cell">
                    Genre / Duration
                  </th>
                  <th className="py-4 px-4 font-semibold uppercase tracking-wider hidden md:table-cell">
                    Audio Source
                  </th>
                  <th className="py-4 pr-6 pl-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--subtle-border)]">
                {musicItems.map((track) => {
                  const isPlaying = activePreviewId === track.id;
                  return (
                    <tr
                      key={track.id}
                      className={`transition-colors ${
                        isDark ? "hover:bg-white/[0.02]" : "hover:bg-black/[0.01]"
                      }`}
                    >
                      {/* Play Button */}
                      <td className="py-4 pl-6 pr-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTogglePreview(track.id, track.audioUrl)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isPlaying
                              ? "bg-[#e11d48] text-white shadow-md shadow-[#e11d48]/30"
                              : "border border-[var(--subtle-border)] text-zinc-400 hover:text-[#e11d48] hover:border-[#e11d48]"
                          }`}
                          title={isPlaying ? "Stop preview" : "Play preview"}
                        >
                          {isPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-white" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </button>
                      </td>

                      {/* Track & Artist */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-[var(--subtle-border)] shrink-0 bg-black">
                            <img
                              src={track.thumbnailUrl}
                              alt={track.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-heading font-extrabold text-sm uppercase text-[var(--foreground)]">
                                {track.title}
                              </span>
                              {track.featured && (
                                <span className="px-2 py-0.5 rounded-full bg-[#e11d48]/10 text-[#e11d48] border border-[#e11d48]/30 text-[9px] font-bold uppercase">
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-zinc-400 mt-0.5">{track.artist}</div>
                          </div>
                        </div>
                      </td>

                      {/* Genre & Duration */}
                      <td className="py-4 px-4 hidden sm:table-cell whitespace-nowrap">
                        <div className="text-[var(--foreground)] font-medium">{track.genre}</div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          {track.duration} • {track.year}
                        </div>
                      </td>

                      {/* Audio Source */}
                      <td className="py-4 px-4 hidden md:table-cell max-w-xs truncate">
                        <span className="text-[11px] text-zinc-400 truncate block">
                          {track.audioUrl || "Standard catalog audio"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pr-6 pl-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(track)}
                            className="p-1.5 rounded-lg border border-[var(--subtle-border)] text-zinc-400 hover:text-[var(--foreground)] hover:border-[#e11d48] transition-colors cursor-pointer"
                            title="Edit Track"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(track.id, track.title)}
                            className="p-1.5 rounded-lg border border-[var(--subtle-border)] text-zinc-400 hover:text-red-500 hover:border-red-500/40 transition-colors cursor-pointer"
                            title="Delete Track"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Music Modal - Clean, Responsive, Professional Glassmorphism Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl border border-[var(--subtle-border)] bg-[var(--card)] text-[var(--foreground)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header (Sticky) */}
            <div className="p-5 sm:p-6 pb-4 border-b border-[var(--subtle-border)] flex items-center justify-between shrink-0 bg-[var(--card)]/95 backdrop-blur-sm z-10">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#e11d48]/10 text-[#e11d48] border border-[#e11d48]/25 flex items-center justify-center shrink-0">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl uppercase tracking-wide text-[var(--foreground)]">
                    {editingMusic ? "Edit Audio Recording" : "Publish New Audio Track"}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Configure master audio recording, artwork, metadata, and platform links
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full border border-[var(--subtle-border)] flex items-center justify-center text-zinc-400 hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Scrollable Body */}
            <form onSubmit={handleSubmit} id="music-modal-form" className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Section 1: Track Essentials */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[var(--subtle-border)] bg-zinc-500/[0.03] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                    <Disc3 className="w-4 h-4 text-[#e11d48]" />
                    <span>Track Essentials &amp; Credits</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Catalog Metadata</span>
                </div>

                {/* Title & Artist Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
                      Track Title <span className="text-[#e11d48]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Obsidian Horizon"
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
                      Artist / Producer Name <span className="text-[#e11d48]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.artist}
                      onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                      placeholder="e.g. Aethelgard"
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] transition-all"
                    />
                  </div>
                </div>

                {/* Genre, Duration, Year (3-column responsive grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
                      Genre
                    </label>
                    <input
                      type="text"
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      placeholder="e.g. Dark Ambient / Orchestral"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g. 3:45"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
                      Release Year
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="2026"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] transition-all"
                    />
                  </div>
                </div>

                {/* Description / Liner Notes (Non-blocking, Optional with Fallback) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Track Description / Liner Notes
                    </label>
                    <span className="text-[10px] text-zinc-500 italic">Optional — auto-fills if left blank</span>
                  </div>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Atmospheric acoustic flutter and valve tube saturation... (Leave blank to use default label notes)"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-xs sm:text-sm text-[var(--foreground)] focus:outline-none focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] transition-all resize-y"
                  />
                </div>
              </div>

              {/* Section 2: Master Audio Source & Playback Preview */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[var(--subtle-border)] bg-zinc-500/[0.03] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                    <FileAudio className="w-4 h-4 text-[#e11d48]" />
                    <span>Master Audio Recording &amp; Stems</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">MP3 • WAV • CDN</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={formData.audioUrl}
                    onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                    placeholder="/audio/track-1.mp3 or paste hosted audio URL"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-xs sm:text-sm text-[var(--foreground)] focus:outline-none focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] transition-all"
                  />
                  <label className="px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--card)] hover:border-[#e11d48] text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shrink-0 transition-colors shadow-sm">
                    {uploadingAudio ? (
                      <Loader2 className="w-4 h-4 text-[#e11d48] animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 text-[#e11d48]" />
                    )}
                    <span>{uploadingAudio ? "Uploading Audio..." : "Upload MP3 / WAV"}</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      disabled={uploadingAudio}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Live In-Modal Audio Player Preview */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)]">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <button
                      type="button"
                      onClick={handleToggleModalAudio}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${
                        modalAudioPlaying
                          ? "bg-[#e11d48] text-white shadow-lg shadow-[#e11d48]/40 animate-pulse"
                          : "bg-zinc-800 text-white hover:bg-[#e11d48]"
                      }`}
                      title={modalAudioPlaying ? "Pause audio" : "Test audio playback"}
                    >
                      {modalAudioPlaying ? (
                        <Pause className="w-4 h-4 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      )}
                    </button>
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-[var(--foreground)] truncate flex items-center space-x-1.5">
                        <Headphones className="w-3.5 h-3.5 text-[#e11d48] shrink-0" />
                        <span>{formData.audioUrl ? "Audio Source Ready" : "Default Audio Stream"}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono truncate max-w-[200px] sm:max-w-md">
                        {formData.audioUrl || "/audio/track-1.mp3 (Default Audio Preview)"}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${
                    modalAudioPlaying
                      ? "border-[#e11d48]/40 bg-[#e11d48]/10 text-[#e11d48]"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {modalAudioPlaying ? "Playing Now" : "Ready to Test"}
                  </span>
                </div>
              </div>

              {/* Section 3: Cover Artwork */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[var(--subtle-border)] bg-zinc-500/[0.03] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                    <Upload className="w-4 h-4 text-[#e11d48]" />
                    <span>Cover Artwork Thumbnail</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">1:1 Square</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="https://... or upload image (leave blank for logo default)"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-xs sm:text-sm text-[var(--foreground)] focus:outline-none focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] transition-all"
                  />
                  <label className="px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--card)] hover:border-[#e11d48] text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shrink-0 transition-colors shadow-sm">
                    {uploadingImage ? (
                      <Loader2 className="w-4 h-4 text-[#e11d48] animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 text-[#e11d48]" />
                    )}
                    <span>{uploadingImage ? "Uploading..." : "Upload Cover"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Artwork Live Preview Card */}
                <div className="flex items-center space-x-4 p-3 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)]">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-[var(--subtle-border)] bg-black shrink-0">
                    <img
                      src={formData.thumbnailUrl || "/logo-icon.png"}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/logo-icon.png";
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wide">
                      {formData.thumbnailUrl ? "Active Cover Artwork" : "Default Label Artwork"}
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Recommended: High resolution square image (at least 1000×1000 pixels) in JPG, PNG, or WebP.
                    </p>
                    {formData.thumbnailUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, thumbnailUrl: "" }))}
                        className="text-[11px] text-[#e11d48] hover:underline font-semibold cursor-pointer"
                      >
                        Reset to default artwork
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: Streaming Distribution Links (Optional) */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[var(--subtle-border)] bg-zinc-500/[0.03] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                    <ExternalLink className="w-4 h-4 text-[#e11d48]" />
                    <span>External Streaming Platforms (Optional)</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">DSP Links</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Spotify Link</label>
                    <input
                      type="url"
                      value={formData.spotifyUrl}
                      onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                      placeholder="https://open.spotify.com/track/..."
                      className="w-full px-3.5 py-2 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[#e11d48]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">SoundCloud Link</label>
                    <input
                      type="url"
                      value={formData.soundcloudUrl}
                      onChange={(e) => setFormData({ ...formData, soundcloudUrl: e.target.value })}
                      placeholder="https://soundcloud.com/..."
                      className="w-full px-3.5 py-2 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[#e11d48]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Apple Music Link</label>
                    <input
                      type="url"
                      value={formData.appleMusicUrl}
                      onChange={(e) => setFormData({ ...formData, appleMusicUrl: e.target.value })}
                      placeholder="https://music.apple.com/..."
                      className="w-full px-3.5 py-2 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[#e11d48]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">YouTube Music Link</label>
                    <input
                      type="url"
                      value={formData.youtubeUrl}
                      onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                      placeholder="https://music.youtube.com/..."
                      className="w-full px-3.5 py-2 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[#e11d48]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Master Deck Spotlight Switch */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[var(--subtle-border)] bg-zinc-500/[0.03] flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#e11d48]" />
                    <span>Spotlight on Master Audio Deck</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Pins this master track to the primary audio deck player on the music catalog view.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    id="featured-music-checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e11d48]"></div>
                </label>
              </div>
            </form>

            {/* Modal Footer (Sticky) */}
            <div className="p-4 sm:p-5 border-t border-[var(--subtle-border)] bg-[var(--card)]/95 backdrop-blur-sm flex items-center justify-between shrink-0 z-10">
              <div className="hidden sm:block text-[11px] text-zinc-400">
                All changes persist to Supabase database &amp; media storage.
              </div>
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl border border-[var(--subtle-border)] text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="music-modal-form"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#e11d48] hover:bg-[#D81A26] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e11d48]/25 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Track...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>{editingMusic ? "Save Changes" : "Publish Track"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
