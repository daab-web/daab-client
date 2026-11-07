import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (process.env.ADMIN_DOMOY === "true") {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get("daab.accessToken");

    if (!sessionCookie) {
      const redirectUrl = new URL("/en/auth", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Admins get the whole panel; scientists only the Blogs tab; everyone else
    // is sent home. (UX gate only — the backend authorizes every call.)
    const roles = tokenRoles(sessionCookie.value);
    if (roles.includes("admin")) {
      return NextResponse.next();
    }

    if (roles.includes("scientist")) {
      const inBlogs =
        pathname === "/admin/blogs" || pathname.startsWith("/admin/blogs/");
      return inBlogs
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/admin/blogs", request.url));
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  return intlMiddleware(request);
}

// Reads the `roles` claim from the JWT payload without verifying the signature.
function tokenRoles(token: string): string[] {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const roles: unknown = JSON.parse(json).roles;
    if (Array.isArray(roles)) return roles.map(String);
    if (typeof roles === "string") return roles.split(",");
    return [];
  } catch {
    return [];
  }
}

export const config = {
  matcher: "/((?!api|trpc|test|_next|_vercel|.*\\..*).*)",
};
