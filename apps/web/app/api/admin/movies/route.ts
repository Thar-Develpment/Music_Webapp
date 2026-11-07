import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getMovies, upsertMovie } from "@/lib/supabase/service";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { MovieItemInputSchema, MovieItem } from "@music-label/shared";
import { fetchYouTubeMetadata, extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";

export async function GET() {
  try {
    const movies = await getMovies();
    return NextResponse.json({
      success: true,
      data: movies,
      isSupabaseConfigured,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch movies" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = MovieItemInputSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const movieData = { ...validated.data };
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

    // Safety fallback
    if (!movieData.thumbnailUrl?.trim() && videoId) {
      movieData.thumbnailUrl = getYouTubeThumbnail(videoId);
    }
    if (!movieData.title?.trim()) {
      movieData.title = videoId ? `YouTube Video (${videoId})` : "Untitled Release";
    }
    if (!movieData.description?.trim()) {
      movieData.description = "Official video presentation.";
    }

    const newMovie: MovieItem = {
      ...movieData,
      id: `mov-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    const saved = await upsertMovie(newMovie);

    // Instantly invalidate caches so production reflects changes immediately
    try {
      revalidatePath("/movies");
      revalidatePath("/admin/movies");
      revalidatePath("/");
      revalidatePath("/api/public/movies");
    } catch (e) {
      // quiet in non-request contexts
    }

    return NextResponse.json(
      { success: true, data: saved, isSupabaseConfigured },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/admin/movies error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create movie" },
      { status: 500 }
    );
  }
}
