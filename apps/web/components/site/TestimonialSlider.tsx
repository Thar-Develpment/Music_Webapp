"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Testimonial } from "@music-label/shared";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

export default function TestimonialSlider({
  testimonials,
}: TestimonialSliderProps) {
  const { isDark } = useTheme();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <section className={`py-32 border-t relative overflow-hidden transition-colors duration-300 ${
      isDark ? "bg-[#08080A] border-white/10" : "bg-[#FAFAFC] border-black/[0.08]"
    }`}>
      {/* Background Accent Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#E51E2B]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <MotionReveal direction="up">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-frosted border border-[#E51E2B]/40 shadow-sm mb-5">
              <Quote className="w-3.5 h-3.5 text-[#E51E2B]" />
              <span className="text-xs font-bold tracking-[0.25em] text-[#E51E2B] uppercase">
                Industry Critical Acclaim
              </span>
            </div>

            <h2 className={`font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight transition-colors ${
              isDark ? "text-white" : "text-[#09090B]"
            }`}>
              Praise From The Vanguard
            </h2>
          </MotionReveal>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden p-4" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="flex-[0_0_100%] min-w-0 px-2 sm:px-6"
                >
                  <div className={`p-8 sm:p-14 rounded-3xl border flex flex-col items-center text-center relative shadow-xl glass-shimmer transition-colors ${
                    isDark ? "bg-[#121217] border-white/10" : "bg-white border-black/[0.08]"
                  }`}>
                    {/* Glowing Stars */}
                    <div className="flex items-center space-x-1 mb-6 text-[#E51E2B]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current drop-shadow-sm" />
                      ))}
                    </div>

                    <Quote className="w-12 h-12 text-[#E51E2B]/20 mb-6" />

                    <p className={`text-lg sm:text-2xl font-light italic leading-relaxed max-w-2xl ${
                      isDark ? "text-zinc-200" : "text-zinc-800"
                    }`}>
                      “{t.quote}”
                    </p>

                    <div className={`mt-10 flex items-center space-x-4 pt-8 border-t w-full justify-center ${
                      isDark ? "border-white/10" : "border-black/[0.08]"
                    }`}>
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#E51E2B]/50 shadow-md shadow-[#E51E2B]/15">
                        <img
                          src={t.photoUrl}
                          alt={t.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <h4 className={`font-heading font-extrabold text-base sm:text-lg ${
                          isDark ? "text-white" : "text-zinc-900"
                        }`}>
                          {t.name}
                        </h4>
                        <p className="text-xs font-bold text-[#E51E2B] tracking-wider uppercase">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Arrows & Indicator Dots */}
          <div className="flex items-center justify-center space-x-6 mt-10">
            <button
              onClick={scrollPrev}
              id="testimonial-prev-button"
              className={`w-12 h-12 rounded-full border flex items-center justify-center hover:text-[#E51E2B] hover:border-[#E51E2B] hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-md ${
                isDark
                  ? "bg-[#16161D] border-white/10 text-zinc-200"
                  : "bg-white border-black/10 text-zinc-700"
              }`}
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi && emblaApi.scrollTo(i)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    selectedIndex === i
                      ? "w-8 h-2 bg-[#E51E2B]"
                      : isDark
                      ? "w-2 h-2 bg-zinc-700 hover:bg-zinc-500"
                      : "w-2 h-2 bg-zinc-300 hover:bg-zinc-400"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={scrollNext}
              id="testimonial-next-button"
              className={`w-12 h-12 rounded-full border flex items-center justify-center hover:text-[#E51E2B] hover:border-[#E51E2B] hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-md ${
                isDark
                  ? "bg-[#16161D] border-white/10 text-zinc-200"
                  : "bg-white border-black/10 text-zinc-700"
              }`}
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
