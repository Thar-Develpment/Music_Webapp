import { NextResponse } from "next/server";
import { db } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      counters: db.counters,
      artists: db.artists,
      managers: db.managers,
      upcomingProjects: db.upcomingProjects,
      testimonials: db.testimonials,
    },
  });
}

// Universal update for home-extras items
export async function POST(request: Request) {
  try {
    const { type, item } = await request.json();

    if (type === "testimonial") {
      const newItem = { ...item, id: item.id || `test-${Date.now()}`, order: db.testimonials.length + 1 };
      db.testimonials.push(newItem);
      return NextResponse.json({ success: true, data: newItem });
    }

    if (type === "artist") {
      const newItem = { ...item, id: item.id || `art-${Date.now()}`, order: db.artists.length + 1 };
      db.artists.push(newItem);
      return NextResponse.json({ success: true, data: newItem });
    }

    if (type === "manager") {
      const newItem = { ...item, id: item.id || `mgr-${Date.now()}`, order: db.managers.length + 1 };
      db.managers.push(newItem);
      return NextResponse.json({ success: true, data: newItem });
    }

    if (type === "upcomingProject") {
      const newItem = { ...item, id: item.id || `proj-${Date.now()}`, order: db.upcomingProjects.length + 1 };
      db.upcomingProjects.push(newItem);
      return NextResponse.json({ success: true, data: newItem });
    }

    if (type === "counter") {
      const newItem = { ...item, id: item.id || `cnt-${Date.now()}`, order: db.counters.length + 1 };
      db.counters.push(newItem);
      return NextResponse.json({ success: true, data: newItem });
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
      db.counters = items;
      return NextResponse.json({ success: true, data: db.counters });
    }
    if (type === "testimonials" && Array.isArray(items)) {
      db.testimonials = items;
      return NextResponse.json({ success: true, data: db.testimonials });
    }
    if (type === "artists" && Array.isArray(items)) {
      db.artists = items;
      return NextResponse.json({ success: true, data: db.artists });
    }
    if (type === "managers" && Array.isArray(items)) {
      db.managers = items;
      return NextResponse.json({ success: true, data: db.managers });
    }
    if (type === "upcomingProjects" && Array.isArray(items)) {
      db.upcomingProjects = items;
      return NextResponse.json({ success: true, data: db.upcomingProjects });
    }

    return NextResponse.json({ success: false, error: "Invalid collection update" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update collection" }, { status: 500 });
  }
}
