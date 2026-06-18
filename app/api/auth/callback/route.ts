import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

const SERVER = process.env.SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER!;
const ACCESS_TOKEN_MAX_AGE = 15 * 60; // matches backend access-token lifetime
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

// OAuth2.1 redirect target. Exchanges the authorization code for tokens
// server-side and stores them in HttpOnly cookies on this (the Next) origin.
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`/en/auth?error=${reason}`, origin));

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const jar = await cookies();
  const txRaw = jar.get("daab.oauth_tx")?.value;
  jar.delete("daab.oauth_tx");

  if (!code || !state || !txRaw) return fail("invalid_request");

  let tx: { verifier: string; state: string; redirectTo: string };
  try {
    tx = JSON.parse(txRaw);
  } catch {
    return fail("invalid_state");
  }
  if (tx.state !== state) return fail("state_mismatch");

  const form = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: `${origin}/api/auth/callback`,
    code_verifier: tx.verifier,
  });

  const tokenRes = await fetch(`${SERVER}/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form,
    cache: "no-store",
  });

  if (!tokenRes.ok) return fail("token_exchange_failed");

  const tokens = (await tokenRes.json()) as {
    access_token: string;
    refresh_token?: string;
  };

  const secure = process.env.NODE_ENV === "production";
  jar.set("daab.accessToken", tokens.access_token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE,
    secure,
  });
  if (tokens.refresh_token) {
    jar.set("daab.refreshToken", tokens.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_TOKEN_MAX_AGE,
      secure,
    });
  }

  const dest = tx.redirectTo?.startsWith("/") ? tx.redirectTo : "/admin";
  return NextResponse.redirect(new URL(dest, origin));
}
