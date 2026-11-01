import {
  Setting,
  Counter,
  HomePageContent,
  AboutPageContent,
  ContactPageContent,
  Artist,
  Manager,
  UpcomingProject,
  Testimonial,
  GalleryCategory,
  GalleryItem,
  TeamMember,
  MediaAsset,
  EnquiryRecord,
  EnquirySubmission,
  Track,
  CollectionItem,
} from "@music-label/shared";
import { getSupabaseAdmin, isSupabaseConfigured } from "./client";
import { db } from "../mock-data";

// ==========================================
// 1. SETTINGS
// ==========================================
export async function getSettings(): Promise<Setting> {
  if (!isSupabaseConfigured) return db.settings;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", "default")
      .single();

    if (error || !data) {
      console.warn("Supabase getSettings fallback:", error?.message);
      return db.settings;
    }

    return {
      siteName: data.site_name,
      logoUrl: data.logo_url,
      tagline: data.tagline,
      bookingEmail: data.booking_email,
      bookingPhone: data.booking_phone,
      address: data.address || undefined,
      footerText: data.footer_text,
      theme: data.theme === "black" ? "black" : "white",
      socialLinks: data.social_links || db.settings.socialLinks,
    };
  } catch (err) {
    console.error("Supabase getSettings error:", err);
    return db.settings;
  }
}

export async function updateSettings(updates: Partial<Setting>): Promise<Setting> {
  if (!isSupabaseConfigured) {
    db.settings = { ...db.settings, ...updates };
    return db.settings;
  }

  try {
    const supabase = getSupabaseAdmin();
    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (updates.siteName !== undefined) payload.site_name = updates.siteName;
    if (updates.logoUrl !== undefined) payload.logo_url = updates.logoUrl;
    if (updates.tagline !== undefined) payload.tagline = updates.tagline;
    if (updates.bookingEmail !== undefined) payload.booking_email = updates.bookingEmail;
    if (updates.bookingPhone !== undefined) payload.booking_phone = updates.bookingPhone;
    if (updates.address !== undefined) payload.address = updates.address;
    if (updates.footerText !== undefined) payload.footer_text = updates.footerText;
    if (updates.theme !== undefined) payload.theme = updates.theme;
    if (updates.socialLinks !== undefined) payload.social_links = updates.socialLinks;

    const { data, error } = await supabase
      .from("settings")
      .update(payload)
      .eq("id", "default")
      .select()
      .single();

    if (error || !data) {
      throw error || new Error("Failed to update settings");
    }

    const updated: Setting = {
      siteName: data.site_name,
      logoUrl: data.logo_url,
      tagline: data.tagline,
      bookingEmail: data.booking_email,
      bookingPhone: data.booking_phone,
      address: data.address || undefined,
      footerText: data.footer_text,
      theme: data.theme === "black" ? "black" : "white",
      socialLinks: data.social_links || db.settings.socialLinks,
    };
    db.settings = updated;
    return updated;
  } catch (err) {
    console.error("Supabase updateSettings error:", err);
    db.settings = { ...db.settings, ...updates };
    return db.settings;
  }
}

// ==========================================
// 2. PAGE CONTENTS (Home, About, Contact)
// ==========================================
export async function getPageContent<T>(slug: "home" | "about" | "contact"): Promise<T> {
  if (!isSupabaseConfigured) {
    if (slug === "home") return db.homeContent as T;
    if (slug === "about") return db.aboutContent as T;
    return db.contactContent as T;
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("page_contents")
      .select("content")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      if (slug === "home") return db.homeContent as T;
      if (slug === "about") return db.aboutContent as T;
      return db.contactContent as T;
    }

    return data.content as T;
  } catch (err) {
    if (slug === "home") return db.homeContent as T;
    if (slug === "about") return db.aboutContent as T;
    return db.contactContent as T;
  }
}

