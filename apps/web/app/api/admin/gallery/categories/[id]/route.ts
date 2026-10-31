import { NextResponse } from "next/server";
import { deleteGalleryCategory, getGalleryItems } from "@/lib/supabase/service";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const items = await getGalleryItems();
  const usedCount = items.filter((i) => i.categoryId === id).length;

  if (usedCount > 0) {
    return NextResponse.json({
      success: false,
      error: `Cannot delete category: ${usedCount} items are currently assigned to it.`,
    }, { status: 400 });
  }

  await deleteGalleryCategory(id);
  return NextResponse.json({ success: true, message: "Category deleted" });
}
