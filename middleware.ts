import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter (for demo; use Redis in production)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // ✅ Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    const ip = request.ip || request.headers.get("x-forwarded-for") || "anonymous";
    const key = `${ip}:${pathname}`;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 60; // 60 requests per minute

    const record = rateLimit.get(key);
    if (record) {
      if (now > record.resetTime) {
        rateLimit.set(key, { count: 1, resetTime: now + windowMs });
      } else if (record.count >= maxRequests) {
        return NextResponse.json(
          { success: false, message: "Too many requests, please try again later." },
          { status: 429 }
        );
      } else {
        record.count++;
      }
    } else {
      rateLimit.set(key, { count: 1, resetTime: now + windowMs });
    }
  }

  // ✅ Security headers (already in next.config, but we can add more)
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // ✅ Public paths
  const publicPaths = ["/", "/login", "/signup", "/become-partner", "/about", "/blog", "/verify-email"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // ✅ Admin paths
  const isAdminPath = pathname.startsWith("/admin");

  if (isAdminPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Token verification happens inside the API routes
  }

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};