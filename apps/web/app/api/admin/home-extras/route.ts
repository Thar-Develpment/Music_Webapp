import { NextResponse } from "next/server";
import {
  getCounters,
  getArtists,
  getManagers,
  getUpcomingProjects,
  getTestimonials,
  upsertCounter,
  upsertArtist,
  upsertManager,
  upsertUpcomingProject,
  upsertTestimonial,
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

export async function POST(request: Request) {
  try {
    const { type, item } = await request.json();

    if (type === "testimonial") {
      const current = await getTestimonials();
      const newItem = { ...item, id: item.id || `test-${Date.now()}`, order: current.length + 1 };
      const saved = await upsertTestimonial(newItem);
      return NextResponse.json({ success: true, data: saved });
    }

    if (type === "artist") {
      const current = await getArtists();
      const newItem = { ...item, id: item.id || `art-${Date.now()}`, order: current.length + 1 };
      const saved = await upsertArtist(newItem);
      return NextResponse.json({ success: true, data: saved });
    }

    if (type === "manager") {
      const current = await getManagers();
      const newItem = { ...item, id: item.id || `mgr-${Date.now()}`, order: current.length + 1 };
      const saved = await upsertManager(newItem);
      return NextResponse.json({ success: true, data: saved });
    }

    if (type === "upcomingProject") {
      const current = await getUpcomingProjects();
      const newItem = { ...item, id: item.id || `proj-${Date.now()}`, order: current.length + 1 };
      const saved = await upsertUpcomingProject(newItem);
      return NextResponse.json({ success: true, data: saved });
    }

    if (type === "counter") {
      const current = await getCounters();
      const newItem = { ...item, id: item.id || `cnt-${Date.now()}`, order: current.length + 1 };
      const saved = await upsertCounter(newItem);
      return NextResponse.json({ success: true, data: saved });
    }

    return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create item" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { type, items } = await request.json();

    if (type === "counters" && Array.isArray(items)) {
      await Promise.all(items.map((c) => upsertCounter(c)));
      const data = await getCounters();
      return NextResponse.json({ success: true, data });
    }
    if (type === "testimonials" && Array.isArray(items)) {
      await Promise.all(items.map((t) => upsertTestimonial(t)));
      const data = await getTestimonials();
      return NextResponse.json({ success: true, data });
    }
    if (type === "artists" && Array.isArray(items)) {
      await Promise.all(items.map((a) => upsertArtist(a)));
      const data = await getArtists();
      return NextResponse.json({ success: true, data });
    }
    if (type === "managers" && Array.isArray(items)) {
      await Promise.all(items.map((m) => upsertManager(m)));
      const data = await getManagers();
      return NextResponse.json({ success: true, data });
    }
    if (type === "upcomingProjects" && Array.isArray(items)) {
      await Promise.all(items.map((p) => upsertUpcomingProject(p)));
      const data = await getUpcomingProjects();
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ success: false, error: "Invalid collection update" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update collection" }, { status: 500 });
  }
}
