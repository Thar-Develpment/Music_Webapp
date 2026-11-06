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
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function AdminMoviesPage() {
  const { isDark } = useTheme();
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<MovieItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

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
    setFormData({
      title: movie.title,
      description: movie.description,
      youtubeUrl: movie.youtubeUrl,
      thumbnailUrl: movie.thumbnailUrl,
      director: movie.director,
      year: movie.year,
      duration: movie.duration,
      genre: movie.genre,
      featured: movie.featured,
      order: movie.order,
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
        showNotification("Thumbnail image uploaded successfully");
      }
    } catch (err) {
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.youtubeUrl || !formData.thumbnailUrl) {
      alert("Please fill in Title, Description, YouTube URL, and Thumbnail image.");
      return;
    }

    try {
      const isEditing = !!editingMovie;
      const url = isEditing ? `/api/admin/movies/${editingMovie.id}` : "/api/admin/movies";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      }
    } catch (err) {
      alert("Failed to delete movie");
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
                          src={movie.thumbnailUrl}
                          alt={movie.title}
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
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Movie Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. CHRONICLES OF RESONANCE"
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#e11d48]"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Synopsis / Small Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief cinematic summary or documentary synopsis..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#e11d48]"
                />
              </div>

              {/* YouTube URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  YouTube Video / Trailer URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#e11d48]"
                />
              </div>

              {/* Thumbnail Image */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Thumbnail Image (File Upload or URL) *
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="https://... or upload below"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--background)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#e11d48]"
                  />
                  <label className="px-4 py-2.5 rounded-xl border border-[var(--subtle-border)] bg-[var(--card)] hover:border-[#e11d48] text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shrink-0">
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
                  <div className="relative w-32 aspect-video rounded-lg overflow-hidden border border-[var(--subtle-border)] mt-2 bg-black">
                    <img
                      src={formData.thumbnailUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Director, Year, Duration, Genre Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-zinc-400">Director</label>
                  <input
                    type="text"
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
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
