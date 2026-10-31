import { NextResponse } from "next/server";
import {
  getCounters,
  getArtists,
  getManagers,
  getUpcomingProjects,
  getTestimonials,
} from "@/lib/supabase/service";

export async function GET() {
  const [counters, artists, managers, upcomingProjects, testimonials] = await Promise.all([
    getCounters(),
    getArtists(),
    getManagers(),
    getUpcomingProjects(),
    getTestimonials(),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      counters,
      artists,
      managers,
      upcomingProjects,
      testimonials,
    },
  });
}
