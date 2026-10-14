import { NextResponse } from "next/server";
import { db } from "@/lib/mock-data";

export async function PATCH(request: Request) {
  try {
    const { orderedIds } = await request.json();
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ success: false, error: "orderedIds must be an array" }, { status: 400 });
    }

    orderedIds.forEach((id: string, index: number) => {
      const item = db.galleryItems.find((i) => i.id === id);
      if (item) {
        item.order = index + 1;
      }
    });

    return NextResponse.json({ success: true, message: "Reordered successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to reorder items" }, { status: 500 });
  }
}
