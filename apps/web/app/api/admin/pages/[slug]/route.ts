import { NextResponse } from "next/server";
import {
  HomePageContentSchema,
  AboutPageContentSchema,
  ContactPageContentSchema,
} from "@music-label/shared";
import { db } from "@/lib/mock-data";

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
      db.homeContent = validated.data;
      return NextResponse.json({ success: true, data: db.homeContent });
    }

    if (slug === "about") {
      const validated = AboutPageContentSchema.safeParse(body);
      if (!validated.success) {
        return NextResponse.json({ success: false, error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
      }
      db.aboutContent = validated.data;
      return NextResponse.json({ success: true, data: db.aboutContent });
    }

    if (slug === "contact") {
      const validated = ContactPageContentSchema.safeParse(body);
      if (!validated.success) {
        return NextResponse.json({ success: false, error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
      }
      db.contactContent = validated.data;
      return NextResponse.json({ success: true, data: db.contactContent });
    }

    return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update page" }, { status: 500 });
  }
}
