"use client";

import React, { useState, useEffect } from "react";
import { EnquiryRecord } from "@music-label/shared";
import {
  Mail,
  MailOpen,
  Trash2,
  CheckCircle,
  Eye,
  X,
  Phone,
  Calendar,
  AlertCircle,
  Clock,
} from "lucide-react";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryRecord | null>(null);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/enquiries");
      const json = await res.json();
      if (json.success) {
        setEnquiries(json.data);
      }
    } catch (e) {
      // quiet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const toggleReadStatus = async (id: string, currentReadAt: string | null | undefined) => {
    try {
      const isCurrentlyRead = !!currentReadAt;
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isCurrentlyRead ? { markUnread: true } : { markRead: true }),
      });
      const json = await res.json();
      if (json.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, readAt: isCurrentlyRead ? null : new Date().toISOString() } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry({
            ...selectedEnquiry,
            readAt: isCurrentlyRead ? null : new Date().toISOString(),
          });
        }
      }
    } catch (e) {
      // quiet
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      }
    } catch (e) {
      // quiet
    }
  };

  const handleOpenView = (enquiry: EnquiryRecord) => {
    setSelectedEnquiry(enquiry);
    if (!enquiry.readAt) {
      toggleReadStatus(enquiry.id, null);
    }
  };

  const filtered = enquiries.filter((e) => {
    if (activeFilter === "unread") return !e.readAt;
    return true;
  });

  const unreadCount = enquiries.filter((e) => !e.readAt).length;

  return (
    <div className="flex flex-col space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
            Inbound Transmissions
          </span>
          <h1 className="font-heading font-extrabold text-3xl text-white uppercase tracking-tight">
            Client Enquiries Inbox
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Review messages received via the public contact form for booking, licensing, and press inquiries.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-[#D4AF37] text-[#070709]"
                : "bg-white/[0.04] text-zinc-400 hover:text-white"
            }`}
          >
            All Messages ({enquiries.length})
          </button>
          <button
            onClick={() => setActiveFilter("unread")}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase transition-all cursor-pointer ${
              activeFilter === "unread"
                ? "bg-[#D4AF37] text-[#070709]"
                : "bg-white/[0.04] text-zinc-400 hover:text-white"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="rounded-2xl glass-panel overflow-hidden border border-white/10">
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-zinc-400 flex flex-col items-center">
            <Mail className="w-8 h-8 text-[#D4AF37]/40 mb-3" />
            <p className="text-sm">No enquiries found in this view.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {filtered.map((enq) => {
              const isUnread = !enq.readAt;
              const formattedDate = new Date(enq.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={enq.id}
                  className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    isUnread
                      ? "bg-white/[0.03] border-l-4 border-l-[#D4AF37]"
                      : "hover:bg-white/[0.01]"
                  }`}
                >
                  <div className="flex items-start sm:items-center space-x-4 flex-1 min-w-0">
                    <button
                      onClick={() => toggleReadStatus(enq.id, enq.readAt)}
                      className="mt-1 sm:mt-0 p-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-[#D4AF37] cursor-pointer"
                      title={isUnread ? "Mark as Read" : "Mark as Unread"}
                    >
                      {isUnread ? (
                        <Mail className="w-4 h-4 text-[#D4AF37]" />
                      ) : (
                        <MailOpen className="w-4 h-4" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleOpenView(enq)}>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm ${
                            isUnread ? "font-bold text-white" : "font-medium text-zinc-300"
                          }`}
                        >
                          {enq.firstName}
                        </span>
                        <span className="text-xs text-zinc-500">• {enq.email}</span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate mt-1 font-light">
                        {enq.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-4 self-stretch sm:self-center shrink-0">
                    <span className="text-[11px] text-zinc-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#D4AF37]" />
                      <span>{formattedDate}</span>
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenView(enq)}
                        className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-xs font-semibold text-zinc-200 hover:text-white hover:border-[#D4AF37] flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => handleDelete(enq.id)}
                        className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 cursor-pointer"
                        title="Delete enquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: VIEW FULL MESSAGE */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl glass-panel-gold p-8 border border-[#D4AF37]/40 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-white">
                    {selectedEnquiry.firstName}
                  </h3>
                  <span className="text-xs text-zinc-400">{selectedEnquiry.email}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-2 text-zinc-300">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-medium text-white">{selectedEnquiry.phone}</span>
              </div>

              <div className="flex items-center space-x-2 text-zinc-400">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>{new Date(selectedEnquiry.createdAt).toLocaleString()}</span>
              </div>

              <div className="p-5 rounded-2xl bg-black/50 border border-white/10 mt-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block mb-2">
                  Message Body (180 chars max)
                </span>
                <p className="text-zinc-100 text-sm leading-relaxed font-light">
                  {selectedEnquiry.message}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=One Roof Entertainment Response`}
                  className="px-5 py-2.5 rounded-full bg-[#D4AF37] text-[#070709] font-bold text-xs uppercase tracking-wider hover:bg-[#F5D77F] transition-all cursor-pointer"
                >
                  Reply via Email
                </a>

                <button
                  onClick={() => handleDelete(selectedEnquiry.id)}
                  className="px-4 py-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
