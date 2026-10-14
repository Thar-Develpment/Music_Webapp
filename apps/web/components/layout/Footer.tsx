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

interface FooterProps {
  settings: Setting;
}

export default function Footer({ settings }: FooterProps) {
  const [currentYear, setCurrentYear] = React.useState(2026);

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative bg-[#050507] border-t border-white/[0.08] text-zinc-400 pt-20 pb-12 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-32 bg-[#D4AF37]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/[0.08]">
          {/* Col 1: Brand & Statement (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <Link href="/" className="flex items-center space-x-3 text-white">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37]/40 bg-[#121318] flex items-center justify-center text-[#D4AF37]">
                <Disc3 className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-2xl tracking-[0.16em] text-white">
                  {settings.siteName}
                </span>
                <span className="text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase font-medium">
                  Recordings & Film
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-zinc-400 max-w-sm">
              {settings.footerText}
            </p>

            <div className="flex items-center space-x-3 pt-2">
              {settings.socialLinks.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-zinc-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all duration-200"
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
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-zinc-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all duration-200"
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
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-zinc-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all duration-200"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <h4 className="font-heading text-sm font-semibold tracking-[0.15em] text-[#D4AF37] uppercase">
              Navigation
            </h4>
            <ul className="flex flex-col space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About the Label
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Photo & Video Gallery
                </Link>
              </li>
              <li>
                <Link href="/documentary" className="hover:text-white transition-colors">
                  Documentary Production Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Enquiries
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-amber-300/80 hover:text-[#D4AF37] flex items-center space-x-1 pt-1"
                >
                  <span>Admin Management</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Bookings & Contact Info (4 cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <h4 className="font-heading text-sm font-semibold tracking-[0.15em] text-[#D4AF37] uppercase">
              Bookings & Management
            </h4>
            <div className="flex flex-col space-y-3 text-sm">
              <a
                href={`mailto:${settings.bookingEmail}`}
                className="group flex items-center space-x-3 text-zinc-300 hover:text-[#D4AF37] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center text-[#D4AF37]">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{settings.bookingEmail}</span>
              </a>

              <a
                href={`tel:${settings.bookingPhone}`}
                className="group flex items-center space-x-3 text-zinc-300 hover:text-[#D4AF37] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center text-[#D4AF37]">
                  <Phone className="w-4 h-4" />
                </div>
                <span>{settings.bookingPhone}</span>
              </a>

              {settings.address && (
                <div className="flex items-start space-x-3 text-zinc-400">
                  <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>{settings.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 space-y-4 sm:space-y-0">
          <p>
            © {currentYear} {settings.siteName} Recordings Inc. All rights reserved.
          </p>
          <p className="flex items-center space-x-1 text-zinc-500">
            <span>Designed for High-Fidelity Sonic & Visual Artistry</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
