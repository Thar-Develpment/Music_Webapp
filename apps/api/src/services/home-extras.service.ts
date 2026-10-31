import {
  Counter,
  Artist,
  Manager,
  UpcomingProject,
  Testimonial,
} from "@music-label/shared";
import { getSupabase } from "../config/supabase.js";
import { invalidateCache } from "../middleware/cache.middleware.js";
import { AppError } from "../errors/app-error.js";

export async function getAllHomeExtras() {
  const supabase = getSupabase();
  const [countersRes, artistsRes, managersRes, projectsRes, testimonialsRes] =
    await Promise.all([
      supabase.from("counters").select("*").order("order_num", { ascending: true }),
      supabase.from("artists").select("*").order("order_num", { ascending: true }),
      supabase.from("managers").select("*").order("order_num", { ascending: true }),
      supabase.from("upcoming_projects").select("*").order("order_num", { ascending: true }),
      supabase.from("testimonials").select("*").order("order_num", { ascending: true }),
    ]);

  const counters: Counter[] = (countersRes.data || []).map((r) => ({
    id: r.id,
    label: r.label,
    value: Number(r.value),
    suffix: r.suffix,
    order: r.order_num,
  }));

  const artists: Artist[] = (artistsRes.data || []).map((r) => ({
    id: r.id,
    name: r.name,
    genre: r.genre,
    photoUrl: r.photo_url,
    spotifyUrl: r.spotify_url || "",
    order: r.order_num,
  }));

  const managers: Manager[] = (managersRes.data || []).map((r) => ({
    id: r.id,
    name: r.name,
    role: r.role,
    photoUrl: r.photo_url,
    order: r.order_num,
  }));

  const upcomingProjects: UpcomingProject[] = (projectsRes.data || []).map((r) => ({
    id: r.id,
    title: r.title,
    releaseDate: r.release_date,
    category: r.category,
    coverUrl: r.cover_url,
    description: r.description,
    order: r.order_num,
  }));

  const testimonials: Testimonial[] = (testimonialsRes.data || []).map((r) => ({
    id: r.id,
    name: r.name,
    role: r.role,
    quote: r.quote,
    photoUrl: r.photo_url,
    order: r.order_num,
  }));

  return { counters, artists, managers, upcomingProjects, testimonials };
}

export async function createHomeExtraItem(type: string, item: Record<string, unknown>) {
  const supabase = getSupabase();
  let table = "";
  let payload: Record<string, unknown> = {};

  if (type === "counter") {
    table = "counters";
    payload = {
      id: item.id || `cnt-${Date.now()}`,
      label: item.label,
      value: item.value,
      suffix: item.suffix || "+",
      order_num: item.order || 0,
    };
  } else if (type === "artist") {
    table = "artists";
    payload = {
      id: item.id || `art-${Date.now()}`,
      name: item.name,
      genre: item.genre,
      photo_url: item.photoUrl,
      spotify_url: item.spotifyUrl || "",
      order_num: item.order || 0,
    };
  } else if (type === "manager") {
    table = "managers";
    payload = {
      id: item.id || `mgr-${Date.now()}`,
      name: item.name,
      role: item.role,
      photo_url: item.photoUrl,
      order_num: item.order || 0,
    };
  } else if (type === "upcomingProject") {
    table = "upcoming_projects";
    payload = {
      id: item.id || `proj-${Date.now()}`,
      title: item.title,
      release_date: item.releaseDate,
      category: item.category,
      cover_url: item.coverUrl,
      description: item.description || "",
      order_num: item.order || 0,
    };
  } else if (type === "testimonial") {
    table = "testimonials";
    payload = {
      id: item.id || `test-${Date.now()}`,
      name: item.name,
      role: item.role,
      quote: item.quote,
      photo_url: item.photoUrl,
      order_num: item.order || 0,
    };
  } else {
    throw new AppError(`Invalid home-extras item type: ${type}`, 400);
  }

  const { data, error } = await supabase.from(table).upsert(payload).select().single();
  if (error || !data) {
    throw new AppError(error?.message || "Failed to create item", 500);
  }

  invalidateCache("home-extras");
  return data;
}

export async function batchUpdateHomeExtras(type: string, items: Array<Record<string, unknown>>) {
  const supabase = getSupabase();

  if (type === "counters") {
    for (const c of items) {
      await supabase.from("counters").upsert({
        id: c.id,
        label: c.label,
        value: c.value,
        suffix: c.suffix,
        order_num: c.order,
      });
    }
  } else if (type === "artists") {
    for (const a of items) {
      await supabase.from("artists").upsert({
        id: a.id,
        name: a.name,
        genre: a.genre,
        photo_url: a.photoUrl,
        spotify_url: a.spotifyUrl || "",
        order_num: a.order,
      });
    }
  } else if (type === "managers") {
    for (const m of items) {
      await supabase.from("managers").upsert({
        id: m.id,
        name: m.name,
        role: m.role,
        photo_url: m.photoUrl,
        order_num: m.order,
      });
    }
  } else if (type === "upcomingProjects") {
    for (const p of items) {
      await supabase.from("upcoming_projects").upsert({
        id: p.id,
        title: p.title,
        release_date: p.releaseDate,
        category: p.category,
        cover_url: p.coverUrl,
        description: p.description,
        order_num: p.order,
      });
    }
  } else if (type === "testimonials") {
    for (const t of items) {
      await supabase.from("testimonials").upsert({
        id: t.id,
        name: t.name,
        role: t.role,
        quote: t.quote,
        photo_url: t.photoUrl,
        order_num: t.order,
      });
    }
  } else {
    throw new AppError(`Invalid batch type: ${type}`, 400);
  }

  invalidateCache("home-extras");
  return getAllHomeExtras();
}
