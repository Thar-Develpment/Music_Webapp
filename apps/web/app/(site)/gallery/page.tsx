import React from "react";
import { db } from "@/lib/mock-data";
import GalleryPageView from "@/components/site/GalleryPageView";

export const metadata = {
  title: "Gallery | Velvet Noir Recordings — Visual Archive",
  description:
    "Visual archive of live tours, recording sessions, orchestral tracking, and documentary stills.",
};

export default function GalleryPage() {
  const categories = db.galleryCategories;
  const items = db.galleryItems;

  return <GalleryPageView categories={categories} items={items} />;
}
