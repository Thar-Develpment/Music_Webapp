import React, { Suspense } from "react";
import GalleryPageView from "@/components/site/GalleryPageView";
import { getGalleryCategories, getGalleryItems } from "@/lib/supabase/service";

export const metadata = {
  title: "Gallery | Velvet Noir Recordings — Visual Archive",
  description:
    "Visual archive of live tours, recording sessions, orchestral tracking, and documentary stills.",
};

async function GalleryDataFetcher() {
  const [categories, items] = await Promise.all([
    getGalleryCategories(),
    getGalleryItems(),
  ]);

  return <GalleryPageView categories={categories} items={items} />;
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)] animate-pulse" />}>
      <GalleryDataFetcher />
    </Suspense>
  );
}

