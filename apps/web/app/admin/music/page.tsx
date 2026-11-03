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
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.artist || !formData.description || !formData.thumbnailUrl) {
      alert("Please fill in Title, Artist, Description, and Cover Artwork.");
      return;
    }

    try {
      const isEditing = !!editingMusic;
      const url = isEditing ? `/api/admin/music/${editingMusic.id}` : "/api/admin/music";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        showNotification(isEditing ? "Track updated successfully" : "New audio track added successfully");
        setModalOpen(false);
        fetchMusic();
      } else {
        alert(json.error || "Failed to save track");
      }
    } catch (err) {
      alert("Network error saving track");
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
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#E51E2B] text-white text-xs font-semibold shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#E51E2B] mb-1">
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
          className="px-5 py-2.5 rounded-full bg-[#E51E2B] hover:bg-[#D81A26] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#E51E2B]/20 transition-all flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
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
                              ? "bg-[#E51E2B] text-white"
                              : "border border-[var(--subtle-border)] text-zinc-400 hover:text-[#E51E2B] hover:border-[#E51E2B]"
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
                                <span className="px-2 py-0.5 rounded-full bg-[#E51E2B]/10 text-[#E51E2B] border border-[#E51E2B]/30 text-[9px] font-bold uppercase">
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
                            className="p-1.5 rounded-lg border border-[var(--subtle-border)] text-zinc-400 hover:text-[var(--foreground)] hover:border-[#E51E2B] transition-colors cursor-pointer"
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

      {/* Add / Edit Music Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-[var(--subtle-border)] bg-[var(--card)] text-[var(--foreground)] p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--subtle-border)] mb-6">
              <div className="flex items-center space-x-2">
                <Music className="w-5 h-5 text-[#E51E2B]" />
                <h3 className="font-heading font-extrabold text-xl uppercase tracking-wide">
                  {editingMusic ? "Edit Audio Recording" : "Publish New Audio Track"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full border border-[var(--subtle-border)] text-zinc-400 hover:text-[var(--foreground)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title & Artist Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Track Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Obsidian Horizon"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#E51E2B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Artist Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.artist}
                    onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                    placeholder="e.g. Aethelgard"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#E51E2B]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Track Description / Liner Notes *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Atmospheric acoustic flutter and valve tube saturation..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#E51E2B]"
                />
              </div>

              {/* Cover Artwork Image */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Cover Artwork Thumbnail *
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="https://... or upload image"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#E51E2B]"
                  />
                  <label className="px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--card)] hover:border-[#E51E2B] text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#E51E2B]" />
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

                {formData.thumbnailUrl && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-[var(--subtle-border)] mt-2 bg-black">
                    <img
                      src={formData.thumbnailUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Audio Source (File Upload or URL) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Audio File (MP3 / WAV Upload or Audio URL)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={formData.audioUrl}
                    onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                    placeholder="/audio/track-1.mp3 or upload audio file"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#E51E2B]"
                  />
                  <label className="px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--card)] hover:border-[#E51E2B] text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shrink-0">
                    <FileAudio className="w-3.5 h-3.5 text-[#E51E2B]" />
                    <span>{uploadingAudio ? "Uploading..." : "Upload Audio (MP3/WAV)"}</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      disabled={uploadingAudio}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Duration, Genre, Year */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-zinc-400">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="3:45"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--subtle-border)] bg-[var(--background)] text-xs text-[var(--foreground)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-zinc-400">Genre</label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    placeholder="Dark Ambient"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--subtle-border)] bg-[var(--background)] text-xs text-[var(--foreground)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-zinc-400">Year</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--subtle-border)] bg-[var(--background)] text-xs text-[var(--foreground)]"
                  />
                </div>
              </div>

              {/* Streaming Links */}
              <div className="space-y-2 pt-1 border-t border-[var(--subtle-border)]">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
                  Streaming Platform URLs (Optional)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="url"
                    value={formData.spotifyUrl}
                    onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                    placeholder="Spotify URL (https://open.spotify.com/...)"
                    className="px-3 py-2 rounded-lg border border-[var(--subtle-border)] bg-[var(--background)] text-xs text-[var(--foreground)]"
                  />
                  <input
                    type="url"
                    value={formData.soundcloudUrl}
                    onChange={(e) => setFormData({ ...formData, soundcloudUrl: e.target.value })}
                    placeholder="SoundCloud URL (https://soundcloud.com/...)"
                    className="px-3 py-2 rounded-lg border border-[var(--subtle-border)] bg-[var(--background)] text-xs text-[var(--foreground)]"
                  />
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-music-checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded text-[#E51E2B] focus:ring-[#E51E2B] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="featured-music-checkbox" className="text-xs font-semibold text-[var(--foreground)] cursor-pointer">
                  Feature this track on the Master Audio Deck
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[var(--subtle-border)]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-[var(--foreground)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E51E2B] hover:bg-[#D81A26] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#E51E2B]/20"
                >
                  {editingMusic ? "Save Changes" : "Create Track"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
