import React from "react";
import { db } from "@/lib/mock-data";
import GalleryView from "@/components/site/GalleryView";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Sparkles, Camera } from "lucide-react";

export const metadata = {
  title: "Gallery | Velvet Noir Recordings",
  description:
    "Visual archive of live tours, recording sessions, orchestral tracking, and documentary stills.",
};

export default function GalleryPage() {
  const categories = db.galleryCategories;
  const items = db.galleryItems;

  return (
    <div className="flex flex-col w-full pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <MotionReveal direction="up">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-black/50 mb-6">
              <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
                Visual Archive
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white uppercase tracking-tight">
              Collections & Events
            </h1>

            <p className="mt-4 text-zinc-400 text-sm sm:text-base font-light">
              An intimate photographic look inside recording consoles, worldwide arena stages, and cinematic film sets.
            </p>
          </MotionReveal>
        </div>

        {/* Gallery View with tabs and full-screen lightbox */}
        <GalleryView categories={categories} items={items} />

        {/* Short Description Section at Bottom */}
        <div className="mt-24 p-8 sm:p-12 rounded-3xl glass-panel text-center max-w-4xl mx-auto border border-white/10">
          <Sparkles className="w-6 h-6 text-[#D4AF37] mx-auto mb-4" />
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-white uppercase tracking-wider">
            Archival Photography & Press Access
          </h3>
          <p className="mt-4 text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
            All imagery captured on 35mm film, medium format analog cameras, and Arri Alexa cinema systems during live performances and studio tracking. High-resolution press kits and editorial licensing packages are available through our media relations office.
          </p>
        </div>
      </div>
    </div>
  );
}
