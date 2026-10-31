import { getSupabase } from "../config/supabase.js";
import { invalidateCache } from "../middleware/cache.middleware.js";
import { NotFoundError, AppError } from "../errors/app-error.js";

export async function getPageContent<T>(slug: string): Promise<T> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("page_contents")
    .select("content")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    throw new NotFoundError(`Page content for '${slug}' not found`);
  }

  return data.content as T;
}

export async function updatePageContent<T>(slug: string, content: T): Promise<T> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("page_contents")
    .upsert({
      slug,
      content,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error || !data) {
    throw new AppError(error?.message || `Failed to update page '${slug}'`, 500);
  }

  // Invalidate cache for this page
  invalidateCache(`pages/${slug}`);
  invalidateCache("pages");

  return data.content as T;
}