export async function updatePageContent(slug: "home" | "about" | "contact", content: unknown) {
  if (!isSupabaseConfigured) {
    if (slug === "home") db.homeContent = content as HomePageContent;
    if (slug === "about") db.aboutContent = content as AboutPageContent;
    if (slug === "contact") db.contactContent = content as ContactPageContent;
    return content;
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("page_contents")
      .upsert({
        slug,
        content,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    if (slug === "home") db.homeContent = content as HomePageContent;
    if (slug === "about") db.aboutContent = content as AboutPageContent;
    if (slug === "contact") db.contactContent = content as ContactPageContent;
    return data.content;
  } catch (err) {
    console.error(`Supabase updatePageContent(${slug}) error:`, err);
    if (slug === "home") db.homeContent = content as HomePageContent;
    if (slug === "about") db.aboutContent = content as AboutPageContent;
    if (slug === "contact") db.contactContent = content as ContactPageContent;
    return content;
  }
}

// ==========================================
// 3. ARTISTS
// ==========================================
export async function getArtists(): Promise<Artist[]> {
  if (!isSupabaseConfigured) return db.artists;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .order("order_num", { ascending: true });

    if (error || !data) return db.artists;
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      genre: row.genre,
      photoUrl: row.photo_url,
      spotifyUrl: row.spotify_url || "",
      order: row.order_num,
    }));
  } catch {
    return db.artists;
  }
}

export async function upsertArtist(artist: Artist): Promise<Artist> {
  if (!isSupabaseConfigured) {
    const idx = db.artists.findIndex((a) => a.id === artist.id);
    if (idx >= 0) db.artists[idx] = artist;
    else db.artists.push(artist);
    return artist;
  }
  const supabase = getSupabaseAdmin();
  await supabase.from("artists").upsert({
    id: artist.id,
    name: artist.name,
    genre: artist.genre,
    photo_url: artist.photoUrl,
    spotify_url: artist.spotifyUrl || "",
    order_num: artist.order,
  });
  return artist;
}

export async function deleteArtist(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    db.artists = db.artists.filter((a) => a.id !== id);
    return;
  }
  const supabase = getSupabaseAdmin();
  await supabase.from("artists").delete().eq("id", id);
}

// ==========================================
// 4. MANAGERS
// ==========================================
export async function getManagers(): Promise<Manager[]> {
  if (!isSupabaseConfigured) return db.managers;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("managers")
      .select("*")
      .order("order_num", { ascending: true });

    if (error || !data) return db.managers;
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      photoUrl: row.photo_url,
      order: row.order_num,
    }));
  } catch {
    return db.managers;
  }
}

export async function upsertManager(manager: Manager): Promise<Manager> {
  if (!isSupabaseConfigured) {
    const idx = db.managers.findIndex((m) => m.id === manager.id);
    if (idx >= 0) db.managers[idx] = manager;
    else db.managers.push(manager);
    return manager;
  }
  const supabase = getSupabaseAdmin();
  await supabase.from("managers").upsert({
    id: manager.id,
    name: manager.name,
    role: manager.role,
    photo_url: manager.photoUrl,
    order_num: manager.order,
  });
  return manager;
}

export async function deleteManager(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    db.managers = db.managers.filter((m) => m.id !== id);
    return;
  }
  const supabase = getSupabaseAdmin();
  await supabase.from("managers").delete().eq("id", id);
}

// ==========================================
// 5. UPCOMING PROJECTS
// ==========================================
export async function getUpcomingProjects(): Promise<UpcomingProject[]> {
  if (!isSupabaseConfigured) return db.upcomingProjects;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("upcoming_projects")
      .select("*")
      .order("order_num", { ascending: true });

    if (error || !data) return db.upcomingProjects;
    return data.map((row) => ({
      id: row.id,
      title: row.title,
      releaseDate: row.release_date,
      category: row.category,
      coverUrl: row.cover_url,
      description: row.description,
      order: row.order_num,
    }));
  } catch {
    return db.upcomingProjects;
  }
}

export async function upsertUpcomingProject(project: UpcomingProject): Promise<UpcomingProject> {
  if (!isSupabaseConfigured) {
    const idx = db.upcomingProjects.findIndex((p) => p.id === project.id);
    if (idx >= 0) db.upcomingProjects[idx] = project;
    else db.upcomingProjects.push(project);
    return project;
  }
  const supabase = getSupabaseAdmin();
  await supabase.from("upcoming_projects").upsert({
    id: project.id,
    title: project.title,
    release_date: project.releaseDate,
    category: project.category,
    cover_url: project.coverUrl,
    description: project.description,
    order_num: project.order,
  });
  return project;
}

export async function deleteUpcomingProject(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    db.upcomingProjects = db.upcomingProjects.filter((p) => p.id !== id);
    return;
  }
  const supabase = getSupabaseAdmin();
  await supabase.from("upcoming_projects").delete().eq("id", id);
}

// ==========================================
// 6. TESTIMONIALS
// ==========================================
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured) return db.testimonials;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("order_num", { ascending: true });

    if (error || !data) return db.testimonials;
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      quote: row.quote,
      photoUrl: row.photo_url,
      order: row.order_num,
    }));
  } catch {
    return db.testimonials;
  }
}

