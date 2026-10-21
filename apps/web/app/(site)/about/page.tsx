import React from "react";
import { db } from "@/lib/mock-data";
import AboutView from "@/components/site/AboutView";

export const metadata = {
  title: "About Us | Velvet Noir Recordings — Acoustic Architecture",
  description:
    "The story, artistic philosophy, architectural acoustic sanctuary, and vision behind Velvet Noir Recordings.",
};

export default function AboutPage() {
  const about = db.aboutContent;
  const managers = db.managers;
  const upcomingProjects = db.upcomingProjects;

  return (
    <AboutView
      about={about}
      managers={managers}
      upcomingProjects={upcomingProjects}
    />
  );
}
