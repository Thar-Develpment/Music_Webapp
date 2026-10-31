import { GalleryCategory, GalleryItem } from "@music-label/shared";
import { getSupabase } from "../config/supabase.js";
import { invalidateCache } from "../middleware/cache.middleware.js";
import { AppError, NotFoundError } from "../errors/app-error.js";

export async function getGalleryData() {
  const supabase = getSupabase();
  const [categoriesRes, itemsRes] = await Promise.all([
    supabase.from("gallery_categories").select("*").order("order_num", { ascending: true }),
    supabase.from("gallery_items").select("*").order("order_num", { ascending: true }),
  ]);

  const categories: GalleryCategory[] = (categoriesRes.data || []).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    order: c.order_num,
  }));

  const items: GalleryItem[] = (itemsRes.data || []).map((i) => ({
    id: i.id,
    categoryId: i.category_id,
    title: i.title,
    media: i.media,
    order: i.order_num,
  }));

  return { categories, items };
}

export async function createCategory(category: GalleryCategory): Promise<GalleryCategory> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("gallery_categories")
    .upsert({
      id: category.id,
      name: category.name,
      slug: category.slug,
      order_num: category.order,
    })
    .select()
    .single();

  if (error || !data) {
    throw new AppError(error?.message || "Failed to create category", 500);
  }

  invalidateCache("gallery");
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    order: data.order_num,
  };
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = getSupabase();
  const { data: items } = await supabase
    .from("gallery_items")
    .select("id")
    .eq("category_id", id);

  if (items && items.length > 0) {
    throw new AppError(
      `Cannot delete category: ${items.length} items are currently assigned to it.`,
      400
    );
  }

  const { error } = await supabase.from("gallery_categories").delete().eq("id", id);
  if (error) {
    throw new AppError(error.message, 500);
  }

  invalidateCache("gallery");
}

export async function upsertItem(item: GalleryItem): Promise<GalleryItem> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("gallery_items")
    .upsert({
      id: item.id,
      category_id: item.categoryId,
      title: item.title,
      media: item.media,
      order_num: item.order,
    })
    .select()
    .single();

  if (error || !data) {
    throw new AppError(error?.message || "Failed to save gallery item", 500);
  }

  invalidateCache("gallery");
  return {
    id: data.id,
    categoryId: data.category_id,
    title: data.title,
    media: data.media,
    order: data.order_num,
  };
}

export async function deleteItem(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) {
    throw new AppError(error.message, 500);
  }
  invalidateCache("gallery");
}

export async function reorderItems(orderedIds: string[]): Promise<void> {
  const supabase = getSupabase();
  for (let index = 0; index < orderedIds.length; index++) {
    const id = orderedIds[index];
    await supabase.from("gallery_items").update({ order_num: index + 1 }).eq("id", id);
  }
  invalidateCache("gallery");
}