export async function upsertTestimonial(testimonial: Testimonial): Promise<Testimonial> {
  if (!isSupabaseConfigured) {
    const idx = db.testimonials.findIndex((t) => t.id === testimonial.id);
    if (idx >= 0) db.testimonials[idx] = testimonial;
    else db.testimonials.push(testimonial);
    return testimonial;
  }
  const supabase = getSupabaseAdmin();
  await supabase.from("testimonials").upsert({
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.role,
    quote: testimonial.quote,
    photo_url: testimonial.photoUrl,
    order_num: testimonial.order,
  });
  return testimonial;
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    db.testimonials = db.testimonials.filter((t) => t.id !== id);
    return;
  }
  const supabase = getSupabaseAdmin();
  await supabase.from("testimonials").delete().eq("id", id);
}

// ==========================================
// 7. COUNTERS
// ==========================================
export async function getCounters(): Promise<Counter[]> {
  if (!isSupabaseConfigured) return db.counters;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("counters")
      .select("*")
      .order("order_num", { ascending: true });

    if (error || !data) return db.counters;
    return data.map((row) => ({
      id: row.id,
      label: row.label,
      value: Number(row.value),
      suffix: row.suffix,
      order: row.order_num,
    }));
  } catch {
    return db.counters;
  }
}

export async function upsertCounter(counter: Counter): Promise<Counter> {
  if (!isSupabaseConfigured) {
    const idx = db.counters.findIndex((c) => c.id === counter.id);
    if (idx >= 0) db.counters[idx] = counter;
    else db.counters.push(counter);
    return counter;
  }
  const supabase = getSupabaseAdmin();
  await supabase.from("counters").upsert({
    id: counter.id,
    label: counter.label,
    value: counter.value,
    suffix: counter.suffix,
    order_num: counter.order,
  });
  return counter;
}

// ==========================================
// 8. GALLERY CATEGORIES & ITEMS
// ==========================================
export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  if (!isSupabaseConfigured) return db.galleryCategories;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("gallery_categories")
      .select("*")
      .order("order_num", { ascending: true });

    if (error || !data) return db.galleryCategories;
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      order: row.order_num,
    }));
  } catch {
    return db.galleryCategories;
  }
}

export async function upsertGalleryCategory(category: GalleryCategory): Promise<GalleryCategory> {
  if (!isSupabaseConfigured) {
    const idx = db.galleryCategories.findIndex((c) => c.id === category.id);
    if (idx >= 0) db.galleryCategories[idx] = category;
    else db.galleryCategories.push(category);
    return category;
  }
  const supabase = getSupabaseAdmin();
  await supabase.from("gallery_categories").upsert({
    id: category.id,
    name: category.name,
    slug: category.slug,
    order_num: category.order,
  });
  return category;
}

export async function deleteGalleryCategory(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    db.galleryCategories = db.galleryCategories.filter((c) => c.id !== id);
    return;
  }
  const supabase = getSupabaseAdmin();
  await supabase.from("gallery_categories").delete().eq("id", id);
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured) return db.galleryItems;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("order_num", { ascending: true });

    if (error || !data) return db.galleryItems;
    return data.map((row) => ({
      id: row.id,
      categoryId: row.category_id,
      title: row.title,
      media: row.media,
      order: row.order_num,
    }));
  } catch {
    return db.galleryItems;
  }
}

export async function upsertGalleryItem(item: GalleryItem): Promise<GalleryItem> {
  if (!isSupabaseConfigured) {
    const idx = db.galleryItems.findIndex((i) => i.id === item.id);
    if (idx >= 0) db.galleryItems[idx] = item;
    else db.galleryItems.push(item);
    return item;
  }
  const supabase = getSupabaseAdmin();
  await supabase.from("gallery_items").upsert({
    id: item.id,
    category_id: item.categoryId,
    title: item.title,
    media: item.media,
    order_num: item.order,
  });
  return item;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    db.galleryItems = db.galleryItems.filter((i) => i.id !== id);
    return;
  }
  const supabase = getSupabaseAdmin();
  await supabase.from("gallery_items").delete().eq("id", id);
}

// ==========================================
// 9. TEAM MEMBERS (Documentary Crew)
// ==========================================
export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!isSupabaseConfigured) return db.teamMembers;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("order_num", { ascending: true });

    if (error || !data) return db.teamMembers;
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      bio: row.bio,
      photoUrl: row.photo_url,
      order: row.order_num,
    }));
  } catch {
    return db.teamMembers;
  }
}

