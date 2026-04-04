import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/citizen",
  "/auth/callback",
  "/auth/forgot-password",
];

const ROLE_PATHS: Record<string, string[]> = {
  "/dashboard":  ["citizen", "city_admin", "super_admin"],
  "/report":     ["citizen", "city_admin", "super_admin"],
  "/incidents":  ["citizen", "city_admin", "super_admin"],
  "/profile":    ["citizen", "city_admin", "super_admin"],
  "/map":        ["city_admin", "super_admin"],
  "/platform":   ["super_admin"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, _next
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Set locale header
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const headerLocale = request.headers.get("accept-language")
    ?.split(",")[0].split("-")[0];
  const locale =
    cookieLocale === "en" ? "en" :
    headerLocale === "en" ? "en" : "fr";

  const response = NextResponse.next();
  response.headers.set("x-locale", locale);

  // Public paths — no auth needed
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return response;
  }

  // Check for auth cookie / token
  // Note: full JWT validation happens in FastAPI
  // Middleware just checks presence of token for quick redirect
  const authCookie = request.cookies.get("civicpulse-auth")?.value;
  if (!authCookie) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("reason", "unauthenticated");
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};