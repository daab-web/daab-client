import { type NextRequest } from "next/server";

// Public-facing origin of the app. Behind a reverse proxy / container,
// `req.nextUrl.origin` resolves to the internal bind address (e.g.
// http://0.0.0.0:3000), which the browser can't reach. Prefer an explicit
// APP_URL, then forwarded headers, then the Host header.
export function publicOrigin(req: NextRequest): string {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");

  const proto =
    req.headers.get("x-forwarded-proto") ??
    req.nextUrl.protocol.replace(":", "");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");

  return host ? `${proto}://${host}` : req.nextUrl.origin;
}

// Whether the public-facing connection is HTTPS. Used to decide the `secure`
// cookie flag — forcing `secure` on a plain-HTTP deployment makes the browser
// silently drop the cookie.
export function isSecureRequest(req: NextRequest): boolean {
  return publicOrigin(req).startsWith("https://");
}
