import React from "react";
import GalleryPageView from "@/components/site/GalleryPageView";
import { getGalleryCategories, getGalleryItems } from "@/lib/supabase/service";

export const metadata = {
  title: "Gallery | Velvet Noir Recordings — Visual Archive",
  description:
    "Visual archive of live tours, recording sessions, orchestral tracking, and documentary stills.",
};

export default async function GalleryPage() {
  const [categories, items] = await Promise.all([
    getGalleryCategories(),
    getGalleryItems(),
  ]);

  return <GalleryPageView categories={categories} items={items} />;
}
