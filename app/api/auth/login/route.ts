import crypto from "crypto";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

const SERVER = process.env.SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER!;
const CLIENT_ID = process.env.OAUTH_CLIENT_ID ?? "test-client-id";
const SCOPE = process.env.OAUTH_SCOPE ?? "openid profile";

function base64url(buf: Buffer) {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Kicks off the OAuth2.1 authorization-code + PKCE flow. The code_verifier and
// state are kept server-side in a short-lived HttpOnly cookie; only the
// derived code_challenge leaves the server.
export async function GET(req: NextRequest) {
  const redirectTo = req.nextUrl.searchParams.get("redirect") || "/admin";

  const verifier = base64url(crypto.randomBytes(32));
  const challenge = base64url(
    crypto.createHash("sha256").update(verifier).digest(),
  );
  const state = base64url(crypto.randomBytes(16));

  const jar = await cookies();
  jar.set("daab.oauth_tx", JSON.stringify({ verifier, state, redirectTo }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
    secure: process.env.NODE_ENV === "production",
  });

  const authorizeUrl = new URL(`${SERVER}/authorize`);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", CLIENT_ID);
  authorizeUrl.searchParams.set("code_challenge", challenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");
  authorizeUrl.searchParams.set(
    "redirect_uri",
    `${req.nextUrl.origin}/api/auth/callback`,
  );
  authorizeUrl.searchParams.set("scope", SCOPE);
  authorizeUrl.searchParams.set("state", state);

  return NextResponse.redirect(authorizeUrl);
}
