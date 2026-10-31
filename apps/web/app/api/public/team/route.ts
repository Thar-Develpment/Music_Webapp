import { NextResponse } from "next/server";
import { getTeamMembers } from "@/lib/supabase/service";

export async function GET() {
  const team = await getTeamMembers();
  return NextResponse.json({
    success: true,
    data: team,
  });
}
