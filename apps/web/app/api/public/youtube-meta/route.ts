import { NextResponse } from "next/server";
import { fetchYouTubeMetadata, extractYouTubeId } from "@/lib/youtube";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url") || searchParams.get("v") || "";

    if (!url) {
      return NextResponse.json(
        { success: false, error: "Please provide a 'url' query parameter" },
        { status: 400 }
      );
    }

    const videoId = extractYouTubeId(url);
    if (!videoId) {
      return NextResponse.json(
        { success: false, error: "Invalid YouTube URL or Video ID" },
        { status: 400 }
      );
    }

    const meta = await fetchYouTubeMetadata(videoId);
    return NextResponse.json({ success: true, data: meta });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch YouTube metadata" },
      { status: 500 }
    );
  }
}

