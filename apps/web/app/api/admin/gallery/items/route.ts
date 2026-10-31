import { NextResponse } from "next/server";
import { GalleryItemSchema } from "@music-label/shared";
import { getGalleryItems, upsertGalleryItem } from "@/lib/supabase/service";

export async function GET() {
  const items = await getGalleryItems();
  return NextResponse.json({ success: true, data: items });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = await getGalleryItems();
    const newItem = {
      ...body,
      id: body.id || `gal-${Date.now()}`,
      order: items.length + 1,
    };
    const validated = GalleryItemSchema.safeParse(newItem);
    if (!validated.success) {
      return NextResponse.json({ success: false, error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
    }
    const saved = await upsertGalleryItem(validated.data);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create gallery item" }, { status: 500 });
  }
}
