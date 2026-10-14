import { NextResponse } from "next/server";
import { GalleryCategorySchema } from "@music-label/shared";
import { db } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ success: true, data: db.galleryCategories });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCategory = {
      ...body,
      id: body.id || `cat-${Date.now()}`,
      order: db.galleryCategories.length + 1,
    };
    const validated = GalleryCategorySchema.safeParse(newCategory);
    if (!validated.success) {
      return NextResponse.json({ success: false, error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
    }
    db.galleryCategories.push(validated.data);
    return NextResponse.json({ success: true, data: validated.data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 });
  }
}
