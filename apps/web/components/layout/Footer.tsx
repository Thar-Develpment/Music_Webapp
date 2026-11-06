"use client";

import React from "react";
import Link from "next/link";
import {
  Disc3,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { InstagramIcon, YoutubeIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { Setting } from "@music-label/shared";
import { useTheme } from "@/components/theme/ThemeProvider";
import OneRoofLogo from "@/components/ui/OneRoofLogo";

interface FooterProps {
  settings: Setting;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = 2026;
  const { isDark } = useTheme();

  return (
    <footer className={`relative border-t pt-20 pb-12 overflow-hidden transition-colors duration-300 ${
      isDark ? "bg-[#060608] border-white/[0.08] text-zinc-400" : "bg-[#F8F8FA] border-black/[0.08] text-zinc-600"
    }`}>
      {/* Background subtle multi-color spectrum ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-36 bg-gradient-to-r from-[#2563EB]/10 via-[#7C3AED]/10 via-[#E11D48]/15 via-[#EA580C]/10 to-[#FACC15]/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b ${
          isDark ? "border-white/[0.08]" : "border-black/[0.08]"
        }`}>
          {/* Col 1: Brand & Statement (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <Link href="/" className="inline-flex items-center">
              <OneRoofLogo size="lg" variant="horizontal" />
            </Link>

            <p className={`text-sm leading-relaxed max-w-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              {settings.footerText}
            </p>

            <div className="flex items-center space-x-3 pt-2">
              {settings.socialLinks.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    isDark
                      ? "border-white/10 bg-white/[0.04] text-zinc-300 hover:text-[#e11d48] hover:border-[#e11d48]/40"
                      : "border-black/[0.08] bg-black/[0.02] text-zinc-600 hover:text-[#e11d48] hover:border-[#e11d48]/40"
                  }`}
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    isDark
                      ? "border-white/10 bg-white/[0.04] text-zinc-300 hover:text-[#e11d48] hover:border-[#e11d48]/40"
                      : "border-black/[0.08] bg-black/[0.02] text-zinc-600 hover:text-[#e11d48] hover:border-[#e11d48]/40"
                  }`}
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${
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
          </div>

          {/* Col 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <h4 className="font-heading text-sm font-semibold tracking-[0.15em] text-[#e11d48] uppercase">
              Navigation
            </h4>
            <ul className="flex flex-col space-y-2.5 text-sm">
              <li>
                <Link href="/" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/movies" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>
                  Cinema & Feature Films
                </Link>
              </li>
              <li>
                <Link href="/music" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>
                  Music & Audio Player
                </Link>
              </li>
              <li>
                <Link href="/gallery" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>
                  Album Archive & Stills
                </Link>
              </li>
              <li>
                <Link href="/about" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>
                  About the Label
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>
                  Press & Licensing Enquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Headquarters (4 cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <h4 className="font-heading text-sm font-semibold tracking-[0.15em] text-[#e11d48] uppercase">
              Headquarters
            </h4>
            <ul className="flex flex-col space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#e11d48] shrink-0 mt-0.5" />
                <span>{settings.address || "180 The Strand, Temple, London WC2R 1EA"}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#e11d48] shrink-0" />
                <span>{settings.bookingPhone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#e11d48] shrink-0" />
                <span>{settings.bookingEmail}</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-zinc-500 hover:text-[#e11d48] transition-colors"
              >
                <span>Client CMS Portal</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 space-y-4 sm:space-y-0">
          <p>© {currentYear} {settings.siteName}. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Spatial Audio 9.1.6</span>
            <span>45 RPM Audiophile Press</span>
            <span>Dolby Vision Master</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
