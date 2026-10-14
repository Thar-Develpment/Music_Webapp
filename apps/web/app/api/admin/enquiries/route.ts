import { NextResponse } from "next/server";
import { db } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: db.enquiries,
    meta: {
      total: db.enquiries.length,
      unread: db.enquiries.filter((e) => !e.readAt).length,
    },
  });
}
