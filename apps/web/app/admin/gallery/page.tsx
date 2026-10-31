"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GalleryCategory, GalleryItem } from "@music-label/shared";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Link as LinkIcon,
  X,
  Play,
  Image as ImageIcon,
  Check,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function AdminGalleryManager() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("url");
  const [newTitle, setNewTitle] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newKind, setNewKind] = useState<"image" | "video">("image");
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Category Add State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const fetchGalleryData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/public/gallery");
      const json = await res.json();
      if (json.success) {
        setCategories(json.data.categories);
        setItems(json.data.items);
        if (json.data.categories.length > 0 && !newCategoryId) {
          setNewCategoryId(json.data.categories[0].id);
        }
      }
    } catch (e) {
      setNotification({ type: "error", msg: "Failed to load gallery items" });
    } finally {
      setLoading(false);
    }
  }, [newCategoryId]);

  useEffect(() => {
    fetchGalleryData();
  }, [fetchGalleryData]);

  const showNotice = (type: "success" | "error", msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showNotice("error", "File exceeds 10MB limit.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);
    setNewUrl(objectUrl);
    if (!newTitle) {
      setNewTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
    if (!newAlt) {
      setNewAlt(file.name);
    }
  };

  // Submit New Gallery Item
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) {
      showNotice("error", "Please provide a valid image or video URL/file.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        categoryId: newCategoryId || categories[0]?.id || "cat-all",
        title: newTitle,
        media: {
          id: `med-${Date.now()}`,
          kind: newKind,
          source: uploadMode === "file" ? "upload" : "url",
          url: newUrl,
          title: newTitle,
          alt: newAlt || newTitle,
        },
      };

      const res = await fetch("/api/admin/gallery/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to create item");
      }

      showNotice("success", "Item added to gallery successfully!");
      setIsAddModalOpen(false);
      resetItemForm();
      fetchGalleryData();
    } catch (err: unknown) {
      showNotice("error", err instanceof Error ? err.message : "Error adding item");
    } finally {
      setSaving(false);
    }
  };

  const resetItemForm = () => {
    setNewTitle("");
    setNewAlt("");
    setNewUrl("");
    setFilePreview(null);
    setUploadMode("url");
  };

  // Delete item
  const handleDeleteItem = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/gallery/items/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        showNotice("success", "Item removed.");
        setItems(items.filter((i) => i.id !== id));
      } else {
        showNotice("error", json.error || "Delete failed");
      }
    } catch (e) {
      showNotice("error", "Delete failed");
    }
  };

  // Reordering items
  const moveItem = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setItems(updated);

    try {
      const orderedIds = updated.map((i) => i.id);
      await fetch("/api/admin/gallery/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      showNotice("success", "Order saved.");
    } catch (e) {
      showNotice("error", "Failed to persist new order");
    }
  };

  // Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;

    try {
      const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const res = await fetch("/api/admin/gallery/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName, slug }),
      });
      const json = await res.json();
      if (json.success) {
        showNotice("success", `Category "${newCategoryName}" created!`);
        setIsCategoryModalOpen(false);
        setNewCategoryName("");
        fetchGalleryData();
      } else {
        showNotice("error", json.error || "Failed to create category");
      }
    } catch (e) {
      showNotice("error", "Failed to create category");
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/gallery/categories/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        showNotice("success", "Category deleted.");
        fetchGalleryData();
      } else {
        showNotice("error", json.error);
      }
    } catch (e) {
      showNotice("error", "Failed to delete category");
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
            Media Management
          </span>
          <h1 className="font-heading font-extrabold text-3xl text-white uppercase tracking-tight">
            Gallery & Collections Manager
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Upload concert photography, register video links, reorder items, and manage category tabs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full border border-white/20 bg-white/[0.04] text-xs uppercase tracking-wider text-white hover:border-[#D4AF37] transition-all cursor-pointer"
          >
            <span>Manage Categories</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            id="admin-add-gallery-item-btn"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#D4AF37] text-[#070709] font-bold text-xs uppercase tracking-wider hover:bg-[#F5D77F] transition-all shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Media Item</span>
          </button>
        </div>
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

      {/* Categories Bar */}
      <div className="p-4 rounded-2xl glass-panel flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-2">
          Active Categories:
        </span>
        {categories.map((c) => {
          const itemCount = items.filter((i) => i.categoryId === c.id).length;
          return (
            <div
              key={c.id}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white"
            >
              <span>{c.name}</span>
              <span className="text-[10px] text-[#D4AF37] font-bold">({itemCount})</span>
              {c.slug !== "all" && (
                <button
                  onClick={() => handleDeleteCategory(c.id, c.name)}
                  className="hover:text-red-400 transition-colors ml-1"
                  title="Delete category"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Gallery Items Table */}
      <div className="rounded-2xl glass-panel overflow-hidden border border-white/10">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
            All Gallery Items ({items.length})
          </h2>
          <span className="text-xs text-zinc-400 font-light">
            Use arrows to reorder display sequence
          </span>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {items.map((item, index) => {
            const cat = categories.find((c) => c.id === item.categoryId);
            return (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-black/60 border border-white/10 shrink-0 relative">
                    <img
                      src={item.media.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.media.kind === "video" && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[#D4AF37]">
                        <Play className="w-3 h-3 fill-current" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-heading font-semibold text-sm text-white">
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-[11px] text-[#D4AF37] font-medium uppercase">
                        {cat?.name || "General"}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        {item.media.kind === "video" ? "Video Link" : "Image"} • Order #{index + 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: Reorder & Delete */}
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={() => moveItem(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-[#D4AF37] disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(index, "down")}
                    disabled={index === items.length - 1}
                    className="p-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-[#D4AF37] disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id, item.title)}
                    className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer ml-2"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: ADD GALLERY ITEM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl glass-panel-gold p-8 border border-[#D4AF37]/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-heading font-extrabold text-xl text-white uppercase tracking-wider">
                Add Gallery Media
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetItemForm();
                }}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-5">
              {/* Mode Toggle: File Upload vs Add by URL */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-black/60 border border-white/10">
                <button
                  type="button"
                  onClick={() => setUploadMode("url")}
                  className={`py-2 rounded-lg text-xs font-semibold uppercase flex items-center justify-center space-x-2 transition-all ${
                    uploadMode === "url"
                      ? "bg-[#D4AF37] text-[#070709]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Add by URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("file")}
                  className={`py-2 rounded-lg text-xs font-semibold uppercase flex items-center justify-center space-x-2 transition-all ${
                    uploadMode === "file"
                      ? "bg-[#D4AF37] text-[#070709]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Item Title <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Abbey Road Tracking Session"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Alt Text (Accessibility) <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newAlt}
                  onChange={(e) => setNewAlt(e.target.value)}
                  placeholder="Describe image for screen readers"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Gallery Category <span className="text-[#D4AF37]">*</span>
                </label>
                <select
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#070709] text-white">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* URL or Upload Input */}
              {uploadMode === "url" ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Media URL <span className="text-[#D4AF37]">*</span>
                    </label>
                    <div className="flex items-center space-x-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setNewKind("image")}
                        className={`px-2 py-0.5 rounded ${
                          newKind === "image"
                            ? "bg-[#D4AF37] text-black font-bold"
                            : "text-zinc-400"
                        }`}
                      >
                        Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewKind("video")}
                        className={`px-2 py-0.5 rounded ${
                          newKind === "video"
                            ? "bg-[#D4AF37] text-black font-bold"
                            : "text-zinc-400"
                        }`}
                      >
                        Video
                      </button>
                    </div>
                  </div>
                  <input
                    type="url"
                    required
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or https://youtube.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                    Select File (JPG, PNG, WebP — Max 10MB)
                  </label>
                  <label className="border-2 border-dashed border-white/20 hover:border-[#D4AF37] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-black/30 transition-colors">
                    <Upload className="w-8 h-8 text-[#D4AF37] mb-2" />
                    <span className="text-xs text-zinc-300">
                      Click to choose or drag an image file
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Preview */}
              {(filePreview || (uploadMode === "url" && newUrl)) && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/20 bg-black">
                  <img
                    src={filePreview || newUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-zinc-300 uppercase">
                    Live Preview
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 rounded-xl bg-[#D4AF37] text-[#070709] font-bold text-xs uppercase tracking-wider hover:bg-[#F5D77F] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>{saving ? "Saving Item..." : "Publish to Gallery"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CATEGORY */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl glass-panel-gold p-6 border border-[#D4AF37]/40 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-heading font-bold text-base text-white uppercase">
                New Category
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Festival Headliners"
                  className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#D4AF37] text-[#070709] font-bold text-xs uppercase tracking-wider hover:bg-[#F5D77F] transition-all cursor-pointer"
              >
                Create Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
