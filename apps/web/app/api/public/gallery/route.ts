import { NextResponse } from "next/server";
import { getGalleryCategories, getGalleryItems } from "@/lib/supabase/service";

export async function GET() {
  const [categories, items] = await Promise.all([
    getGalleryCategories(),
    getGalleryItems(),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      categories,
      items,
    },
  });
}
