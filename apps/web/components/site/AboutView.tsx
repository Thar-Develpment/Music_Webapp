"use client";

import React from "react";
import { AboutPageContent, Manager, UpcomingProject } from "@music-label/shared";
import UpcomingProjects from "@/components/site/UpcomingProjects";
import AboutArchitecturalHero from "@/components/site/AboutArchitecturalHero";
import { MotionReveal, StaggerContainer, StaggerItem } from "@/components/animations/MotionReveal";
import { GlassTiltCard } from "@/components/animations/GlassTiltCard";
import { Disc3, Sliders, ShieldCheck } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

interface AboutViewProps {
  about: AboutPageContent;
  managers: Manager[];
  upcomingProjects: UpcomingProject[];
}

export default function AboutView({
  about,
  managers,
  upcomingProjects,
}: AboutViewProps) {
  const { isDark } = useTheme();

  return (
    <div
      className={`flex flex-col w-full pb-24 transition-colors duration-300 ${
        isDark ? "bg-[#08080A] text-[#F4F4F6]" : "bg-[#FAFAFC] text-[#09090B]"
      }`}
    >
      {/* 1. Architectural Hero Section */}
      <AboutArchitecturalHero />

      {/* 2. Editorial Narrative & Mission */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto w-full my-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div
            className={`lg:col-span-7 space-y-6 text-lg leading-relaxed font-light ${
              isDark ? "text-zinc-300" : "text-zinc-600"
            }`}
          >
            <MotionReveal direction="up" delay={0.1}>
              <div
                className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border shadow-sm mb-4 ${
                  isDark
                    ? "bg-[#e11d48]/10 border-[#e11d48]/40 text-[#e11d48]"
                    : "bg-red-50/80 border-[#e11d48]/30 text-[#e11d48]"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" />
                <span className="text-xs font-bold tracking-[0.25em] uppercase">
                  Archival Identity
                </span>
              </div>
              <h2
                className={`font-heading font-extrabold text-3xl sm:text-5xl uppercase tracking-tight mb-6 leading-tight ${
                  isDark ? "text-white" : "text-[#09090B]"
                }`}
              >
                {about.headline}
              </h2>
              <p className="first-letter:text-6xl first-letter:font-heading first-letter:font-extrabold first-letter:text-[#e11d48] first-letter:float-left first-letter:mr-3.5 first-letter:leading-none">
                {about.fullBio}
              </p>
            </MotionReveal>

            <MotionReveal direction="up" delay={0.2}>
              <div
                className={`p-8 sm:p-10 rounded-3xl border shadow-md relative overflow-hidden my-8 glass-shimmer ${
                  isDark
                    ? "bg-[#16161D]/90 border-[#e11d48]/35 shadow-black/40"
                    : "bg-red-50/80 border-[#e11d48]/30"
                }`}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <ShieldCheck className="w-5 h-5 text-[#e11d48]" />
                  <h3
                    className={`font-heading font-extrabold text-base uppercase tracking-wider ${
                      isDark ? "text-white" : "text-zinc-900"
                    }`}
                  >
                    Our Unwavering Mission
                  </h3>
                </div>
                <p
                  className={`text-base sm:text-lg italic font-light leading-relaxed ${
                    isDark ? "text-zinc-200" : "text-zinc-700"
                  }`}
                >
                  “{about.mission}”
                </p>
              </div>
            </MotionReveal>
          </div>

          {/* Manager Spotlight Cards (Square Portraits) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <MotionReveal direction="left" delay={0.2}>
              <h3
                className={`font-heading font-extrabold text-xl uppercase tracking-wider mb-6 flex items-center space-x-2.5 ${
                  isDark ? "text-white" : "text-[#09090B]"
                }`}
              >
                <Disc3 className="w-5 h-5 text-[#e11d48] animate-[spin_8s_linear_infinite]" />
                <span>Executive Custodians</span>
              </h3>

              <div className="space-y-4">
                {managers.map((mgr) => (
                  <GlassTiltCard
                    key={mgr.id}
                    className={`p-5 border shadow-md glass-shimmer rounded-2xl transition-all ${
                      isDark
                        ? "border-white/10 bg-[#121217] hover:border-[#e11d48]/60 shadow-black/40"
                        : "border-black/10 bg-white hover:border-[#e11d48]/60"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#e11d48]/40 shadow-sm shrink-0 aspect-square">
                        <img
                          src={mgr.photoUrl}
                          alt={mgr.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4
                          className={`font-heading font-extrabold text-lg ${
                            isDark ? "text-white" : "text-zinc-900"
                          }`}
                        >
                          {mgr.name}
                        </h4>
                        <p className="text-xs font-bold text-[#e11d48] uppercase tracking-wider mt-0.5">
                          {mgr.role}
                        </p>
                      </div>
                    </div>
                  </GlassTiltCard>
                ))}
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* 3. 3D Glass Image Collage Grid */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto w-full mb-32">
        <MotionReveal direction="up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div
              className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border shadow-sm mb-4 ${
                isDark
                  ? "bg-[#e11d48]/10 border-[#e11d48]/40 text-[#e11d48]"
                  : "bg-red-50/80 border-[#e11d48]/30 text-[#e11d48]"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#e11d48]" />
              <span className="text-xs font-bold tracking-[0.25em] uppercase">
                Behind The Glass
              </span>
            </div>
            <h2
              className={`font-heading font-extrabold text-3xl sm:text-5xl uppercase tracking-tight ${
                isDark ? "text-white" : "text-[#09090B]"
              }`}
            >
              Sanctuary of Sound & Tape
            </h2>
          </div>
        </MotionReveal>

        <StaggerContainer
          staggerDelay={0.12}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
        >
          {about.collageImages.map((imgUrl, idx) => (
            <StaggerItem key={idx}>
              <GlassTiltCard
                className={`aspect-[4/5] border group shadow-md glass-shimmer rounded-3xl overflow-hidden transition-all ${
                  isDark
                    ? "border-white/10 bg-[#121217] hover:border-[#e11d48]/60 shadow-black/40"
                    : "border-black/10 bg-white hover:border-[#e11d48]/60"
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`One Roof studio collage ${idx + 1}`}
                  className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-108 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </GlassTiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 4. Upcoming Projects */}
      <UpcomingProjects projects={upcomingProjects} />
    </div>
  );
}
