"use client";

import React from "react";
import { ArrowUpRight, Radio } from "lucide-react";
import { InstagramIcon, YoutubeIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { SocialLinks } from "@music-label/shared";

interface SocialFollowBannerProps {
  socialLinks: SocialLinks;
}

export default function SocialFollowBanner({ socialLinks }: SocialFollowBannerProps) {
  return (
    <section className="py-24 bg-gradient-to-b from-[#070709] to-[#040406] border-t border-white/[0.08] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
        <MotionReveal direction="up">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-black/50 mb-6">
            <Radio className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
              Stay Synced With Velvet Noir
            </span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight max-w-3xl mx-auto leading-tight">
            Immerse In Our Broadcasts
          </h2>

          <p className="mt-4 text-zinc-400 text-sm sm:text-base max-w-xl mx-auto font-light">
            Follow our channels for secret listening sessions, behind-the-scenes recording footage, and priority vinyl drop notices.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center space-x-3 px-6 py-3.5 rounded-full glass-panel hover:border-[#D4AF37] text-white font-medium text-sm transition-all"
              >
                <InstagramIcon className="w-4 h-4 text-[#D4AF37]" />
                <span>Instagram</span>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            )}

            {socialLinks.youtube && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center space-x-3 px-6 py-3.5 rounded-full glass-panel hover:border-[#D4AF37] text-white font-medium text-sm transition-all"
              >
                <YoutubeIcon className="w-4 h-4 text-[#D4AF37]" />
                <span>YouTube Showreels</span>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            )}

            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center space-x-3 px-6 py-3.5 rounded-full glass-panel hover:border-[#D4AF37] text-white font-medium text-sm transition-all"
              >
                <FacebookIcon className="w-4 h-4 text-[#D4AF37]" />
                <span>Community</span>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            )}
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
