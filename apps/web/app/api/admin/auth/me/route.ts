import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== "mock_admin_token_active") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: "adm-1",
      email: "admin@velvetnoir.com",
      role: "admin",
      name: "Label Admin",
    },
  });
}

export async function POST() {
  // Logout
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.delete("admin_session");
  return response;
}
