import { NextResponse } from "next/server";
import { getMovies, upsertMovie } from "@/lib/supabase/service";
import { MovieItemInputSchema, MovieItem } from "@music-label/shared";

export async function GET() {
  try {
    const movies = await getMovies();
    return NextResponse.json({ success: true, data: movies });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch movies" }, { status: 500 });
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

    const newMovie: MovieItem = {
      ...validated.data,
      id: `mov-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    const saved = await upsertMovie(newMovie);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create movie" }, { status: 500 });
  }
}
