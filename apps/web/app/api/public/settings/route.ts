import { NextResponse } from "next/server";
import { getSettings } from "@/lib/supabase/service";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({
    success: true,
    data: settings,
  });
}
