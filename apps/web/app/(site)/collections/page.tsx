import React from "react";
import CollectionsClient from "@/components/site/CollectionsClient";
import { getCollections, getTracks } from "@/lib/supabase/service";

export const metadata = {
  title: "Collections | Velvet Noir Recordings — Archival Vinyl & Audiophile Releases",
  description:
    "Explore Velvet Noir's exclusive collections of 180g direct-to-vinyl pressings, master recordings, and limited-edition boxsets.",
};

export default async function CollectionsPage() {
  const [collections, tracks] = await Promise.all([
    getCollections(),
    getTracks(),
  ]);

  return <CollectionsClient collections={collections} allTracks={tracks} />;
}

