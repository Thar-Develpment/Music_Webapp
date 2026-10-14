"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Disc3 } from "lucide-react";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { HomePageContent } from "@music-label/shared";

interface AboutTeaserProps {
  content: HomePageContent["aboutTeaser"];
}

export default function AboutTeaser({ content }: AboutTeaserProps) {
  return (
    <section className="py-28 relative overflow-hidden bg-[#070709] border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Editorial Image with Floating Badge */}
          <div className="lg:col-span-5 relative">
            <MotionReveal direction="left" duration={0.8}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-white/10 shadow-2xl group">
                <img
                  src={content.imageUrl}
                  alt="Velvet Noir Sound Studio"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Floating Studio Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl glass-panel-gold flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                    <Disc3 className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                      Dolby Atmos Mastering
                    </p>
                    <p className="text-xs text-zinc-300">
                      Analog Modular & 80-Piece Symphony
                    </p>
                  </div>
                </div>
              </div>
            </MotionReveal>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <MotionReveal direction="right" duration={0.8}>
              <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
                Artistic Philosophy
              </span>

              <h2 className="mt-3 font-heading font-extrabold text-3xl sm:text-5xl tracking-tight text-white uppercase leading-tight">
                {content.heading}
              </h2>

              <p className="mt-6 text-base sm:text-lg text-zinc-300 leading-relaxed font-light">
                {content.bio}
              </p>

              <div className="mt-10">
                <Link
                  href="/about"
                  id="about-teaser-button"
                  className="group inline-flex items-center space-x-3 px-8 py-4 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#F5D77F] hover:text-[#070709] font-bold text-sm tracking-wider uppercase transition-all duration-300"
                >
                  <span>{content.buttonText || "Learn More"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </MotionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
