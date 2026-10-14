"use client";

import React from "react";
import { Counter } from "@music-label/shared";
import { CounterUp } from "@/components/animations/CounterUp";
import { MotionReveal, StaggerContainer, StaggerItem } from "@/components/animations/MotionReveal";

interface CountersSectionProps {
  counters: Counter[];
}

export default function CountersSection({ counters }: CountersSectionProps) {
  return (
    <section className="py-20 bg-[#090A0E] border-y border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <StaggerContainer
          staggerDelay={0.15}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12"
        >
          {counters.map((c) => (
            <StaggerItem key={c.id}>
              <div className="flex flex-col items-center text-center p-6 rounded-2xl glass-panel glass-panel-hover group">
                <div className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl gold-text-gradient tracking-tight">
                  <CounterUp value={c.value} suffix={c.suffix} />
                </div>
                <p className="mt-3 text-xs sm:text-sm font-semibold tracking-widest text-zinc-400 uppercase">
                  {c.label}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
