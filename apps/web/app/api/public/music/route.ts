import { NextResponse } from "next/server";
import { getMusicItems } from "@/lib/supabase/service";

export async function GET() {
  try {
    const musicItems = await getMusicItems();
    return NextResponse.json({ success: true, data: musicItems });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch public music" }, { status: 500 });
  }
}
