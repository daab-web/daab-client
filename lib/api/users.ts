import { PagedResponse } from "@/types/paged-response";
import { fetchAPI } from ".";
import { toApiError } from "./errors";

export interface AppUser {
  id: string;
  username: string;
  email: string | null;
  name: string;
  pictureUrl: string | null;
  roles: string[];
  /** False for Google-only accounts and invitations not yet accepted. */
  hasPassword: boolean;
  /** External sign-in providers linked to the account, e.g. "google". */
  providers: string[];
  createdAt: string;
}

/** Admin only. */
export async function fetchUsers(
  search: string,
  page = 1,
  pageSize = 20,
): Promise<PagedResponse<AppUser>> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  if (search.trim()) params.set("search", search.trim());

  const res = await fetchAPI(`/users?${params}`);
  if (!res.ok) throw await toApiError(res, "Failed to load users");
  return res.json();
}

/** Admin only: grants or removes a role (currently only "scientist" is assignable). */
export async function setUserRole(
  userId: string,
  role: string,
  granted: boolean,
): Promise<{ userId: string; roles: string[] }> {
  const res = await fetchAPI(
    `/users/${userId}/roles/${encodeURIComponent(role)}`,
    { method: granted ? "PUT" : "DELETE" },
  );
  if (!res.ok) throw await toApiError(res, "Failed to update the role");
  return res.json();
}
