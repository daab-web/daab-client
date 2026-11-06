import { fetchAPI } from ".";
import { toApiError } from "./errors";

export interface ScientistInvitation {
  /** "invited": send `inviteUrl`; "active": the account already has a password. */
  status: "invited" | "active";
  email: string;
  inviteUrl: string | null;
  expiresAt: string | null;
}

/** Admin only: creates the scientist's sign-in account and a one-time set-password link. */
export async function inviteScientist(
  scientistId: string,
): Promise<ScientistInvitation> {
  const res = await fetchAPI(`/scientists/${scientistId}/invitation`, {
    method: "POST",
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("Sign in with an admin account to invite scientists.");
  }
  if (!res.ok) throw await toApiError(res, "Failed to create the invitation");

  return res.json();
}
