import { NextResponse } from "next/server";
import { db } from "@/lib/mock-data";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = db.galleryCategories.findIndex((c) => c.id === id);
  if (index === -1) {
    return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
  }

  // Check if items use this category
  const usedCount = db.galleryItems.filter((i) => i.categoryId === id).length;
  if (usedCount > 0) {
    return NextResponse.json({
      success: false,
      error: `Cannot delete category: ${usedCount} items are currently assigned to it.`,
    }, { status: 400 });
  }

  db.galleryCategories.splice(index, 1);
  return NextResponse.json({ success: true, message: "Category deleted" });
}