export async function upsertTeamMember(member: TeamMember): Promise<TeamMember> {
  if (!isSupabaseConfigured) {
    const idx = db.teamMembers.findIndex((m) => m.id === member.id);
    if (idx >= 0) db.teamMembers[idx] = member;
    else db.teamMembers.push(member);
    return member;
  }
  const supabase = getSupabaseAdmin();
  await supabase.from("team_members").upsert({
    id: member.id,
    name: member.name,
    role: member.role,
    bio: member.bio,
    photo_url: member.photoUrl,
    order_num: member.order,
  });
  return member;
}

export async function deleteTeamMember(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    db.teamMembers = db.teamMembers.filter((m) => m.id !== id);
    return;
  }
  const supabase = getSupabaseAdmin();
  await supabase.from("team_members").delete().eq("id", id);
}

// ==========================================
// 10. MEDIA ASSETS
// ==========================================
export async function getMediaAssets(): Promise<MediaAsset[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data.map((row) => ({
      id: row.id,
      kind: row.kind,
      source: row.source,
      url: row.url,
      title: row.title,
      alt: row.alt,
      provider: row.provider || undefined,
      externalId: row.external_id || undefined,
      width: row.width || undefined,
      height: row.height || undefined,
      bytes: row.bytes || undefined,
      createdAt: row.created_at,
    }));
  } catch {
    return [];
  }
}

export async function upsertMediaAsset(asset: MediaAsset): Promise<MediaAsset> {
  if (!isSupabaseConfigured) return asset;
  const supabase = getSupabaseAdmin();
  await supabase.from("media_assets").upsert({
    id: asset.id,
    kind: asset.kind,
    source: asset.source,
    url: asset.url,
    title: asset.title,
    alt: asset.alt,
    provider: asset.provider || null,
    external_id: asset.externalId || null,
    width: asset.width || null,
    height: asset.height || null,
    bytes: asset.bytes || null,
    created_at: asset.createdAt || new Date().toISOString(),
  });
  return asset;
}

// ==========================================
// 11. ENQUIRIES (Contact Transmissions)
// ==========================================
export async function getEnquiries(): Promise<EnquiryRecord[]> {
  if (!isSupabaseConfigured) return db.enquiries;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return db.enquiries;
    return data.map((row) => ({
      id: row.id,
      firstName: row.first_name,
      email: row.email,
      phone: row.phone,
      message: row.message,
      createdAt: row.created_at,
      readAt: row.read_at,
    }));
  } catch {
    return db.enquiries;
  }
}

export async function createEnquiry(submission: EnquirySubmission): Promise<EnquiryRecord> {
  const newRecord: EnquiryRecord = {
    id: `enq-${Math.random().toString(36).substring(2, 9)}`,
    ...submission,
    createdAt: new Date().toISOString(),
    readAt: null,
  };

  if (!isSupabaseConfigured) {
    db.enquiries.unshift(newRecord);
    return newRecord;
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("enquiries")
      .insert({
        first_name: submission.firstName,
        email: submission.email,
        phone: submission.phone,
        message: submission.message,
      })
      .select()
      .single();

    if (error || !data) {
      db.enquiries.unshift(newRecord);
      return newRecord;
    }

    const created: EnquiryRecord = {
      id: data.id,
      firstName: data.first_name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      createdAt: data.created_at,
      readAt: data.read_at,
    };
    db.enquiries.unshift(created);
    return created;
  } catch {
    db.enquiries.unshift(newRecord);
    return newRecord;
  }
}

export async function markEnquiryRead(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    const item = db.enquiries.find((e) => e.id === id);
    if (item) item.readAt = new Date().toISOString();
    return;
  }
  const supabase = getSupabaseAdmin();
  await supabase
    .from("enquiries")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id);
}

export async function deleteEnquiry(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    db.enquiries = db.enquiries.filter((e) => e.id !== id);
    return;
  }
  const supabase = getSupabaseAdmin();
  await supabase.from("enquiries").delete().eq("id", id);
}

// ==========================================
// 8. TRACKS & COLLECTIONS
// ==========================================
export async function getTracks(): Promise<Track[]> {
  return db.tracks;
}

export async function getCollections(): Promise<CollectionItem[]> {
  return db.collections;
}

export async function getCollectionById(id: string): Promise<CollectionItem | null> {
  return db.collections.find((c) => c.id === id) || null;
}
