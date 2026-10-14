"use client";

import React, { useState, useEffect } from "react";
import { TeamMember } from "@music-label/shared";
import { Plus, Trash2, Edit3, X, Check, AlertCircle, Users } from "lucide-react";

export default function AdminDocumentaryTeam() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    photoUrl: "",
  });

  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/public/team");
      const json = await res.json();
      if (json.success) {
        setTeam(json.data);
      }
    } catch (e) {
      setNotification({ type: "error", msg: "Failed to load team members" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const showNotice = (type: "success" | "error", msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: "", role: "", bio: "", photoUrl: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      photoUrl: member.photoUrl,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // PUT
        const res = await fetch(`/api/admin/team/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success) {
          showNotice("success", "Team member profile updated!");
          setIsModalOpen(false);
          fetchTeam();
        } else {
          showNotice("error", json.error || "Update failed");
        }
      } else {
        // POST
        const res = await fetch("/api/admin/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success) {
          showNotice("success", "New team member added!");
          setIsModalOpen(false);
          fetchTeam();
        } else {
          showNotice("error", json.error || "Creation failed");
        }
      }
    } catch (e) {
      showNotice("error", "An error occurred");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        showNotice("success", "Profile removed.");
        setTeam(team.filter((m) => m.id !== id));
      } else {
        showNotice("error", json.error);
      }
    } catch (e) {
      showNotice("error", "Delete failed");
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
            Credits Management
          </span>
          <h1 className="font-heading font-extrabold text-3xl text-white uppercase tracking-tight">
            Documentary Team Profiles
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Manage credits, portraits, roles, and biographies for the cinema production unit.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#D4AF37] text-[#070709] font-bold text-xs uppercase tracking-wider hover:bg-[#F5D77F] transition-all shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Profile</span>
        </button>
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

      {/* Grid of Team Members */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <div
            key={member.id}
            className="rounded-2xl glass-panel p-6 border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-[#D4AF37]/30 shrink-0">
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    {member.name}
                  </h3>
                  <span className="text-xs text-[#D4AF37] font-semibold uppercase">
                    {member.role}
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                {member.bio}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end space-x-2">
              <button
                onClick={() => handleOpenEdit(member)}
                className="p-2 rounded-lg border border-white/10 text-zinc-300 hover:text-white hover:border-[#D4AF37] text-xs flex items-center space-x-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(member.id, member.name)}
                className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer"
                title="Remove Member"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD / EDIT PROFILE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl glass-panel-gold p-8 border border-[#D4AF37]/40 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-heading font-extrabold text-lg text-white uppercase tracking-wider">
                {editingId ? "Edit Profile" : "Add Team Profile"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Julian Alexander"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Cinematographer"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Short Biography
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Filmmaking background and artistic vision..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#D4AF37] text-[#070709] font-bold text-xs uppercase tracking-wider hover:bg-[#F5D77F] transition-all cursor-pointer"
              >
                {editingId ? "Save Profile Changes" : "Create Profile"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
