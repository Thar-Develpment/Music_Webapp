import { NextResponse } from "next/server";
import { MediaAssetSchema, MediaAsset } from "@music-label/shared";
import { db } from "@/lib/mock-data";

export async function GET() {
  // Aggregate all media assets from gallery and site content
  const assets: MediaAsset[] = [];

  // Add gallery items media
  db.galleryItems.forEach((item) => {
    if (!assets.some((a) => a.url === item.media.url)) {
      assets.push(item.media);
    }
  });

  // Add artists
  db.artists.forEach((art) => {
    if (!assets.some((a) => a.url === art.photoUrl)) {
      assets.push({
        id: `med-${art.id}`,
        kind: "image",
        source: "url",
        url: art.photoUrl,
        title: `${art.name} Portrait`,
        alt: `${art.name} photo`,
      });
    }
  });

  // Add team
  db.teamMembers.forEach((tm) => {
    if (!assets.some((a) => a.url === tm.photoUrl)) {
      assets.push({
        id: `med-${tm.id}`,
        kind: "image",
        source: "url",
        url: tm.photoUrl,
        title: `${tm.name} Headshot`,
        alt: `${tm.name} photo`,
      });
    }
  });

  return NextResponse.json({ success: true, data: assets });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's adding by URL or simulated upload
    const newAsset: MediaAsset = {
      id: `med-${Date.now()}`,
      kind: body.kind || (body.url?.includes("youtu") || body.url?.includes("vimeo") ? "video" : "image"),
      source: body.source || "url",
      url: body.url,
      title: body.title || "Untitled Asset",
      alt: body.alt || "Media asset",
      provider: body.url?.includes("youtu") ? "youtube" : body.url?.includes("vimeo") ? "vimeo" : "direct",
      createdAt: new Date().toISOString(),
    };

    const validated = MediaAssetSchema.safeParse(newAsset);
    if (!validated.success) {
      return NextResponse.json({ success: false, error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: validated.data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process media" }, { status: 500 });
  }
}
