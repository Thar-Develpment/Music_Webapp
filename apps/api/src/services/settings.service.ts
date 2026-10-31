import { Setting } from "@music-label/shared";
import { getSupabase } from "../config/supabase.js";
import { invalidateCache } from "../middleware/cache.middleware.js";
import { AppError } from "../errors/app-error.js";

export async function getSettings(): Promise<Setting> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", "default")
    .single();

  if (error || !data) {
    throw new AppError(error?.message || "Failed to load settings", 500);
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
    socialLinks: data.social_links,
  };
}

export async function updateSettings(updates: Partial<Setting>): Promise<Setting> {
  const supabase = getSupabase();
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
    throw new AppError(error?.message || "Failed to update settings", 500);
  }

  // Invalidate cached public settings
  invalidateCache("settings");

  return {
    siteName: data.site_name,
    logoUrl: data.logo_url,
    tagline: data.tagline,
    bookingEmail: data.booking_email,
    bookingPhone: data.booking_phone,
    address: data.address || undefined,
    footerText: data.footer_text,
    theme: data.theme === "black" ? "black" : "white",
    socialLinks: data.social_links,
  };
}
