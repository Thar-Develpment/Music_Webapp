import { NextResponse } from "next/server";
import { TeamMemberSchema } from "@music-label/shared";
import { deleteTeamMember, upsertTeamMember } from "@/lib/supabase/service";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validated = TeamMemberSchema.safeParse({ ...body, id });
    if (!validated.success) {
      return NextResponse.json({ success: false, error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
    }

    const saved = await upsertTeamMember(validated.data);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update team member" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteTeamMember(id);
    return NextResponse.json({ success: true, message: "Team member removed" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to remove team member" }, { status: 500 });
  }
}
