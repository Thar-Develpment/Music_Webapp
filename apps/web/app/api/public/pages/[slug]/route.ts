import { NextResponse } from "next/server";
import { getPageContent } from "@/lib/supabase/service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (slug === "home" || slug === "about" || slug === "contact") {
    const data = await getPageContent(slug);
    return NextResponse.json({ success: true, data });
  }

  return NextResponse.json(
    { success: false, error: `Page '${slug}' not found` },
    { status: 404 }
  );
}
