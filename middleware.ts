import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || 
                request.headers.get("authorization")?.split(" ")[1];
  const { pathname } = request.nextUrl;

  // ✅ Public paths (no login required)
  const publicPaths = ["/", "/login", "/signup", "/become-partner", "/about", "/verify-email"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // ✅ Admin paths (only admin can access)
  const isAdminPath = pathname.startsWith("/admin");

  // ✅ If trying to access admin without token
  if (isAdminPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ✅ If trying to access protected page without token
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// ✅ Configure which paths should be handled by middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};