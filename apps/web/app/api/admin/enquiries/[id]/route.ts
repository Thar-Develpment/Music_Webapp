import { NextResponse } from "next/server";
import { deleteEnquiry, markEnquiryRead } from "@/lib/supabase/service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.markRead) {
      await markEnquiryRead(id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update enquiry" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteEnquiry(id);
    return NextResponse.json({ success: true, message: "Enquiry deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete enquiry" }, { status: 500 });
  }
}
