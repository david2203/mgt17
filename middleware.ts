import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, verifyToken } from "./lib/auth";

// Vägar som alltid är tillgängliga utan inloggning.
const PUBLIC_PATHS = ["/login", "/api/login", "/api/logout"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const session = await verifyToken(token);

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Adminvägar kräver adminroll.
  if (pathname.startsWith("/admin") && session.role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    url.searchParams.set("admin", "1");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Skydda allt utom statiska filer och Next-interna vägar.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
