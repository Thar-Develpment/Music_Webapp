import { NextResponse } from "next/server";
import {
  HomePageContentSchema,
  AboutPageContentSchema,
  ContactPageContentSchema,
} from "@music-label/shared";
import { updatePageContent } from "@/lib/supabase/service";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    if (slug === "home") {
      const validated = HomePageContentSchema.safeParse(body);
      if (!validated.success) {
        return NextResponse.json({ success: false, error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
      }
      const saved = await updatePageContent("home", validated.data);
      return NextResponse.json({ success: true, data: saved });
    }

    if (slug === "about") {
      const validated = AboutPageContentSchema.safeParse(body);
      if (!validated.success) {
        return NextResponse.json({ success: false, error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
      }
      const saved = await updatePageContent("about", validated.data);
      return NextResponse.json({ success: true, data: saved });
    }

    if (slug === "contact") {
      const validated = ContactPageContentSchema.safeParse(body);
      if (!validated.success) {
        return NextResponse.json({ success: false, error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
      }
      const saved = await updatePageContent("contact", validated.data);
      return NextResponse.json({ success: true, data: saved });
    }

    return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update page" }, { status: 500 });
  }
}
