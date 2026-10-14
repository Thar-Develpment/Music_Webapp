"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Testimonial } from "@music-label/shared";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-28 bg-[#070709] border-t border-white/[0.06] relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4AF37]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <MotionReveal direction="up">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
              Critical Acclaim
            </span>
            <h2 className="mt-3 font-heading font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight">
              Praise From The Vanguard
            </h2>
          </MotionReveal>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="flex-[0_0_100%] min-w-0 px-4 sm:px-8"
                >
                  <div className="p-8 sm:p-12 rounded-3xl glass-panel-gold flex flex-col items-center text-center relative">
                    <Quote className="w-10 h-10 text-[#D4AF37]/30 mb-6" />

                    <p className="text-lg sm:text-2xl text-zinc-100 font-light italic leading-relaxed max-w-2xl">
                      “{t.quote}”
                    </p>

                    <div className="mt-8 flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4AF37]/40 shadow-lg">
                        <img
                          src={t.photoUrl}
                          alt={t.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <h4 className="font-heading font-bold text-base text-white">
                          {t.name}
                        </h4>
                        <p className="text-xs font-medium text-[#D4AF37]">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
