"use client";

import React from "react";
import { Counter } from "@music-label/shared";
import { CounterUp } from "@/components/animations/CounterUp";
import { StaggerContainer, StaggerItem } from "@/components/animations/MotionReveal";
import { GlassTiltCard } from "@/components/animations/GlassTiltCard";

interface CountersSectionProps {
  counters: Counter[];
}

export default function CountersSection({ counters }: CountersSectionProps) {
  return (
    <section className="py-24 bg-gradient-to-b from-[#070709] via-[#090a0e] to-[#070709] border-y border-white/[0.08] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[250px] bg-[#e11d48]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <StaggerContainer
          staggerDelay={0.12}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
        >
          {counters.map((c) => (
            <StaggerItem key={c.id}>
              <GlassTiltCard className="p-8 text-center border border-white/[0.1] hover:border-[#e11d48]/60 shadow-2xl glass-shimmer">
                <div className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl red-text-gradient tracking-tight drop-shadow-md">
                  <CounterUp value={c.value} suffix={c.suffix} />
                </div>
                <div className="mt-3 flex items-center justify-center">
                  <p className="text-xs sm:text-sm font-bold tracking-widest text-zinc-300 uppercase">
                    {c.label}
                  </p>
                </div>
              </GlassTiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
