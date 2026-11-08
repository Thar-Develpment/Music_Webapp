"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Disc3,
  Lock,
  ArrowUpRight,
} from "lucide-react";
import { InstagramIcon, YoutubeIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/components/theme/ThemeProvider";
import OneRoofLogo from "@/components/ui/OneRoofLogo";

interface NavbarProps {
  siteName?: string;
  tagline?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
    spotify?: string;
  };
}

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Movies", href: "/movies" },
  { name: "Music", href: "/music" },
  // { name: "Album", href: "/gallery" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar({
  siteName = "ONE ROOF",
  socialLinks = {
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    facebook: "https://facebook.com",
    spotify: "https://spotify.com",
  },
}: NavbarProps) {
  const pathname = usePathname();
  const { isDark } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? isDark
              ? "bg-[#08080A]/90 backdrop-blur-xl border-b border-white/[0.08] py-4 shadow-md shadow-black/40"
              : "bg-white/90 backdrop-blur-xl border-b border-black/[0.08] py-4 shadow-md shadow-black/[0.03]"
            : isDark
            ? "bg-gradient-to-b from-[#08080A]/95 via-[#08080A]/80 to-transparent py-6"
            : "bg-gradient-to-b from-white/95 via-white/80 to-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="group flex items-center transition-opacity hover:opacity-95"
            id="brand-logo"
          >
            <OneRoofLogo size="md" variant="horizontal" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  id={`nav-link-${link.name.toLowerCase()}`}
                  className={`relative px-2.5 xl:px-4 py-2 text-xs xl:text-sm font-bold tracking-wider uppercase transition-all duration-200 rounded-full ${
                    isActive
                      ? isDark
                        ? "text-[#e11d48] bg-rose-950/40"
                        : "text-[#e11d48] bg-rose-50"
                      : isDark
                      ? "text-zinc-300 hover:text-white hover:bg-white/[0.06]"
                      : "text-zinc-600 hover:text-black hover:bg-black/[0.04]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-1 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-[#2563EB] via-[#7C3AED] via-[#E11D48] via-[#EA580C] to-[#FACC15]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions: Socials & Admin */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className={`flex items-center space-x-2.5 border-r pr-4 ${
              isDark ? "border-white/10" : "border-black/[0.08]"
            }`}>
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    isDark
                      ? "border-white/10 bg-white/[0.04] text-zinc-300 hover:text-[#e11d48] hover:border-[#e11d48]/40"
                      : "border-black/[0.08] bg-black/[0.02] text-zinc-600 hover:text-[#e11d48] hover:border-[#e11d48]/40"
                  }`}
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    isDark
                      ? "border-white/10 bg-white/[0.04] text-zinc-300 hover:text-[#e11d48] hover:border-[#e11d48]/40"
                      : "border-black/[0.08] bg-black/[0.02] text-zinc-600 hover:text-[#e11d48] hover:border-[#e11d48]/40"
                  }`}
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              )}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    isDark
                      ? "border-white/10 bg-white/[0.04] text-zinc-300 hover:text-[#e11d48] hover:border-[#e11d48]/40"
                      : "border-black/[0.08] bg-black/[0.02] text-zinc-600 hover:text-[#e11d48] hover:border-[#e11d48]/40"
                  }`}
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              )}
            </div>


            <Link
              href="/admin"
              id="admin-portal-button"
              className="group flex items-center space-x-2 text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-full bg-[#e11d48] text-white hover:bg-[#D81A26] transition-all duration-200 shadow-md shadow-[#e11d48]/20"
            >
              <Lock className="w-3.5 h-3.5 text-white" />
              <span>Admin Panel</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* Mobile Right Controls: Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`w-11 h-11 rounded-full border flex items-center justify-center ${
                isDark
                  ? "border-white/10 bg-white/[0.04] text-zinc-100 hover:text-white"
                  : "border-black/[0.08] bg-black/[0.02] text-zinc-800 hover:text-black"
              }`}
              aria-label="Toggle Navigation Menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className={`fixed inset-x-0 top-[73px] z-40 backdrop-blur-2xl border-b p-6 shadow-2xl md:hidden ${
              isDark
                ? "bg-[#0c0c10]/95 border-white/10 text-white"
                : "bg-white/95 border-black/[0.08] text-black"
            }`}
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-base font-bold tracking-wider uppercase transition-colors ${
                      isActive
                        ? isDark
                          ? "bg-red-950/40 text-[#e11d48]"
                          : "bg-red-50 text-[#e11d48]"
                        : isDark
                        ? "text-zinc-200 hover:bg-white/[0.06]"
                        : "text-zinc-800 hover:bg-black/[0.04]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className={`pt-4 border-t flex items-center justify-between ${
                isDark ? "border-white/10" : "border-black/[0.08]"
              }`}>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#e11d48]"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Access CMS</span>
                </Link>

                <div className={`flex items-center space-x-3 ${isDark ? "text-zinc-600" : "text-zinc-600"}`}>
                  {socialLinks.instagram && (
                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.youtube && (
                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                      <YoutubeIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
