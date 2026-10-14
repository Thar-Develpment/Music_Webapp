import React from "react";
import { db } from "@/lib/mock-data";
import CountersSection from "@/components/site/CountersSection";
import UpcomingProjects from "@/components/site/UpcomingProjects";
import { MotionReveal, StaggerContainer, StaggerItem } from "@/components/animations/MotionReveal";
import { Disc3, Sparkles } from "lucide-react";

export const metadata = {
  title: "About Us | Velvet Noir Recordings",
  description:
    "The story, artistic philosophy, and vision behind Velvet Noir Recordings and its archival catalog.",
};

export default function AboutPage() {
  const about = db.aboutContent;
  const counters = db.counters;
  const managers = db.managers;
  const upcomingProjects = db.upcomingProjects;

  return (
    <div className="flex flex-col w-full pt-32 pb-20">
      {/* Editorial Header */}
      <section className="relative px-6 lg:px-12 max-w-7xl mx-auto w-full mb-20">
        <MotionReveal direction="up">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-black/50 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
              Archival Identity
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white uppercase tracking-tight max-w-4xl leading-tight">
            {about.headline}
          </h1>

          <p className="mt-4 text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
            {about.artistName}
          </p>
        </MotionReveal>
      </section>

      {/* Editorial Narrative & Mission */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto w-full mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7 space-y-6 text-zinc-300 text-lg leading-relaxed font-light">
            <MotionReveal direction="up" delay={0.1}>
              <p className="first-letter:text-5xl first-letter:font-heading first-letter:font-extrabold first-letter:text-[#D4AF37] first-letter:float-left first-letter:mr-3 first-letter:leading-none">
                {about.fullBio}
              </p>
            </MotionReveal>

            <MotionReveal direction="up" delay={0.2}>
              <div className="p-8 rounded-2xl glass-panel-gold border-l-4 border-l-[#D4AF37] my-8">
                <h3 className="font-heading font-bold text-lg text-[#F5D77F] uppercase tracking-wider mb-2">
                  Our Unwavering Mission
                </h3>
                <p className="text-base text-zinc-200 italic font-light">
                  “{about.mission}”
                </p>
              </div>
            </MotionReveal>
          </div>

          {/* Manager Spotlight Cards */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <MotionReveal direction="left" delay={0.2}>
              <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
                <Disc3 className="w-5 h-5 text-[#D4AF37]" />
                <span>Executive Custodians</span>
              </h3>

              <div className="space-y-4">
                {managers.map((mgr) => (
                  <div
                    key={mgr.id}
                    className="flex items-center space-x-4 p-4 rounded-xl glass-panel glass-panel-hover"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-[#D4AF37]/40 shrink-0">
                      <img
                        src={mgr.photoUrl}
                        alt={mgr.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-base text-white">
                        {mgr.name}
                      </h4>
                      <p className="text-xs font-medium text-[#D4AF37] mt-0.5">
                        {mgr.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* Image Collage Grid */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto w-full mb-28">
        <MotionReveal direction="up">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
              Behind The Craft
            </span>
            <h2 className="mt-2 font-heading font-bold text-2xl sm:text-4xl text-white uppercase">
              Sanctuary of Sound & Tape
            </h2>
          </div>
        </MotionReveal>

        <StaggerContainer
          staggerDelay={0.12}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {about.collageImages.map((imgUrl, idx) => (
            <StaggerItem key={idx}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] group bg-[#111217] border border-white/10">
                <img
                  src={imgUrl}
                  alt={`Velvet Noir studio collage ${idx + 1}`}
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Shared Animated Counters */}
      <CountersSection counters={counters} />

      {/* Upcoming Projects */}
      <UpcomingProjects projects={upcomingProjects} />
    </div>
  );
}
