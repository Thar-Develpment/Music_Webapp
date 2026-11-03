import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow login endpoints without authentication
  if (pathname === "/admin/login" || pathname === "/api/admin/auth/login") {
    // If user already has a valid session and visits /admin/login, redirect to /admin
    const session = request.cookies.get("admin_session");
    if (session && session.value.startsWith("velvet_auth_session_") && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // 2. Protect Admin API endpoints (/api/admin/*)
  if (pathname.startsWith("/api/admin")) {
    const session = request.cookies.get("admin_session");
    if (!session || !session.value.startsWith("velvet_auth_session_")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access — Admin session required" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 3. Protect Admin UI routes (/admin/* and /admin)
  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get("admin_session");
    if (!session || !session.value.startsWith("velvet_auth_session_")) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
