import { SessionUser } from "@/types/session";
import { fetchAPI } from ".";
import { toApiError } from "./errors";

/** The signed-in user, or null for anonymous visitors / expired sessions. */
export async function fetchSession(): Promise<SessionUser | null> {
  const res = await fetchAPI("/userinfo");
  if (res.status === 401 || res.status === 404) return null;
  if (!res.ok) throw await toApiError(res, "Failed to load session");
  return res.json();
}

/** URL that starts the sign-in flow and returns to `returnTo` afterwards. */
export const signInUrl = (returnTo: string) =>
  `/api/auth/login?redirect=${encodeURIComponent(returnTo)}`;
