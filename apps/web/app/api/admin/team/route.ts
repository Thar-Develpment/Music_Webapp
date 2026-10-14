import { NextResponse } from "next/server";
import { TeamMemberSchema } from "@music-label/shared";
import { db } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ success: true, data: db.teamMembers });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newMember = {
      ...body,
      id: body.id || `tm-${Date.now()}`,
      order: db.teamMembers.length + 1,
    };

    const validated = TeamMemberSchema.safeParse(newMember);
    if (!validated.success) {
      return NextResponse.json({ success: false, error: "Validation failed", details: validated.error.flatten() }, { status: 400 });
    }

    db.teamMembers.push(validated.data);
    return NextResponse.json({ success: true, data: validated.data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to add team member" }, { status: 500 });
  }
}
