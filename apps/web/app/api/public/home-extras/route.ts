import { NextResponse } from "next/server";
import { db } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      counters: [...db.counters].sort((a, b) => a.order - b.order),
      artists: [...db.artists].sort((a, b) => a.order - b.order),
      managers: [...db.managers].sort((a, b) => a.order - b.order),
      upcomingProjects: [...db.upcomingProjects].sort((a, b) => a.order - b.order),
      testimonials: [...db.testimonials].sort((a, b) => a.order - b.order),
    },
  });
}
