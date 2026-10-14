"use client";

import React from "react";
import { UpcomingProject } from "@music-label/shared";
import { MotionReveal, StaggerContainer, StaggerItem } from "@/components/animations/MotionReveal";
import { Calendar, Disc3, Sparkles } from "lucide-react";

interface UpcomingProjectsProps {
  projects: UpcomingProject[];
}

export default function UpcomingProjects({ projects }: UpcomingProjectsProps) {
  return (
    <section className="py-28 bg-[#090A0E] border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <MotionReveal direction="left">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
              In The Pipeline
            </span>
            <h2 className="mt-3 font-heading font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight">
              Upcoming Projects & Releases
            </h2>
          </MotionReveal>
          <MotionReveal direction="right" delay={0.2}>
            <p className="mt-4 md:mt-0 text-zinc-400 text-sm max-w-md font-light">
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
              <div className="group rounded-2xl overflow-hidden glass-panel glass-panel-hover flex flex-col h-full">
                {/* Artwork */}
                <div className="relative aspect-square overflow-hidden bg-black/40">
                  <img
                    src={proj.coverUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/30 text-xs font-medium text-[#F5D77F]">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    <span>{proj.category}</span>
                  </div>

                  <div className="absolute bottom-4 right-4 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-zinc-300">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{proj.releaseDate}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-white group-hover:text-[#D4AF37] transition-colors">
                      {proj.title}
                    </h3>
                    <p className="mt-3 text-sm text-zinc-400 font-light leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center space-x-1.5">
                      <Disc3 className="w-4 h-4 text-[#D4AF37]" />
                      <span>Limited Vinyl & Digital Stream</span>
                    </span>
                    <span className="text-[#D4AF37] font-semibold">Pre-Save Soon</span>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
