import { NextResponse } from "next/server";
import { GalleryItemSchema } from "@music-label/shared";
import { db } from "@/lib/mock-data";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const index = db.galleryItems.findIndex((i) => i.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Gallery item not found" }, { status: 404 });
    }

    const validated = GalleryItemSchema.safeParse({ ...body, id });
    if (!validated.success) {
      return NextResponse.json({ success: false, error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
    }

    db.galleryItems[index] = validated.data;
    return NextResponse.json({ success: true, data: validated.data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = db.galleryItems.findIndex((i) => i.id === id);

  if (index === -1) {
    return NextResponse.json({ success: false, error: "Gallery item not found" }, { status: 404 });
  }

  db.galleryItems.splice(index, 1);
  return NextResponse.json({ success: true, message: "Gallery item deleted" });
}
