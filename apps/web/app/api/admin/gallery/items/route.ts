import { NextResponse } from "next/server";
import { GalleryItemSchema } from "@music-label/shared";
import { db } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ success: true, data: db.galleryItems });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newItem = {
      ...body,
      id: body.id || `gal-${Date.now()}`,
      order: db.galleryItems.length + 1,
    };
    const validated = GalleryItemSchema.safeParse(newItem);
    if (!validated.success) {
      return NextResponse.json({ success: false, error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
    }
    db.galleryItems.unshift(validated.data);
    return NextResponse.json({ success: true, data: validated.data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create gallery item" }, { status: 500 });
  }
}
