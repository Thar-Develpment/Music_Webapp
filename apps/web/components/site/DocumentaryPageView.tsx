"use client";

import React from "react";
import { TeamMember } from "@music-label/shared";
import { MotionReveal, StaggerContainer, StaggerItem } from "@/components/animations/MotionReveal";
import { GlassTiltCard } from "@/components/animations/GlassTiltCard";
import { Clapperboard, Award, Film } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

interface DocumentaryPageViewProps {
  team: TeamMember[];
}

export default function DocumentaryPageView({ team }: DocumentaryPageViewProps) {
  const { isDark } = useTheme();

  return (
    <div
      className={`flex flex-col w-full pt-32 pb-32 transition-colors duration-300 ${
        isDark ? "bg-[#08080A] text-[#F4F4F6]" : "bg-[#FAFAFC] text-[#09090B]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <MotionReveal direction="up">
            <div
              className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border shadow-sm mb-6 ${
                isDark
                  ? "bg-[#E51E2B]/10 border-[#E51E2B]/40 text-[#E51E2B]"
                  : "bg-red-50/80 border-[#E51E2B]/40 text-[#E51E2B]"
              }`}
            >
              <Clapperboard className="w-3.5 h-3.5 text-[#E51E2B]" />
              <span className="text-xs font-bold tracking-[0.25em] uppercase">
                Cinema Production Unit
              </span>
            </div>

            <h1
              className={`font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight ${
                isDark ? "text-white" : "text-[#09090B]"
              }`}
            >
              The Documentary Crew
            </h1>

            <p
              className={`mt-4 text-sm sm:text-base font-light max-w-xl mx-auto leading-relaxed ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Credits and profiles of the award-winning filmmakers, audio engineers, and visionaries
              capturing the raw genesis of our musical works.
            </p>
          </MotionReveal>
        </div>

        {/* Feature Documentary Teaser Card */}
        <MotionReveal direction="up" className="mb-24">
          <GlassTiltCard
            className={`p-8 sm:p-14 border shadow-xl rounded-3xl glass-shimmer transition-all ${
              isDark
                ? "border-white/10 bg-[#121217] shadow-black/50"
                : "border-black/10 bg-white"
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div
                  className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3 border ${
                    isDark
                      ? "bg-[#E51E2B]/15 text-[#E51E2B] border-[#E51E2B]/40"
                      : "bg-red-50 text-[#E51E2B] border-[#E51E2B]/35"
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-[#E51E2B]" />
                  <span>Flagship Feature Presentation</span>
                </div>
                <h2
                  className={`font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight leading-tight ${
                    isDark ? "text-white" : "text-[#09090B]"
                  }`}
                >
                  “THE FREQUENCY OF SILENCE” (4K HDR)
                </h2>
                <p
                  className={`mt-4 text-sm sm:text-base font-light leading-relaxed ${
                    isDark ? "text-zinc-300" : "text-zinc-600"
                  }`}
                >
                  An intimate 90-minute cinematic study chronicling 24 months of composition across
                  isolated Icelandic fjords, Abbey Road studios, and underground European clubs.
                  Premiering at international film festivals in 2027.
                </p>
              </div>
              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <div
                  className={`inline-flex items-center space-x-3 px-6 py-3.5 rounded-full border text-xs uppercase tracking-widest font-bold shadow-sm ${
                    isDark
                      ? "bg-[#181820] border-[#E51E2B]/40 text-white shadow-black/40"
                      : "bg-red-50 border-[#E51E2B]/40 text-zinc-900"
                  }`}
                >
                  <Award className="w-4 h-4 text-[#E51E2B]" />
                  <span>Tribeca & IDFA Official Selection</span>
                </div>
              </div>
            </div>
          </GlassTiltCard>
        </MotionReveal>

        {/* 10 Team Members Grid with 3D Tilt Cards */}
        <StaggerContainer
          staggerDelay={0.08}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
        >
          {team.map((member) => (
            <StaggerItem key={member.id}>
              <GlassTiltCard
                className={`border group shadow-lg glass-shimmer flex flex-col h-full rounded-3xl overflow-hidden transition-all ${
                  isDark
                    ? "border-white/10 bg-[#121217] hover:border-[#E51E2B]/60 shadow-black/40"
                    : "border-black/10 bg-white hover:border-[#E51E2B]/60"
                }`}
              >
                {/* Photo */}
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-108 transition-all duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  {/* Holographic Pass Role Badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-bold tracking-wider uppercase shadow-md ${
                        isDark
                          ? "bg-black/80 border-white/20 text-white"
                          : "bg-white/90 border-black/10 text-zinc-900"
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div
                  className={`p-6 flex flex-col flex-1 justify-between transition-colors ${
                    isDark ? "bg-[#121217]" : "bg-white"
                  }`}
                >
                  <div>
                    <h3
                      className={`font-heading font-extrabold text-xl group-hover:text-[#E51E2B] transition-colors ${
                        isDark ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      {member.name}
                    </h3>
                    <p
                      className={`mt-3 text-xs sm:text-sm font-light leading-relaxed ${
                        isDark ? "text-zinc-400" : "text-zinc-600"
                      }`}
                    >
                      {member.bio}
                    </p>
                  </div>
                </div>
              </GlassTiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
