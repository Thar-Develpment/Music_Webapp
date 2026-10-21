import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { SettingSchema } from "@music-label/shared";
import { db } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ success: true, data: db.settings });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Fast-track theme updates directly
    const newTheme = body.theme === "black" || body.theme === "white" ? body.theme : db.settings.theme || "white";
    db.settings.theme = newTheme;

    // Merge incoming changes with existing db.settings to allow partial updates like theme toggle
    const merged = { ...db.settings, ...body, theme: newTheme };
    const validated = SettingSchema.safeParse(merged);
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }
    db.settings = { ...validated.data, theme: newTheme };

    try {
      revalidatePath("/", "layout");
    } catch (e) {
      // quiet fallback in non-standard runtimes
    }

    const response = NextResponse.json({ success: true, data: db.settings });
    response.cookies.set("velvet_theme", db.settings.theme, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
