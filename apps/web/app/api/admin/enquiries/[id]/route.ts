import { NextResponse } from "next/server";
import { db } from "@/lib/mock-data";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const enquiry = db.enquiries.find((e) => e.id === id);

    if (!enquiry) {
      return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
    }

    const body = await request.json();
    if (body.markRead) {
      enquiry.readAt = new Date().toISOString();
    } else if (body.markUnread) {
      enquiry.readAt = null;
    }

    return NextResponse.json({ success: true, data: enquiry });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update enquiry" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = db.enquiries.findIndex((e) => e.id === id);

  if (index === -1) {
    return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
  }

  db.enquiries.splice(index, 1);
  return NextResponse.json({ success: true, message: "Enquiry deleted" });
}
