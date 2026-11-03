import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || !session.value.startsWith("velvet_auth_session_")) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const expectedEmail = process.env.ADMIN_EMAIL || "admin@velvetnoir.com";

  return NextResponse.json({
    success: true,
    data: {
      id: "adm-velvet-noir-1",
      email: expectedEmail,
      role: "master_admin",
      name: "Velvet Noir Administrator",
    },
  });
}

export async function POST() {
  // Sign Out / Revoke session
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.delete("admin_session");
  return response;
}
