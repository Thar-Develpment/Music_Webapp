import { NextResponse } from "next/server";
import { upsertMovie, deleteMovie } from "@/lib/supabase/service";
import { MovieItemSchema } from "@music-label/shared";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = MovieItemSchema.safeParse({ ...body, id });

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const saved = await upsertMovie(validated.data);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update movie" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteMovie(id);
    return NextResponse.json({ success: true, message: "Movie deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete movie" }, { status: 500 });
  }
}
