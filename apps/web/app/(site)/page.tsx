import React from "react";
import HeroSection from "@/components/site/HeroSection";
import AboutTeaser from "@/components/site/AboutTeaser";
import VinylShowcaseSection from "@/components/site/VinylShowcaseSection";
import ArtistsGrid from "@/components/site/ArtistsGrid";
import UpcomingProjects from "@/components/site/UpcomingProjects";
import TestimonialSlider from "@/components/site/TestimonialSlider";
import SocialFollowBanner from "@/components/site/SocialFollowBanner";
import { db } from "@/lib/mock-data";

export const metadata = {
  title: "Home | Velvet Noir Recordings — Luxury Sonic Immersion",
  description:
    "An avant-garde collective of boundary-defying producers, rock icons, and visionary recording artists.",
};

export default function HomePage() {
  const homeContent = db.homeContent;
  const artists = db.artists;
  const managers = db.managers;
  const upcomingProjects = db.upcomingProjects;
  const testimonials = db.testimonials;
  const settings = db.settings;

  return (
    <div className="flex flex-col w-full bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* 1. Hero Section with Video */}
      <HeroSection content={homeContent.hero} />

      {/* 2. About Teaser ("SCULPTING MODERN SOUNDSCAPES") */}
      <AboutTeaser content={homeContent.aboutTeaser} />

      {/* 3. Vinylist Direct Master Section (Split Black/Red with Rotating Vinyl & Needle) */}
      <VinylShowcaseSection />

      {/* 5. Artists Section (Circular Constellation + 3D Spotify Glassmorphic Horizontal Cards) */}
      <ArtistsGrid artists={artists} managers={managers} />

      {/* 6. Upcoming Projects Gallery */}
      <UpcomingProjects projects={upcomingProjects} />

      {/* 7. Testimonials Slider */}
      <TestimonialSlider testimonials={testimonials} />

      {/* 8. Social Media Follow Banner */}
      <SocialFollowBanner socialLinks={settings.socialLinks} />
    </div>
  );
}
