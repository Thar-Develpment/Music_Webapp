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
  { name: "About", href: "/about" },
  { name: "Gallery", href: "/gallery" },
  { name: "Documentary", href: "/documentary" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar({
  siteName = "VELVET NOIR",
  socialLinks = {
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    facebook: "https://facebook.com",
    spotify: "https://spotify.com",
  },
}: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#070709]/85 backdrop-blur-xl border-b border-white/[0.08] py-4 shadow-2xl shadow-black/60"
            : "bg-gradient-to-b from-black/80 via-black/30 to-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="group flex items-center space-x-3 text-white transition-opacity hover:opacity-90"
            id="brand-logo"
          >
            <div className="w-10 h-10 rounded-full border border-[#D4AF37]/40 bg-[#121318] flex items-center justify-center text-[#D4AF37] group-hover:scale-105 group-hover:border-[#D4AF37] transition-all duration-300 shadow-lg shadow-[#D4AF37]/10">
              <Disc3 className="w-5 h-5 animate-[spin_10s_linear_infinite]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl tracking-[0.18em] text-white">
                {siteName}
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase font-medium">
                Recordings & Film
              </span>
            </div>
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
                  className={`relative px-4 py-2 text-sm font-medium tracking-wider uppercase transition-all duration-300 rounded-full ${
                    isActive
                      ? "text-[#D4AF37] bg-white/[0.04]"
                      : "text-zinc-300 hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-1 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions: Socials & Admin */}
          <div className="hidden lg:flex items-center space-x-5">
            <div className="flex items-center space-x-3 border-r border-white/10 pr-5">
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-zinc-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all duration-200"
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
                  className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-zinc-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all duration-200"
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
                  className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-zinc-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all duration-200"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Admin Portal Quick Link */}
            <Link
              href="/admin"
              id="admin-portal-button"
              className="group flex items-center space-x-2 text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#F5D77F] hover:bg-[#D4AF37] hover:text-[#070709] transition-all duration-300 shadow-md shadow-[#D4AF37]/5"
            >
              <Lock className="w-3.5 h-3.5 text-[#D4AF37] group-hover:text-[#070709]" />
              <span>Admin Panel</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-zinc-200 hover:text-white"
            aria-label="Toggle Navigation Menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#070709]/98 backdrop-blur-2xl flex flex-col pt-28 px-8 pb-12 md:hidden"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-heading text-2xl tracking-wider uppercase transition-colors ${
                      isActive ? "text-[#D4AF37] font-bold" : "text-zinc-300 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto pt-8 border-t border-white/10 flex flex-col space-y-6">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 text-sm font-semibold tracking-wider uppercase py-3 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[#F5D77F]"
              >
                <Lock className="w-4 h-4 text-[#D4AF37]" />
                <span>Client Admin Panel</span>
              </Link>

              <div className="flex items-center justify-center space-x-6">
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-[#D4AF37]"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="w-6 h-6" />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-[#D4AF37]"
                    aria-label="YouTube"
                  >
                    <YoutubeIcon className="w-6 h-6" />
                  </a>
                )}
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-[#D4AF37]"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
