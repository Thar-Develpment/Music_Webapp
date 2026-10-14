import { NextResponse } from "next/server";
import { db } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (slug === "home") {
    return NextResponse.json({ success: true, data: db.homeContent });
  }
  if (slug === "about") {
    return NextResponse.json({ success: true, data: db.aboutContent });
  }
  if (slug === "contact") {
    return NextResponse.json({ success: true, data: db.contactContent });
  }

  return NextResponse.json(
    { success: false, error: `Page '${slug}' not found` },
    { status: 404 }
  );
}
