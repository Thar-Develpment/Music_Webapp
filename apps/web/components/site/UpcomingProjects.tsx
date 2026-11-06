"use client";

import React from "react";
import { UpcomingProject } from "@music-label/shared";
import { MotionReveal, StaggerContainer, StaggerItem } from "@/components/animations/MotionReveal";
import { GlassTiltCard } from "@/components/animations/GlassTiltCard";
import { Calendar, Disc3 } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

interface UpcomingProjectsProps {
  projects: UpcomingProject[];
}

export default function UpcomingProjects({ projects }: UpcomingProjectsProps) {
  const { isDark } = useTheme();

  return (
    <section className={`py-20 border-t relative overflow-hidden transition-colors duration-300 ${
      isDark ? "bg-[#08080A] border-white/10" : "bg-[#FAFAFC] border-black/[0.08]"
    }`}>
      {/* Background glow */}
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-[#e11d48]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
          <MotionReveal direction="left">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-frosted border border-[#e11d48]/40 shadow-sm mb-5">
              <Disc3 className="w-3.5 h-3.5 text-[#e11d48] animate-spin" />
              <span className="text-xs font-bold tracking-[0.25em] text-[#e11d48] uppercase">
                Archival Pressings In Production
              </span>
            </div>

            <h2 className={`font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight transition-colors ${
              isDark ? "text-white" : "text-[#09090B]"
            }`}>
              Upcoming Releases
            </h2>
          </MotionReveal>

          <MotionReveal direction="right" delay={0.2}>
            <p className={`mt-4 md:mt-0 text-sm max-w-md font-light leading-relaxed transition-colors ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}>
              Upcoming album pressings, feature documentary broadcasts, and spatial concert experiences scheduled for worldwide premiere.
            </p>
          </MotionReveal>
        </div>

        <StaggerContainer
          staggerDelay={0.15}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {projects.map((proj) => (
            <StaggerItem key={proj.id}>
              <GlassTiltCard className={`border hover:border-[#e11d48]/60 group shadow-xl glass-shimmer flex flex-col h-full rounded-3xl overflow-hidden transition-colors ${
                isDark ? "border-white/10 bg-[#121217]" : "border-black/[0.08] bg-white"
              }`}>
                {/* Artwork with vinyl sleeve gloss */}
                <div className={`relative aspect-square overflow-hidden ${isDark ? "bg-zinc-900" : "bg-zinc-100"}`}>
                  <img
                    src={proj.coverUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  {/* Glossy reflection diagonal */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />

                  {/* Badges */}
                  <div className={`absolute top-4 left-4 inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full backdrop-blur-md border text-xs font-bold shadow-md ${
                    isDark
                      ? "bg-black/75 border-white/20 text-white"
                      : "bg-white/90 border-black/10 text-zinc-900"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" />
                    <span>{proj.category}</span>
                  </div>

                  <div className="absolute bottom-4 right-4 inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-md">
                    <Calendar className="w-3.5 h-3.5 text-[#FF4D58]" />
                    <span>{proj.releaseDate}</span>
                  </div>
                </div>

                {/* Details */}
                <div className={`p-7 flex flex-col flex-1 justify-between transition-colors ${
                  isDark ? "bg-[#121217]" : "bg-white"
                }`}>
                  <div>
                    <h3 className={`font-heading font-extrabold text-xl sm:text-2xl group-hover:text-[#e11d48] transition-colors leading-snug ${
                      isDark ? "text-white" : "text-zinc-900"
                    }`}>
                      {proj.title}
                    </h3>
                    <p className={`mt-3 text-xs sm:text-sm font-light leading-relaxed ${
                      isDark ? "text-zinc-400" : "text-zinc-600"
                    }`}>
                      {proj.description}
                    </p>
                  </div>

                  <div className={`mt-6 pt-4 border-t flex items-center justify-between text-xs ${
                    isDark ? "border-white/10" : "border-black/[0.06]"
                  }`}>
                    <span className="uppercase tracking-wider font-bold text-[#e11d48]">
                      180g Vinyl & Atmos
                    </span>
                    <span className="text-zinc-500 font-mono">Archive Series</span>
                  </div>
                </div>
              </GlassTiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
