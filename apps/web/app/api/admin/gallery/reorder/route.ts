import { NextResponse } from "next/server";
import { getGalleryItems, upsertGalleryItem } from "@/lib/supabase/service";

export async function PATCH(request: Request) {
  try {
    const { orderedIds } = await request.json();
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ success: false, error: "orderedIds must be an array" }, { status: 400 });
    }

    const items = await getGalleryItems();
    for (let index = 0; index < orderedIds.length; index++) {
      const id = orderedIds[index];
      const item = items.find((i) => i.id === id);
      if (item) {
        item.order = index + 1;
        await upsertGalleryItem(item);
      }
    }

    return NextResponse.json({ success: true, message: "Reordered successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to reorder items" }, { status: 500 });
  }
}
