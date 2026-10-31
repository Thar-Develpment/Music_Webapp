import { NextResponse } from "next/server";
import { TeamMemberSchema } from "@music-label/shared";
import { getTeamMembers, upsertTeamMember } from "@/lib/supabase/service";

export async function GET() {
  const team = await getTeamMembers();
  return NextResponse.json({ success: true, data: team });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const team = await getTeamMembers();
    const newMember = {
      ...body,
      id: body.id || `tm-${Date.now()}`,
      order: team.length + 1,
    };

    const validated = TeamMemberSchema.safeParse(newMember);
    if (!validated.success) {
      return NextResponse.json({ success: false, error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
    }

    const saved = await upsertTeamMember(validated.data);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to add team member" }, { status: 500 });
  }
}
