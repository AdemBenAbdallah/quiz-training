import { NextRequest, NextResponse } from "next/server";

const authRequiredRoutes = ["/payment"];

const publicPaths = [
  "/",
  "/certificates",
  "/[certificate]/",
  "/api/auth",
  "/api/health",
  "/_next",
  "/api/chat-public",
  "/sitemap.xml",
  "/opengraph-image",
  "/twitter-image",
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isStaticAsset = pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|woff|woff2)$/i);

  if (isStaticAsset) {
    return NextResponse.next();
  }

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  if (isPublicPath) {
    return NextResponse.next();
  }

  const isAuthRequiredRoute = authRequiredRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const cookies = request.cookies.get("better-auth.session_token");

  if (isAuthRequiredRoute && !cookies) {
    const isApiRoute = pathname.startsWith("/api");
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(
      new URL("/", request.url),
    );
  }

  return NextResponse.next();
}
