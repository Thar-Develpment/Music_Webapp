import React from "react";
import HeroSection from "@/components/site/HeroSection";
import AboutTeaser from "@/components/site/AboutTeaser";
import CountersSection from "@/components/site/CountersSection";
import ArtistsGrid from "@/components/site/ArtistsGrid";
import UpcomingProjects from "@/components/site/UpcomingProjects";
import TestimonialSlider from "@/components/site/TestimonialSlider";
import SocialFollowBanner from "@/components/site/SocialFollowBanner";
import { db } from "@/lib/mock-data";

export const metadata = {
  title: "Home | Velvet Noir Recordings — Luxury Sonic Immersion",
  description:
    "An avant-garde collective of boundary-defying producers, cinematic composers, and visionary recording artists.",
};

export default function HomePage() {
  const homeContent = db.homeContent;
  const counters = db.counters;
  const artists = db.artists;
  const managers = db.managers;
  const upcomingProjects = db.upcomingProjects;
  const testimonials = db.testimonials;
  const settings = db.settings;

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section with Video */}
      <HeroSection content={homeContent.hero} />

      {/* 2. About Teaser */}
      <AboutTeaser content={homeContent.aboutTeaser} />

      {/* 3. Animated Counters */}
      <CountersSection counters={counters} />

      {/* 4. Artists Grid & Manager Photos */}
      <ArtistsGrid artists={artists} managers={managers} />

      {/* 5. Upcoming Projects Gallery */}
      <UpcomingProjects projects={upcomingProjects} />

      {/* 6. Testimonials Slider */}
      <TestimonialSlider testimonials={testimonials} />

      {/* 7. Social Media Follow Banner */}
      <SocialFollowBanner socialLinks={settings.socialLinks} />
    </div>
  );
}
