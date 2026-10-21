"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileEdit,
  Image as ImageIcon,
  Users,
  LayoutGrid,
  FolderOpen,
  Settings,
  Mail,
  ExternalLink,
  LogOut,
  Disc3,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  Check,
} from "lucide-react";
import { SiteTheme } from "@music-label/shared";
import { useTheme } from "@/components/theme/ThemeProvider";

const adminNav = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pages Editor", href: "/admin/pages", icon: FileEdit },
  { name: "Gallery Manager", href: "/admin/gallery", icon: ImageIcon },
  { name: "Documentary Team", href: "/admin/documentary", icon: Users },
  { name: "Home Extras", href: "/admin/home-extras", icon: LayoutGrid },
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
  const { theme, isDark, setTheme } = useTheme();
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

  const handleSwitchTheme = async (newTheme: SiteTheme) => {
    if (newTheme === theme) return;
    setTheme(newTheme);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: newTheme }),
      });
    } catch (e) {}
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/me", { method: "POST" });
    } catch (e) {
      // ignore
    }
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDark ? "bg-[#08080A] text-[#F4F4F6]" : "bg-[#FAFAFC] text-[#09090B]"
        }`}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex transition-colors duration-300 ${
        isDark ? "bg-[#08080A] text-[#F4F4F6]" : "bg-[#FAFAFC] text-[#09090B]"
      }`}
    >
      {/* Sidebar for Desktop */}
      <aside
        className={`hidden lg:flex flex-col w-64 border-r fixed inset-y-0 left-0 z-30 transition-colors duration-300 ${
          isDark ? "bg-[#121217] border-white/10" : "bg-white border-black/[0.08]"
        }`}
      >
        {/* Brand / Logo */}
        <div
          className={`p-6 border-b flex items-center justify-between transition-colors ${
            isDark ? "border-white/10" : "border-black/[0.08]"
          }`}
        >
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border border-[#E51E2B]/30 bg-[#FEF2F2]/10 flex items-center justify-center text-[#E51E2B]">
              <Disc3 className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-heading font-extrabold text-sm tracking-wider ${
                  isDark ? "text-white" : "text-[#09090B]"
                }`}
              >
                VELVET NOIR
              </span>
              <span className="text-[9px] tracking-widest text-[#E51E2B] uppercase font-bold">
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
                    ? "bg-[#E51E2B] text-white shadow-md shadow-[#E51E2B]/20 font-bold"
                    : isDark
                    ? "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                    : "text-zinc-600 hover:text-black hover:bg-black/[0.04]"
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
                        ? "bg-white text-[#E51E2B]"
                        : "bg-[#E51E2B] text-white"
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
        <div
          className={`p-4 border-t space-y-2 transition-colors ${
            isDark ? "border-white/10" : "border-black/[0.08]"
          }`}
        >
          <Link
            href="/"
            target="_blank"
            className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-colors ${
              isDark
                ? "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                : "text-zinc-500 hover:text-[#09090B] hover:bg-black/[0.04]"
            }`}
          >
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#E51E2B]" />
              <span>View Live Website</span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 lg:pl-64 flex flex-col min-h-screen transition-colors duration-300 ${
          isDark ? "bg-[#08080A]" : "bg-[#FAFAFC]"
        }`}
      >
        {/* Top Navbar */}
        <header
          className={`h-16 backdrop-blur-md border-b px-6 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300 ${
            isDark ? "bg-[#121217]/90 border-white/10" : "bg-white/80 border-black/[0.08]"
          }`}
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className={`lg:hidden p-2 rounded-lg border ${
                isDark
                  ? "border-white/10 text-zinc-300 hover:text-white"
                  : "border-black/10 text-zinc-700 hover:text-black"
              }`}
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-xs uppercase tracking-widest text-[#E51E2B] font-semibold hidden sm:inline-block">
              Content Management Engine
            </span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Quick Live Theme Switcher */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider hidden md:inline">
                Theme:
              </span>
              <div
                className={`flex items-center p-1 rounded-full border shadow-inner transition-colors ${
                  isDark ? "bg-[#1a1a24] border-white/10" : "bg-zinc-100 border-black/10"
                }`}
              >
                <button
                  type="button"
                  id="admin-header-theme-white-btn"
                  onClick={() => handleSwitchTheme("white")}
                  title="Switch to Alabaster White & Red theme"
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    theme === "white"
                      ? "bg-white text-[#09090B] shadow-sm font-extrabold border border-black/10"
                      : isDark
                      ? "text-zinc-400 hover:text-white"
                      : "text-zinc-500 hover:text-black"
                  }`}
                >
                  <Sun className="w-3 h-3 text-[#E51E2B]" />
                  <span>White</span>
                </button>
                <button
                  type="button"
                  id="admin-header-theme-black-btn"
                  onClick={() => handleSwitchTheme("black")}
                  title="Switch to Obsidian Black & Red theme"
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    theme === "black"
                      ? "bg-[#E51E2B] text-white shadow-sm font-extrabold"
                      : isDark
                      ? "text-zinc-400 hover:text-white"
                      : "text-zinc-500 hover:text-black"
                  }`}
                >
                  <Moon className="w-3 h-3 text-white" />
                  <span>Black</span>
                </button>
              </div>
            </div>

            <Link
              href="/admin/enquiries"
              className={`relative p-2 rounded-lg border transition-colors ${
                isDark
                  ? "border-white/10 bg-[#181820] text-zinc-300 hover:text-white"
                  : "border-black/10 bg-white text-zinc-600 hover:text-black"
              }`}
              title="Enquiries"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E51E2B] text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            <div
              className={`flex items-center space-x-3 pl-2 border-l ${
                isDark ? "border-white/10" : "border-black/10"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-[#FEF2F2]/10 border border-[#E51E2B]/40 flex items-center justify-center text-xs font-bold text-[#E51E2B]">
                A
              </div>
              <div className="hidden sm:flex flex-col">
                <span
                  className={`text-xs font-semibold ${isDark ? "text-white" : "text-[#09090B]"}`}
                >
                  Administrator
                </span>
                <span className="text-[10px] text-zinc-400">admin@velvetnoir.com</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-md flex flex-col pt-16">
            <nav
              className={`p-6 space-y-2 m-4 rounded-2xl shadow-xl transition-colors ${
                isDark ? "bg-[#121217] text-white border border-white/10" : "bg-white"
              }`}
            >
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
                        ? "bg-[#E51E2B] text-white"
                        : isDark
                        ? "text-zinc-400 hover:bg-white/[0.06]"
                        : "text-zinc-600 hover:bg-black/5"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}

              <div
                className={`pt-6 border-t flex flex-col space-y-3 ${
                  isDark ? "border-white/10" : "border-black/10"
                }`}
              >
                <Link
                  href="/"
                  target="_blank"
                  className={`flex items-center space-x-2 text-sm py-2 ${
                    isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-black"
                  }`}
                >
                  <ExternalLink className="w-4 h-4 text-[#E51E2B]" />
                  <span>View Live Website</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-500 text-sm py-2"
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
