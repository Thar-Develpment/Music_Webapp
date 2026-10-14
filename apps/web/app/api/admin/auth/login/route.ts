import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // In frontend/mock mode: allow admin login
    if (email === "admin@velvetnoir.com" && password === "admin123") {
      const response = NextResponse.json({
        success: true,
        data: {
          id: "adm-1",
          email: "admin@velvetnoir.com",
          role: "admin",
          name: "Label Admin",
        },
      });

      // Set session cookie
      response.cookies.set("admin_session", "mock_admin_token_active", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 });
  }
}
