"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileEdit,
  Image as ImageIcon,
  Users,
  Sparkles,
  FolderOpen,
  Settings,
  Mail,
  ExternalLink,
  LogOut,
  Disc3,
  Menu,
  X,
  Bell,
} from "lucide-react";

const adminNav = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pages Editor", href: "/admin/pages", icon: FileEdit },
  { name: "Gallery Manager", href: "/admin/gallery", icon: ImageIcon },
  { name: "Documentary Team", href: "/admin/documentary", icon: Users },
  { name: "Home Extras", href: "/admin/home-extras", icon: Sparkles },
  { name: "Media Library", href: "/admin/media", icon: FolderOpen },
  { name: "Site Settings", href: "/admin/settings", icon: Settings },
  { name: "Enquiries", href: "/admin/enquiries", icon: Mail, badge: true },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // If on login route, render without sidebar
  const isLoginPage = pathname === "/admin/login";

  // Fetch unread count
  useEffect(() => {
    if (isLoginPage) return;
    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/admin/enquiries");
        const data = await res.json();
        if (data.success && data.meta) {
          setUnreadCount(data.meta.unread || 0);
        }
      } catch (err) {
        // quiet fallback
      }
    };
    fetchUnread();
  }, [isLoginPage, pathname]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#070709] text-white">{children}</div>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/me", { method: "POST" });
    } catch (e) {
      // ignore
    }
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-[#070709] text-zinc-100">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0a0b10] border-r border-white/[0.08] fixed inset-y-0 left-0 z-30">
        {/* Brand / Logo */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border border-[#D4AF37]/50 bg-[#121318] flex items-center justify-center text-[#D4AF37]">
              <Disc3 className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-sm tracking-wider text-white">
                VELVET NOIR
              </span>
              <span className="text-[9px] tracking-widest text-[#D4AF37] uppercase font-bold">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {adminNav.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                id={`admin-nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                  isActive
                    ? "bg-[#D4AF37] text-[#070709] shadow-md shadow-[#D4AF37]/20 font-bold"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && unreadCount > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-[#070709] text-[#D4AF37]"
                        : "bg-[#D4AF37] text-[#070709]"
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-white/[0.08] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>View Live Website</span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-[#0a0b10]/80 backdrop-blur-md border-b border-white/[0.08] px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg border border-white/10 text-zinc-300 hover:text-white"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold hidden sm:inline-block">
              Content Management Engine
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/admin/enquiries"
              className="relative p-2 rounded-lg border border-white/10 bg-white/[0.02] text-zinc-300 hover:text-white"
              title="Enquiries"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-[#070709] text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            <div className="flex items-center space-x-3 pl-2 border-l border-white/10">
              <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-xs font-bold text-[#D4AF37]">
                A
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-semibold text-white">Administrator</span>
                <span className="text-[10px] text-zinc-400">admin@velvetnoir.com</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col pt-16">
            <nav className="p-6 space-y-2">
              {adminNav.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold uppercase ${
                      isActive
                        ? "bg-[#D4AF37] text-[#070709]"
                        : "text-zinc-300 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}

              <div className="pt-6 border-t border-white/10 flex flex-col space-y-3">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center space-x-2 text-zinc-300 text-sm py-2"
                >
                  <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
                  <span>View Live Website</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-400 text-sm py-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
