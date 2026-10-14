import { NextResponse } from "next/server";
import { db } from "@/lib/mock-data";

export async function GET() {
  const sortedTeam = [...db.teamMembers].sort((a, b) => a.order - b.order);
  return NextResponse.json({
    success: true,
    data: sortedTeam,
  });
}
