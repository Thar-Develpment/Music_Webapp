import { NextResponse } from "next/server";
import { getEnquiries } from "@/lib/supabase/service";

export async function GET() {
  const enquiries = await getEnquiries();
  return NextResponse.json({
    success: true,
    data: enquiries,
    meta: {
      total: enquiries.length,
      unread: enquiries.filter((e) => !e.readAt).length,
    },
  });
}
