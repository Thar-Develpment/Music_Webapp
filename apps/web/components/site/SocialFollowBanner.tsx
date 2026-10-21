"use client";

import React from "react";
import { ArrowUpRight, Radio } from "lucide-react";
import { InstagramIcon, YoutubeIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { SocialLinks } from "@music-label/shared";
import { useTheme } from "@/components/theme/ThemeProvider";

interface SocialFollowBannerProps {
  socialLinks: SocialLinks;
}

export default function SocialFollowBanner({ socialLinks }: SocialFollowBannerProps) {
  const { isDark } = useTheme();

  return (
    <section className={`py-24 border-t relative overflow-hidden transition-colors duration-300 ${
      isDark ? "bg-[#08080A] border-white/10" : "bg-[#FAFAFC] border-black/[0.08]"
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
        <MotionReveal direction="up">
          <div className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#E51E2B]/40 mb-6 ${
            isDark ? "bg-red-950/40" : "bg-red-50/50"
          }`}>
            <Radio className="w-3.5 h-3.5 text-[#E51E2B] animate-pulse" />
            <span className="text-xs font-semibold tracking-[0.25em] text-[#E51E2B] uppercase">
              Stay Synced With Velvet Noir
            </span>
          </div>

          <h2 className={`font-heading font-extrabold text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight max-w-3xl mx-auto leading-tight transition-colors ${
            isDark ? "text-white" : "text-[#09090B]"
          }`}>
            Immerse In Our Broadcasts
          </h2>

          <p className={`mt-4 text-sm sm:text-base max-w-xl mx-auto font-light transition-colors ${
            isDark ? "text-zinc-400" : "text-zinc-600"
          }`}>
            Follow our channels for secret listening sessions, behind-the-scenes recording footage, and priority vinyl drop notices.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center space-x-3 px-6 py-3.5 rounded-full border hover:border-[#E51E2B] font-medium text-sm transition-all shadow-sm ${
                  isDark
                    ? "bg-[#121217] border-white/10 text-white"
                    : "bg-white border-black/10 text-zinc-900"
                }`}
              >
                <InstagramIcon className="w-4 h-4 text-[#E51E2B]" />
                <span>Instagram</span>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#E51E2B]" />
              </a>
            )}

            {socialLinks.youtube && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center space-x-3 px-6 py-3.5 rounded-full border hover:border-[#E51E2B] font-medium text-sm transition-all shadow-sm ${
                  isDark
                    ? "bg-[#121217] border-white/10 text-white"
                    : "bg-white border-black/10 text-zinc-900"
                }`}
              >
                <YoutubeIcon className="w-4 h-4 text-[#E51E2B]" />
                <span>YouTube Showreels</span>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#E51E2B]" />
              </a>
            )}

            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center space-x-3 px-6 py-3.5 rounded-full border hover:border-[#E51E2B] font-medium text-sm transition-all shadow-sm ${
                  isDark
                    ? "bg-[#121217] border-white/10 text-white"
                    : "bg-white border-black/10 text-zinc-900"
                }`}
              >
                <FacebookIcon className="w-4 h-4 text-[#E51E2B]" />
                <span>Community Facebook</span>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#E51E2B]" />
              </a>
            )}
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
