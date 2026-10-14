import { NextResponse } from "next/server";
import { db } from "@/lib/mock-data";

export async function GET() {
  const sortedCategories = [...db.galleryCategories].sort((a, b) => a.order - b.order);
  const sortedItems = [...db.galleryItems].sort((a, b) => a.order - b.order);

  return NextResponse.json({
    success: true,
    data: {
      categories: sortedCategories,
      items: sortedItems,
    },
  });
}
