import React from "react";
import { db } from "@/lib/mock-data";
import DocumentaryPageView from "@/components/site/DocumentaryPageView";

export const metadata = {
  title: "Documentary Production Team | Velvet Noir Recordings",
  description:
    "Meet the cinematographers, directors, sound designers, and visual artists behind Velvet Noir's feature music documentaries.",
};

export default function DocumentaryPage() {
  const team = db.teamMembers;

  return <DocumentaryPageView team={team} />;
}
