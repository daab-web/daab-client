import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { publicOrigin } from "@/lib/origin";

const SERVER = process.env.SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER!;

async function clearSessionCookies() {
  const jar = await cookies();
  jar.delete("daab.accessToken");
  jar.delete("daab.refreshToken");
  jar.delete("daab.userId");
}

// Clears the session cookies set by the OAuth callback.
export async function POST() {
  await clearSessionCookies();
  return NextResponse.json({ ok: true });
}

// Full sign-out: clears the app cookies, then ends the backend sign-in session
// (otherwise the next sign-in would silently reuse the same account) and
// returns to the page given in `redirect`.
export async function GET(req: NextRequest) {
  await clearSessionCookies();

  const origin = publicOrigin(req);
  const redirect = req.nextUrl.searchParams.get("redirect");
  const returnTo = `${origin}${redirect?.startsWith("/") ? redirect : "/"}`;

  const logoutUrl = new URL(`${SERVER}/auth/logout`);
  logoutUrl.searchParams.set("returnUrl", returnTo);

  return NextResponse.redirect(logoutUrl);
}
