import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { SettingSchema } from "@music-label/shared";
import { getSettings, updateSettings } from "@/lib/supabase/service";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ success: true, data: settings });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const current = await getSettings();

    // Fast-track theme updates directly
    const newTheme = body.theme === "black" || body.theme === "white" ? body.theme : current.theme || "white";

    // Merge incoming changes with existing settings to allow partial updates like theme toggle
    const merged = { ...current, ...body, theme: newTheme };
    const validated = SettingSchema.safeParse(merged);
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await updateSettings(validated.data);

    try {
      revalidatePath("/", "layout");
    } catch (e) {
      // quiet fallback in non-standard runtimes
    }

    const response = NextResponse.json({ success: true, data: updated });
    response.cookies.set("velvet_theme", updated.theme, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
