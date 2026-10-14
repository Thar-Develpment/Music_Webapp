import { NextResponse } from "next/server";
import { SettingSchema } from "@music-label/shared";
import { db } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ success: true, data: db.settings });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validated = SettingSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ success: false, error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
    }
    db.settings = validated.data;
    return NextResponse.json({ success: true, data: db.settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
