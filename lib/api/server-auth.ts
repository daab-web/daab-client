import "server-only";
import { cookies } from "next/headers";

// Server components call the backend directly (not through the BFF proxy), so
// they forward the session's access token themselves when one exists.
export async function authHeaders(): Promise<HeadersInit> {
  const token = (await cookies()).get("daab.accessToken")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
