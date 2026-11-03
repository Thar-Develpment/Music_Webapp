import { NextResponse } from "next/server";
import { getMusicItems, upsertMusicItem } from "@/lib/supabase/service";
import { MusicItemInputSchema, MusicItem } from "@music-label/shared";

export async function GET() {
  try {
    const musicItems = await getMusicItems();
    return NextResponse.json({ success: true, data: musicItems });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch music items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = MusicItemInputSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const newMusic: MusicItem = {
      ...validated.data,
      id: `mus-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    const saved = await upsertMusicItem(newMusic);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create music item" }, { status: 500 });
  }
}
