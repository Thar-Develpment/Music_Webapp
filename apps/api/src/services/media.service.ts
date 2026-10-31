import { MediaAsset } from "@music-label/shared";
import { getSupabase } from "../config/supabase.js";
import { AppError } from "../errors/app-error.js";

export async function getAllMediaAssets(): Promise<MediaAsset[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((r) => ({
    id: r.id,
    kind: r.kind,
    source: r.source,
    url: r.url,
    title: r.title,
    alt: r.alt,
    provider: r.provider || undefined,
    externalId: r.external_id || undefined,
    width: r.width || undefined,
    height: r.height || undefined,
    bytes: r.bytes || undefined,
    createdAt: r.created_at,
  }));
}

export async function uploadMediaFile(
  file: Express.Multer.File,
  metadata?: { title?: string; alt?: string }
): Promise<MediaAsset> {
  const supabase = getSupabase();
  const fileExt = file.originalname.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  // Upload to Supabase Storage 'media' bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("media")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (uploadError || !uploadData) {
    throw new AppError(uploadError?.message || "Failed to upload file to storage", 500);
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from("media").getPublicUrl(filePath);
  const publicUrl = urlData.publicUrl;

  const newAsset: MediaAsset = {
    id: `med-${Date.now()}`,
    kind: file.mimetype.startsWith("video/") ? "video" : "image",
    source: "upload",
    url: publicUrl,
    title: metadata?.title || file.originalname,
    alt: metadata?.alt || file.originalname,
    bytes: file.size,
    createdAt: new Date().toISOString(),
  };

  // Save to media_assets table
  await supabase.from("media_assets").insert({
    id: newAsset.id,
    kind: newAsset.kind,
    source: newAsset.source,
    url: newAsset.url,
    title: newAsset.title,
    alt: newAsset.alt,
    bytes: newAsset.bytes,
    created_at: newAsset.createdAt,
  });

  return newAsset;
}
