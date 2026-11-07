import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${cleanName}`;

    // 1. Production Scalable Storage: Supabase Storage Bucket
    if (isSupabaseConfigured) {
      try {
        const supabase = getSupabaseAdmin();
        const storagePath = `uploads/${filename}`;

        let uploadResult = await supabase.storage
          .from("media")
          .upload(storagePath, buffer, {
            contentType: file.type || "application/octet-stream",
            upsert: true,
          });

        // Auto-create bucket if missing
        if (
          uploadResult.error &&
          (uploadResult.error.message.includes("Bucket not found") ||
            uploadResult.error.message.includes("does not exist"))
        ) {
          try {
            await supabase.storage.createBucket("media", { public: true });
            uploadResult = await supabase.storage.from("media").upload(storagePath, buffer, {
              contentType: file.type || "application/octet-stream",
              upsert: true,
            });
          } catch (createErr) {
            console.warn("Could not auto-create 'media' bucket:", createErr);
          }
        }

        if (!uploadResult.error) {
          const { data: urlData } = supabase.storage.from("media").getPublicUrl(storagePath);
          const cdnUrl = urlData.publicUrl;

          // Register in media_assets registry
          try {
            await supabase.from("media_assets").insert({
              id: `med-${timestamp.toString(36)}`,
              kind: file.type.startsWith("video") ? "video" : "image",
              source: "upload",
              url: cdnUrl,
              title: file.name,
              alt: file.name,
              bytes: file.size,
            });
          } catch (e) {
            // non-blocking
          }

          return NextResponse.json({
            success: true,
            url: cdnUrl,
            storage: "supabase",
            name: file.name,
            size: file.size,
            type: file.type,
          });
        }

        console.warn("Supabase storage upload failed, falling back to local:", uploadResult.error.message);
      } catch (sbErr) {
        console.warn("Supabase storage upload exception, falling back to local:", sbErr);
      }
    }

    // 2. Local Development Fallback: Write to public/uploads
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/${filename}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        storage: "local",
        name: file.name,
        size: file.size,
        type: file.type,
      });
    } catch (fsErr: any) {
      console.error("Local disk upload failed:", fsErr);
      return NextResponse.json(
        {
          success: false,
          error:
            "File upload failed. In production, ensure the 'media' bucket is created in Supabase Storage.",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "File upload failed" },
      { status: 500 }
    );
  }
}
