import { NextResponse } from "next/server";
import { upsertMovie, deleteMovie } from "@/lib/supabase/service";
import { MovieItemSchema } from "@music-label/shared";
import { fetchYouTubeMetadata, extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const movieData = { ...body, id };

    const videoId = extractYouTubeId(movieData.youtubeUrl);

    // Apply YouTube fallback if title, thumbnail, or description are empty
    if (videoId && (!movieData.title?.trim() || !movieData.thumbnailUrl?.trim() || !movieData.description?.trim())) {
      const meta = await fetchYouTubeMetadata(videoId);
      if (!movieData.title?.trim()) {
        movieData.title = meta.title || `YouTube Video (${videoId})`;
      }
      if (!movieData.thumbnailUrl?.trim()) {
        movieData.thumbnailUrl = meta.thumbnailUrl || getYouTubeThumbnail(videoId);
      }
      if (!movieData.description?.trim()) {
        movieData.description = meta.description || `Official video release from ${meta.author || "One Roof Studios"}.`;
      }
      if ((!movieData.director || movieData.director === "One Roof Studios") && meta.author) {
        movieData.director = meta.author;
      }
    }

    if (!movieData.thumbnailUrl?.trim() && videoId) {
      movieData.thumbnailUrl = getYouTubeThumbnail(videoId);
    }

    const validated = MovieItemSchema.safeParse(movieData);

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
