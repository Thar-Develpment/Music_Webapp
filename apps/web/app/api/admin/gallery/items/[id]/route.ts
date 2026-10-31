import { NextResponse } from "next/server";
import { GalleryItemSchema } from "@music-label/shared";
import { deleteGalleryItem, upsertGalleryItem } from "@/lib/supabase/service";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validated = GalleryItemSchema.safeParse({ ...body, id });
    if (!validated.success) {
      return NextResponse.json({ success: false, error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
    }

    const saved = await upsertGalleryItem(validated.data);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteGalleryItem(id);
    return NextResponse.json({ success: true, message: "Gallery item deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 500 });
  }
}
