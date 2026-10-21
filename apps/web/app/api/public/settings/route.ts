import { NextResponse } from "next/server";
import { db } from "@/lib/mock-data";

export async function GET() {
  if (!db.settings.theme) {
    db.settings.theme = "white";
  }
  return NextResponse.json({
    success: true,
    data: db.settings,
  });
}
