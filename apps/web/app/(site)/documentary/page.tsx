import React from "react";
import DocumentaryPageView from "@/components/site/DocumentaryPageView";
import { getTeamMembers } from "@/lib/supabase/service";

export const metadata = {
  title: "Documentary Production Team | Velvet Noir Recordings",
  description:
    "Meet the cinematographers, directors, sound designers, and visual artists behind Velvet Noir's feature music documentaries.",
};

export default async function DocumentaryPage() {
  const team = await getTeamMembers();
  return <DocumentaryPageView team={team} />;
}
