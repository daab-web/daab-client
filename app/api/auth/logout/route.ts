import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Clears the session cookies set by the OAuth callback.
export async function POST() {
  const jar = await cookies();
  jar.delete("daab.accessToken");
  jar.delete("daab.refreshToken");
  jar.delete("daab.userId");
  return NextResponse.json({ ok: true });
}
