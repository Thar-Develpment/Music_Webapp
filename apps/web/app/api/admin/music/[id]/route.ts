import { NextResponse } from "next/server";
import { upsertMusicItem, deleteMusicItem } from "@/lib/supabase/service";
import { MusicItemSchema } from "@music-label/shared";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = MusicItemSchema.safeParse({ ...body, id });

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const saved = await upsertMusicItem(validated.data);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update music item" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteMusicItem(id);
    return NextResponse.json({ success: true, message: "Music item deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete music item" }, { status: 500 });
  }
}
