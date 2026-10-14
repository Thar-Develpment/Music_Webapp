import React from "react";
import { db } from "@/lib/mock-data";
import { MotionReveal, StaggerContainer, StaggerItem } from "@/components/animations/MotionReveal";
import { Film, Clapperboard, Award } from "lucide-react";

export const metadata = {
  title: "Documentary Production Team | Velvet Noir Recordings",
  description:
    "Meet the cinematographers, directors, sound designers, and visual artists behind Velvet Noir's feature music documentaries.",
};

export default function DocumentaryPage() {
  const team = db.teamMembers;

  return (
    <div className="flex flex-col w-full pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <MotionReveal direction="up">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-black/50 mb-6">
              <Clapperboard className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
                Cinema Production Unit
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white uppercase tracking-tight">
              The Documentary Crew
            </h1>

            <p className="mt-4 text-zinc-400 text-sm sm:text-base font-light">
              Credits and profiles of the award-winning filmmakers, audio engineers, and visionaries capturing the raw genesis of our musical works.
            </p>
          </MotionReveal>
        </div>

        {/* Feature Documentary Teaser Card */}
        <MotionReveal direction="up" className="mb-24">
          <div className="relative rounded-3xl overflow-hidden glass-panel-gold p-8 sm:p-12 border border-[#D4AF37]/30">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
                  Flagship Feature Presentation
                </span>
                <h2 className="mt-2 font-heading font-extrabold text-2xl sm:text-4xl text-white uppercase">
                  “THE FREQUENCY OF SILENCE” (4K HDR)
                </h2>
                <p className="mt-4 text-zinc-300 text-sm sm:text-base font-light leading-relaxed">
                  An intimate 90-minute cinematic study chronicling 24 months of composition across isolated Icelandic fjords, Abbey Road studios, and underground European clubs. Premiering at international film festivals in 2027.
                </p>
              </div>
              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5D77F] text-xs uppercase tracking-widest font-semibold">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <span>Tribeca & IDFA Official Selection</span>
                </div>
              </div>
            </div>
          </div>
        </MotionReveal>

        {/* 10 Team Members Grid */}
        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
        >
          {team.map((member) => (
            <StaggerItem key={member.id}>
              <div className="group rounded-2xl overflow-hidden glass-panel glass-panel-hover flex flex-col h-full border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300">
                {/* Photo */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#14151c]">
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale-[25%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent opacity-80" />

                  {/* Role Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#D4AF37]/30 text-[11px] font-semibold tracking-wider text-[#D4AF37] uppercase">
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col flex-1 justify-between bg-[#0e0f14]/80">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-white group-hover:text-[#F5D77F] transition-colors">
                      {member.name}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
