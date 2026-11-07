import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { upsertMovie, deleteMovie } from "@/lib/supabase/service";
import { isSupabaseConfigured } from "@/lib/supabase/client";
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

    try {
      revalidatePath("/movies");
      revalidatePath("/admin/movies");
      revalidatePath("/");
      revalidatePath("/api/public/movies");
    } catch (e) {
      // quiet
    }

    return NextResponse.json({ success: true, data: saved, isSupabaseConfigured });
  } catch (error: any) {
    console.error("PUT /api/admin/movies/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update movie" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteMovie(id);

    try {
      revalidatePath("/movies");
      revalidatePath("/admin/movies");
      revalidatePath("/");
      revalidatePath("/api/public/movies");
    } catch (e) {
      // quiet
    }

    return NextResponse.json({
      success: true,
      message: "Movie deleted successfully",
      isSupabaseConfigured,
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/movies/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete movie" },
      { status: 500 }
    );
  }
}
