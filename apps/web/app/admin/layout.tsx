"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Music,
  Mail,
  ExternalLink,
  LogOut,
  Disc3,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { SiteTheme } from "@music-label/shared";
import { useTheme } from "@/components/theme/ThemeProvider";
import OneRoofLogo from "@/components/ui/OneRoofLogo";

const adminNav = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Movies", href: "/admin/movies", icon: Film },
  { name: "Music Audio", href: "/admin/music", icon: Music },
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
  const [themeConfirmTarget, setThemeConfirmTarget] = useState<SiteTheme | null>(null);

  // If on login route, render without sidebar
  const isLoginPage = pathname === "/admin/login";

  // Fetch unread enquiries count
  useEffect(() => {
    if (isLoginPage) return;
    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/admin/enquiries");
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        if (data.success && data.meta) {
          setUnreadCount(data.meta.unread || 0);
        }
      } catch (err) {
        // quiet fallback
      }
    };
    fetchUnread();
  }, [isLoginPage, pathname, router]);

  const handleThemeButtonClick = (targetTheme: SiteTheme) => {
    if (targetTheme === theme) return;
    setThemeConfirmTarget(targetTheme);
  };

  const handleConfirmThemeSwitch = async () => {
    if (!themeConfirmTarget) return;
    const target = themeConfirmTarget;
    setThemeConfirmTarget(null);
    setTheme(target);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: target }),
      });
    } catch (e) {
      // quiet fallback
    }
  };

  const handleCancelThemeSwitch = () => {
    setThemeConfirmTarget(null);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/me", { method: "POST" });
    } catch (e) {
      // ignore
    }
    router.push("/admin/login");
    router.refresh();
  };

  if (isLoginPage) {
    return (
      <div className="min-h-screen transition-colors duration-300 bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-[var(--background)] text-[var(--foreground)]">
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
          <Link href="/admin" className="flex items-center">
            <OneRoofLogo size="sm" variant="horizontal" />
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
                    ? "bg-[#e11d48] text-white shadow-md shadow-[#e11d48]/20 font-bold"
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
                        ? "bg-white text-[#e11d48]"
                        : "bg-[#e11d48] text-white"
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
              <ExternalLink className="w-3.5 h-3.5 text-[#e11d48]" />
              <span>View Live Website</span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            id="admin-logout-btn"
            className="w-full flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen transition-colors duration-300 bg-[var(--background)]">
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
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-widest text-[#e11d48] font-semibold hidden sm:inline-block">
                Label Management System
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium hidden sm:inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Auth Active
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Quick Live Theme Switcher with Confirmation */}
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
                  onClick={() => handleThemeButtonClick("white")}
                  title="Switch to Alabaster White & Red theme (requires confirmation)"
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    theme === "white"
                      ? "bg-white text-[#09090B] shadow-sm font-extrabold border border-black/10"
                      : isDark
                      ? "text-zinc-400 hover:text-white"
                      : "text-zinc-500 hover:text-black"
                  }`}
                >
                  <Sun className="w-3 h-3 text-[#e11d48]" />
                  <span>White</span>
                </button>
                <button
                  type="button"
                  id="admin-header-theme-black-btn"
                  onClick={() => handleThemeButtonClick("black")}
                  title="Switch to Obsidian Black & Red theme (requires confirmation)"
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    theme === "black"
                      ? "bg-[#e11d48] text-white shadow-sm font-extrabold"
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
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#e11d48] text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            <div
              className={`flex items-center space-x-3 pl-2 border-l ${
                isDark ? "border-white/10" : "border-black/10"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-[#FEF2F2]/10 border border-[#e11d48]/40 flex items-center justify-center text-xs font-bold text-[#e11d48]">
                A
              </div>
              <div className="hidden sm:flex flex-col">
                <span
                  className={`text-xs font-semibold ${isDark ? "text-white" : "text-[#09090B]"}`}
                >
                  Administrator
                </span>
                <span className="text-[10px] text-zinc-400">admin@oneroofentertainment.com</span>
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
                        ? "bg-[#e11d48] text-white"
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
                  <ExternalLink className="w-4 h-4 text-[#e11d48]" />
                  <span>View Live Website</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-500 text-sm py-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* Theme Change Confirmation Modal */}
        {themeConfirmTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
            <div
              className={`max-w-md w-full rounded-2xl p-6 sm:p-7 border shadow-2xl transition-all ${
                isDark
                  ? "bg-[#121217] border-white/15 text-white"
                  : "bg-white border-black/10 text-[#09090B]"
              }`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#e11d48]/10 border border-[#e11d48]/30 flex items-center justify-center text-[#e11d48] shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg tracking-wide">
                    Confirm Theme Change
                  </h3>
                  <p className="text-xs text-zinc-400">Accidental change prevention</p>
                </div>
              </div>

              <p
                className={`text-sm leading-relaxed mb-6 ${
                  isDark ? "text-zinc-300" : "text-zinc-600"
                }`}
              >
                Are you sure you want to change the active theme to{" "}
                <span className="font-bold text-[#e11d48] uppercase">
                  {themeConfirmTarget === "black"
                    ? "Obsidian Black & Red"
                    : "Alabaster White & Red"}
                </span>
                ? This will instantly switch the visual appearance across both the public website
                and admin console.
              </p>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-black/[0.06] dark:border-white/10">
                <button
                  type="button"
                  onClick={handleCancelThemeSwitch}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                    isDark
                      ? "text-zinc-400 hover:text-white hover:bg-white/5"
                      : "text-zinc-600 hover:text-black hover:bg-black/5"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="confirm-theme-change-btn"
                  onClick={handleConfirmThemeSwitch}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase bg-[#e11d48] hover:bg-[#D81A26] text-white shadow-lg shadow-[#e11d48]/30 transition-all cursor-pointer"
                >
                  Confirm & Switch
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
