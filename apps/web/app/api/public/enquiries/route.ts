import { NextResponse } from "next/server";
import { EnquirySubmissionSchema } from "@music-label/shared";
import { createEnquiry } from "@/lib/supabase/service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = EnquirySubmissionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validated.error.flatten(),
        },
        { status: 400 }
      );
    }

    const newEnquiry = await createEnquiry(validated.data);

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully",
      data: newEnquiry,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
