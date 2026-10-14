"use client";

import React from "react";
import { Artist, Manager } from "@music-label/shared";
import { MotionReveal, StaggerContainer, StaggerItem } from "@/components/animations/MotionReveal";
import { Disc, ExternalLink } from "lucide-react";

interface ArtistsGridProps {
  artists: Artist[];
  managers: Manager[];
}

export default function ArtistsGrid({ artists, managers }: ArtistsGridProps) {
  return (
    <section id="artists-section" className="py-28 bg-[#070709] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <MotionReveal direction="up">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
              Roster & Collective
            </span>
            <h2 className="mt-3 font-heading font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight">
              Artists Defining The Sound
            </h2>
            <p className="mt-4 text-zinc-400 text-sm sm:text-base font-light">
              Pioneers of contemporary electronics, orchestral scoring, and forward-thinking acoustic performance.
            </p>
          </MotionReveal>
        </div>

        {/* Artists Image Grid */}
        <StaggerContainer
          staggerDelay={0.12}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-28"
        >
          {artists.map((artist) => (
            <StaggerItem key={artist.id}>
              <div className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#121318] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-500 shadow-xl">
                <img
                  src={artist.photoUrl}
                  alt={artist.name}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Artist Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-xs font-semibold tracking-wider text-[#D4AF37] uppercase">
                    {artist.genre}
                  </span>
                  <h3 className="font-heading font-bold text-2xl text-white mt-1">
                    {artist.name}
                  </h3>

                  {artist.spotifyUrl && (
                    <a
                      href={artist.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center space-x-2 text-xs font-medium text-zinc-300 hover:text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Disc className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Stream Catalog</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Manager Photos Sub-section */}
        <div className="pt-16 border-t border-white/[0.08]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <MotionReveal direction="up">
              <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
                Executive Leadership
              </span>
              <h3 className="mt-2 font-heading font-bold text-2xl sm:text-3xl text-white uppercase">
                Label Direction & Management
              </h3>
            </MotionReveal>
          </div>

          <StaggerContainer
            staggerDelay={0.15}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {managers.map((mgr) => (
              <StaggerItem key={mgr.id}>
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 rounded-2xl glass-panel glass-panel-hover">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#D4AF37]/30 shrink-0">
                    <img
                      src={mgr.photoUrl}
                      alt={mgr.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="font-heading font-bold text-xl text-white">
                      {mgr.name}
                    </h4>
                    <p className="text-sm font-medium text-[#D4AF37] mt-1">
                      {mgr.role}
                    </p>
                    <p className="text-xs text-zinc-400 mt-2 font-light">
                      Curating label repertoire, world tours, and archival quality releases.
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
