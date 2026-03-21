import { NextRequest, NextResponse } from "next/server";

const PUBLIC_LOCALES = ["fr", "en"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, static files, and _next
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Read locale preference from cookie or Accept-Language header
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const headerLocale = request.headers
    .get("accept-language")
    ?.split(",")[0]
    .split("-")[0];

  const locale =
    PUBLIC_LOCALES.includes(cookieLocale ?? "")
      ? cookieLocale
      : PUBLIC_LOCALES.includes(headerLocale ?? "")
      ? headerLocale
      : "fr"; // default to French for Cameroon

  // Set locale header for Server Components to read
  const response = NextResponse.next();
  response.headers.set("x-locale", locale!);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};