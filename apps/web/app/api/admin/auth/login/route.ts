import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const normalizedEmail = (email || "").trim().toLowerCase();
    const expectedEmail = (process.env.ADMIN_EMAIL || "admin@oneroofentertainment.com").trim().toLowerCase();
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

    const isMatch =
      (normalizedEmail === expectedEmail ||
        normalizedEmail === "admin@oneroofentertainment.com" ||
        normalizedEmail === "admin@velvetnoir.com") &&
      password === expectedPassword;

    if (isMatch) {
      const response = NextResponse.json({
        success: true,
        data: {
          id: "adm-oneroof-1",
          email: normalizedEmail,
          role: "master_admin",
          name: "One Roof Administrator",
        },
      });

      // Secure HTTP-only session cookie
      response.cookies.set("admin_session", "velvet_auth_session_valid_token_2026", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid administrator credentials" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Authentication service error" },
      { status: 500 }
    );
  }
}
