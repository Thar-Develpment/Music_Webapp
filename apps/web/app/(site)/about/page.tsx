import React, { Suspense } from "react";
import AboutView from "@/components/site/AboutView";
import {
  getPageContent,
  getManagers,
  getUpcomingProjects,
} from "@/lib/supabase/service";
import { AboutPageContent } from "@music-label/shared";

export const metadata = {
  title: "About Us | Velvet Noir Recordings — Acoustic Architecture",
  description:
    "The story, artistic philosophy, architectural acoustic sanctuary, and vision behind Velvet Noir Recordings.",
};

async function AboutDataFetcher() {
  const [about, managers, upcomingProjects] = await Promise.all([
    getPageContent<AboutPageContent>("about"),
    getManagers(),
    getUpcomingProjects(),
  ]);

  return (
    <AboutView
      about={about}
      managers={managers}
      upcomingProjects={upcomingProjects}
    />
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)] animate-pulse" />}>
      <AboutDataFetcher />
    </Suspense>
  );
}

