import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { normalizeCanonicalPath } from "@/lib/metadata";

function shouldBypass(pathname: string): boolean {
  if (pathname === "/") {
    return false;
  }

  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/assets") ||
    pathname.endsWith(".xml") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".json") ||
    pathname.endsWith(".txt") ||
    pathname.includes(".")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  const normalizedPath = normalizeCanonicalPath(pathname);

  if (pathname === normalizedPath) {
    return NextResponse.next();
  }

  const redirectedUrl = request.nextUrl.clone();
  redirectedUrl.pathname = normalizedPath;

  return NextResponse.redirect(redirectedUrl, 308);
}

export const config = {
  matcher: "/:path*",
};
