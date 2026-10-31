import { NextResponse } from "next/server";
import { GalleryCategorySchema } from "@music-label/shared";
import { getGalleryCategories, upsertGalleryCategory } from "@/lib/supabase/service";

export async function GET() {
  const categories = await getGalleryCategories();
  return NextResponse.json({ success: true, data: categories });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const categories = await getGalleryCategories();
    const newCategory = {
      ...body,
      id: body.id || `cat-${Date.now()}`,
      order: categories.length + 1,
    };
    const validated = GalleryCategorySchema.safeParse(newCategory);
    if (!validated.success) {
      return NextResponse.json({ success: false, error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
    }
    const saved = await upsertGalleryCategory(validated.data);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 });
  }
}
