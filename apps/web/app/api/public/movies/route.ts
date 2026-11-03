import { NextResponse } from "next/server";
import { getMovies } from "@/lib/supabase/service";

export async function GET() {
  try {
    const movies = await getMovies();
    return NextResponse.json({ success: true, data: movies });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch public movies" }, { status: 500 });
  }
}
