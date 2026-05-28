import { fetchAPI } from ".";
import { Director, UntranslatedDirectorEntry } from "@/types/director";

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const body = await response.json();
    if (typeof body?.message === "string" && body.message.length > 0) {
      return body.message;
    }
  } catch {}

  return fallback;
}

export async function fetchDirectors(locale: string): Promise<Director[]> {
  const response = await fetchAPI(`/directors`, {
    headers: {
      "Accept-Language": locale
    }
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Failed to load directors"),
    );
  }

  const data = (await response.json()) as { directors?: Director[] };
  return Array.isArray(data.directors) ? data.directors : [];
}

export async function fetchUntranslatedDirectors(): Promise<UntranslatedDirectorEntry[]> {
  const res = await fetchAPI('/directors/untranslated');

  if (!res.ok) {
    throw new Error(`Failed to fetch directors. Message: ${res.status}`)
  }

  return res.json()
}

export async function createDirector(data: {
  scientistId: string;
  translations: { locale: string, role: string }[];
}): Promise<{ id: string }> {
  const response = await fetchAPI("/directors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Failed to assign director"),
    );
  }

  return (await response.json()) as { id: string };
}

export async function publishDirector(data: { directorIds: string[] }) {
  const res = await fetchAPI('/directors', {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error(`Failed to publish directors. Message: ${res.status}`)
  }
}

export async function updateDirector(data: { locale: string, directorId: string, role: string }) {
  const response = await fetchAPI(`/directors/${data.directorId}/${data.locale}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role: data.role }),
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Failed to update director"),
    );
  }
}

export async function deleteDirector(id: string) {
  const response = await fetchAPI(`/directors/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Failed to delete director"),
    );
  }

  return response;
}
