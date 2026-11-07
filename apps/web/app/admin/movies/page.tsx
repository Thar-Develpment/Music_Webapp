"use client";

import React, { useState, useEffect } from "react";
import { MovieItem } from "@music-label/shared";
import {
  Film,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Upload,
  X,
  CheckCircle,
  Sparkles,
  Loader2,
  RotateCcw,
  Info,
} from "lucide-react";
import { YoutubeIcon } from "@/components/ui/SocialIcons";
import { useTheme } from "@/components/theme/ThemeProvider";
import { extractYouTubeId, getYouTubeThumbnail, fetchYouTubeMetadata } from "@/lib/youtube";

export default function AdminMoviesPage() {
  const { isDark } = useTheme();
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDbConnected, setIsDbConnected] = useState<boolean | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<MovieItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fetchingYouTube, setFetchingYouTube] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Tracks which fields the user has manually changed
  const [userEditedFields, setUserEditedFields] = useState({
    title: false,
    description: false,
    thumbnailUrl: false,
    director: false,
  });

  // Cached YouTube original metadata for current URL
  const [youtubeMeta, setYoutubeMeta] = useState<{
    videoId: string;
    title: string;
    author: string;
    description: string;
    thumbnailUrl: string;
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    thumbnailUrl: "",
    director: "One Roof Studios",
    year: "2026",
    duration: "1h 45m",
    genre: "Documentary Feature",
    featured: false,
    order: 0,
  });

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/movies");
      const json = await res.json();
      if (json.success) {
        setMovies(json.data);
        if (json.isSupabaseConfigured !== undefined) {
          setIsDbConnected(json.isSupabaseConfigured);
        }
      } else {
        showNotification(json.error || "Failed to load movies");
      }
    } catch (err) {
      // quiet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingMovie(null);
    setUserEditedFields({
      title: false,
      description: false,
      thumbnailUrl: false,
      director: false,
    });
    setYoutubeMeta(null);
    setFormData({
      title: "",
      description: "",
      youtubeUrl: "",
      thumbnailUrl: "",
      director: "One Roof Studios",
      year: "2026",
      duration: "1h 45m",
      genre: "Documentary Feature",
      featured: false,
      order: movies.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (movie: MovieItem) => {
    setEditingMovie(movie);
    const videoId = extractYouTubeId(movie.youtubeUrl);
    const ytThumb = videoId ? getYouTubeThumbnail(videoId) : "";
    const isCustomThumb = !!movie.thumbnailUrl && movie.thumbnailUrl !== ytThumb;

    setUserEditedFields({
      title: !!movie.title,
      description: !!movie.description,
      thumbnailUrl: isCustomThumb,
      director: movie.director !== "One Roof Studios",
    });

    if (videoId) {
      setYoutubeMeta({
        videoId,
        title: movie.title,
        author: movie.director,
        description: movie.description,
        thumbnailUrl: ytThumb,
      });
    } else {
      setYoutubeMeta(null);
    }

    setFormData({
      title: movie.title,
      description: movie.description,
      youtubeUrl: movie.youtubeUrl,
      thumbnailUrl: movie.thumbnailUrl || ytThumb,
      director: movie.director,
      year: movie.year,
      duration: movie.duration,
      genre: movie.genre,
      featured: movie.featured,
      order: movie.order,
    });
    setModalOpen(true);
  };

  // Sync / fetch YouTube details when URL changes or user clicks fetch
  const syncYouTubeDetails = async (url: string, forceOverrideAll: boolean = false) => {
    const videoId = extractYouTubeId(url);
    if (!videoId) return;

    const defaultThumbnail = getYouTubeThumbnail(videoId, "maxres");

    // Immediately provide high-res YouTube thumbnail fallback
    if (forceOverrideAll || !userEditedFields.thumbnailUrl) {
      setFormData((prev) => ({
        ...prev,
        thumbnailUrl: defaultThumbnail,
      }));
    }

    try {
      setFetchingYouTube(true);
      const meta = await fetchYouTubeMetadata(videoId);

      setYoutubeMeta({
        videoId,
        title: meta.title,
        author: meta.author,
        description: meta.description,
        thumbnailUrl: meta.thumbnailUrl || defaultThumbnail,
      });

      setFormData((prev) => ({
        ...prev,
        title: forceOverrideAll || !userEditedFields.title ? meta.title : prev.title,
        description:
          forceOverrideAll || !userEditedFields.description
            ? meta.description || `Official video release from ${meta.author || "One Roof Studios"}.`
            : prev.description,
        thumbnailUrl:
          forceOverrideAll || !userEditedFields.thumbnailUrl
            ? meta.thumbnailUrl || defaultThumbnail
            : prev.thumbnailUrl,
        director:
          forceOverrideAll || !userEditedFields.director
            ? meta.author || prev.director
            : prev.director,
      }));

      if (forceOverrideAll) {
        setUserEditedFields({
          title: false,
          description: false,
          thumbnailUrl: false,
          director: false,
        });
        showNotification("Restored original YouTube details!");
      }
    } catch (e) {
      // quiet fallback
    } finally {
      setFetchingYouTube(false);
    }
  };

  const handleYouTubeUrlChange = (newUrl: string) => {
    setFormData((prev) => ({ ...prev, youtubeUrl: newUrl }));
    const videoId = extractYouTubeId(newUrl);
    if (videoId) {
      syncYouTubeDetails(newUrl, false);
    }
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
        setUserEditedFields((prev) => ({ ...prev, thumbnailUrl: true }));
        showNotification("Custom thumbnail uploaded successfully");
      }
    } catch (err) {
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.youtubeUrl?.trim()) {
      alert("Please provide a YouTube video URL or ID.");
      return;
    }

    const videoId = extractYouTubeId(formData.youtubeUrl);
    const resolvedThumbnail =
      formData.thumbnailUrl?.trim() || (videoId ? getYouTubeThumbnail(videoId) : "");
    const resolvedTitle =
      formData.title?.trim() ||
      youtubeMeta?.title ||
      (videoId ? `YouTube Video (${videoId})` : "Cinematic Feature");
    const resolvedDescription =
      formData.description?.trim() ||
      youtubeMeta?.description ||
      `Official video presentation from ${formData.director || "One Roof Studios"}.`;

    const finalPayload = {
      ...formData,
      title: resolvedTitle,
      description: resolvedDescription,
      thumbnailUrl: resolvedThumbnail,
    };

    try {
      const isEditing = !!editingMovie;
      const url = isEditing ? `/api/admin/movies/${editingMovie.id}` : "/api/admin/movies";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      const json = await res.json();
      if (json.success) {
        showNotification(isEditing ? "Movie updated successfully" : "New movie added successfully");
        setModalOpen(false);
        fetchMovies();
      } else {
        alert(json.error || "Failed to save movie");
      }
    } catch (err) {
      alert("Network error saving movie");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/movies/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        showNotification(`Movie "${title}" removed`);
        setMovies((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert(json.error || "Failed to delete movie from database");
      }
    } catch (err: any) {
      alert("Failed to delete movie: " + (err?.message || "Network error"));
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

      {/* Database Connection Warning */}
      {isDbConnected === false && (
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs flex items-start sm:items-center space-x-3">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <div className="space-y-1">
            <div className="font-bold uppercase tracking-wider text-amber-200">
              Supabase Database Not Configured in Production
            </div>
            <p className="text-zinc-300 leading-relaxed text-[11px]">
              The app is currently falling back to temporary in-memory storage because production environment variables
              (<code className="bg-black/40 px-1 py-0.5 rounded text-amber-300 font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300 font-mono">SUPABASE_SERVICE_ROLE_KEY</code>) are missing.
              To ensure uploaded movies persist permanently across page refreshes and server restarts, set these variables in your Vercel/hosting dashboard.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#e11d48] mb-1">
            <Film className="w-3.5 h-3.5" />
            <span>Content Management</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl uppercase tracking-wider text-[var(--foreground)]">
            Movies &amp; Cinema Manager
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Publish feature-length concert films, trailers, documentaries, and embed YouTube videos
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          id="admin-add-movie-btn"
          className="px-5 py-2.5 rounded-full bg-[#e11d48] hover:bg-[#D81A26] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e11d48]/20 transition-all flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Movie</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-between border-b border-[var(--subtle-border)] pb-4">
        <div className="text-xs text-zinc-400 font-medium">
          Total: <span className="font-bold text-[var(--foreground)]">{movies.length}</span> cinematic productions
        </div>
      </div>

      {/* Movies Table / Grid */}
      {loading ? (
        <div className="py-20 text-center text-zinc-400 text-sm">Loading movies catalog...</div>
      ) : movies.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[var(--subtle-border)] rounded-2xl p-8">
          <Film className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
          <p className="text-sm font-semibold text-[var(--foreground)]">No movies cataloged</p>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            Click &quot;Add New Movie&quot; to publish your first cinema release or documentary trailer.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--subtle-border)] bg-[var(--card)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--subtle-border)] text-zinc-400">
                  <th className="py-4 pl-6 pr-3 font-semibold uppercase tracking-wider w-16">Preview</th>
                  <th className="py-4 px-4 font-semibold uppercase tracking-wider">Title &amp; Synopsis</th>
                  <th className="py-4 px-4 font-semibold uppercase tracking-wider hidden sm:table-cell">
                    Genre / Details
                  </th>
                  <th className="py-4 px-4 font-semibold uppercase tracking-wider hidden md:table-cell">
                    YouTube URL
                  </th>
                  <th className="py-4 pr-6 pl-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--subtle-border)]">
                {movies.map((movie) => (
                  <tr
                    key={movie.id}
                    className={`transition-colors ${
                      isDark ? "hover:bg-white/[0.02]" : "hover:bg-black/[0.01]"
                    }`}
                  >
                    {/* Thumbnail */}
                    <td className="py-4 pl-6 pr-3 whitespace-nowrap">
                      <div className="relative w-16 aspect-[16/9] rounded-lg overflow-hidden bg-black border border-[var(--subtle-border)] shrink-0">
                        <img
                          src={movie.thumbnailUrl || (movie.youtubeUrl ? getYouTubeThumbnail(movie.youtubeUrl) : "")}
                          alt={movie.title}
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (movie.youtubeUrl) {
                              const hq = getYouTubeThumbnail(movie.youtubeUrl, "hq");
                              if (target.src !== hq) target.src = hq;
                            }
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Title & Description */}
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-heading font-extrabold text-sm uppercase text-[var(--foreground)]">
                          {movie.title}
                        </span>
                        {movie.featured && (
                          <span className="px-2 py-0.5 rounded-full bg-[#e11d48]/10 text-[#e11d48] border border-[#e11d48]/30 text-[9px] font-bold uppercase">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 max-w-md line-clamp-2">
                        {movie.description}
                      </p>
                    </td>

                    {/* Genre & Details */}
                    <td className="py-4 px-4 hidden sm:table-cell whitespace-nowrap">
                      <div className="text-[var(--foreground)] font-medium">{movie.genre}</div>
                      <div className="text-[11px] text-zinc-400">
                        {movie.year} • {movie.duration} • Dir. {movie.director}
                      </div>
                    </td>

                    {/* YouTube URL */}
                    <td className="py-4 px-4 hidden md:table-cell max-w-xs truncate">
                      <a
                        href={movie.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-400 hover:text-[#e11d48] flex items-center space-x-1"
                      >
                        <span className="truncate">{movie.youtubeUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>

                    {/* Actions */}
                    <td className="py-4 pr-6 pl-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(movie)}
                          className="p-1.5 rounded-lg border border-[var(--subtle-border)] text-zinc-400 hover:text-[var(--foreground)] hover:border-[#e11d48] transition-colors cursor-pointer"
                          title="Edit Movie"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(movie.id, movie.title)}
                          className="p-1.5 rounded-lg border border-[var(--subtle-border)] text-zinc-400 hover:text-red-500 hover:border-red-500/40 transition-colors cursor-pointer"
                          title="Delete Movie"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Movie Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-[var(--subtle-border)] bg-[var(--card)] text-[var(--foreground)] p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--subtle-border)] mb-6">
              <div className="flex items-center space-x-2">
                <Film className="w-5 h-5 text-[#e11d48]" />
                <h3 className="font-heading font-extrabold text-xl uppercase tracking-wide">
                  {editingMovie ? "Edit Cinema Release" : "Publish New Movie"}
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
              {/* YouTube URL (Primary) */}
              <div className="space-y-2 p-4 rounded-2xl bg-zinc-500/5 border border-[var(--subtle-border)]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center space-x-1.5">
                    <YoutubeIcon className="w-4 h-4 text-red-500" />
                    <span>YouTube Video / Trailer Link *</span>
                  </label>
                  {fetchingYouTube && (
                    <span className="text-[11px] text-[#e11d48] flex items-center space-x-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Syncing YouTube data...</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    required
                    value={formData.youtubeUrl}
                    onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or youtu.be/..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#e11d48]"
                  />
                  <button
                    type="button"
                    onClick={() => syncYouTubeDetails(formData.youtubeUrl, true)}
                    disabled={fetchingYouTube || !formData.youtubeUrl}
                    className="px-3.5 py-2 rounded-xl border border-[var(--subtle-border)] bg-[var(--card)] hover:border-[#e11d48] text-xs font-semibold text-zinc-400 hover:text-[var(--foreground)] flex items-center justify-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 transition-colors"
                    title="Force re-sync original YouTube title, synopsis, and thumbnail"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${fetchingYouTube ? "animate-spin" : ""}`} />
                    <span>Re-sync from YouTube</span>
                  </button>
                </div>

                {youtubeMeta ? (
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                    <span className="truncate pr-2">
                      Linked: <strong className="text-[var(--foreground)]">{youtubeMeta.title}</strong>
                    </span>
                    <span className="text-emerald-500 shrink-0 font-medium">Original YouTube linked</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-500">
                    Paste a link to auto-fill title, description, and thumbnail from YouTube. You can also customize them below.
                  </p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Movie Title
                  </label>
                  {userEditedFields.title ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        Custom Title
                      </span>
                      {youtubeMeta?.title && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, title: youtubeMeta.title }));
                            setUserEditedFields((prev) => ({ ...prev, title: false }));
                          }}
                          className="text-[10px] text-[#e11d48] hover:underline flex items-center space-x-1 cursor-pointer"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Revert to YouTube</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>YouTube Fallback</span>
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setUserEditedFields((prev) => ({ ...prev, title: true }));
                  }}
                  placeholder={youtubeMeta?.title ? `Original: ${youtubeMeta.title}` : "e.g. Chronicles of Resonance (Leave blank to use YouTube title)"}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#e11d48]"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Synopsis / Description
                  </label>
                  {userEditedFields.description ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        Custom Description
                      </span>
                      {youtubeMeta?.description && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, description: youtubeMeta.description }));
                            setUserEditedFields((prev) => ({ ...prev, description: false }));
                          }}
                          className="text-[10px] text-[#e11d48] hover:underline flex items-center space-x-1 cursor-pointer"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Revert to YouTube</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>YouTube Fallback</span>
                    </span>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    setUserEditedFields((prev) => ({ ...prev, description: true }));
                  }}
                  placeholder={youtubeMeta?.description || "Leave blank to use YouTube description..."}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#e11d48]"
                />
              </div>

              {/* Thumbnail Image */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Thumbnail Image
                  </label>
                  {userEditedFields.thumbnailUrl ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        Custom Thumbnail
                      </span>
                      {youtubeMeta?.thumbnailUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, thumbnailUrl: youtubeMeta.thumbnailUrl }));
                            setUserEditedFields((prev) => ({ ...prev, thumbnailUrl: false }));
                          }}
                          className="text-[10px] text-[#e11d48] hover:underline flex items-center space-x-1 cursor-pointer"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Revert to YouTube</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>YouTube Fallback</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={formData.thumbnailUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, thumbnailUrl: e.target.value });
                      setUserEditedFields((prev) => ({ ...prev, thumbnailUrl: true }));
                    }}
                    placeholder="https://... or auto-fetched from YouTube"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#e11d48]"
                  />
                  <label className="px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--card)] hover:border-[#e11d48] text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#e11d48]" />
                    <span>{uploadingImage ? "Uploading..." : "Upload File"}</span>
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
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="relative w-32 aspect-video rounded-lg overflow-hidden border border-[var(--subtle-border)] bg-black shrink-0">
                      <img
                        src={formData.thumbnailUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs text-zinc-400">
                      <div className="font-semibold text-[var(--foreground)]">
                        {userEditedFields.thumbnailUrl ? "Custom Thumbnail Active" : "YouTube Default Thumbnail"}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate max-w-xs mt-0.5">
                        {formData.thumbnailUrl}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Director, Year, Duration, Genre Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-zinc-400">Director / Creator</label>
                  <input
                    type="text"
                    value={formData.director}
                    onChange={(e) => {
                      setFormData({ ...formData, director: e.target.value });
                      setUserEditedFields((prev) => ({ ...prev, director: true }));
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--subtle-border)] bg-[var(--background)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[#e11d48]"
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
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-zinc-400">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--subtle-border)] bg-[var(--background)] text-xs text-[var(--foreground)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-zinc-400">Genre</label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--subtle-border)] bg-[var(--background)] text-xs text-[var(--foreground)]"
                  />
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded text-[#e11d48] focus:ring-[#e11d48] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="featured-checkbox" className="text-xs font-semibold text-[var(--foreground)] cursor-pointer">
                  Feature this movie as the Hero Premiere Spotlight
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
                  className="px-6 py-2.5 rounded-xl bg-[#e11d48] hover:bg-[#D81A26] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#e11d48]/20"
                >
                  {editingMovie ? "Save Changes" : "Create Movie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
