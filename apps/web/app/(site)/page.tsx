import React, { Suspense } from "react";
import HeroSection from "@/components/site/HeroSection";
import AboutTeaser from "@/components/site/AboutTeaser";
import VinylShowcaseSection from "@/components/site/VinylShowcaseSection";
import ArtistsGrid from "@/components/site/ArtistsGrid";
import UpcomingProjects from "@/components/site/UpcomingProjects";
import TestimonialSlider from "@/components/site/TestimonialSlider";
import SocialFollowBanner from "@/components/site/SocialFollowBanner";
import {
  getPageContent,
  getArtists,
  getManagers,
  getUpcomingProjects,
  getTestimonials,
  getSettings,
} from "@/lib/supabase/service";
import { HomePageContent } from "@music-label/shared";

export const metadata = {
  title: "Home | Velvet Noir Recordings — Luxury Sonic Immersion",
  description:
    "An avant-garde collective of boundary-defying producers, rock icons, and visionary recording artists.",
};

async function HomeDataFetcher() {
  const [homeContent, artists, managers, upcomingProjects, testimonials, settings] =
    await Promise.all([
      getPageContent<HomePageContent>("home"),
      getArtists(),
      getManagers(),
      getUpcomingProjects(),
      getTestimonials(),
      getSettings(),
    ]);

  return (
    <div className="flex flex-col w-full bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* 1. Hero Section with Video */}
      <HeroSection content={homeContent.hero} />

      {/* 2. About Teaser ("SCULPTING MODERN SOUNDSCAPES") */}
      <AboutTeaser content={homeContent.aboutTeaser} />

      {/* 3. Vinylist Direct Master Section */}
      <VinylShowcaseSection />

      {/* 5. Artists Section */}
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

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)] animate-pulse" />}>
      <HomeDataFetcher />
    </Suspense>
  );
}

