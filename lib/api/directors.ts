import { fetchAPI } from ".";
import { Director } from "@/types/director";

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
  const response = await fetchAPI(`/directors?locale=${locale}`, {
    headers: {
      "Accept-Language": locale,
    },
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Failed to load directors"),
    );
  }

  const data = (await response.json()) as { directors?: Director[] };
  return Array.isArray(data.directors) ? data.directors : [];
}

export async function createDirector(data: {
  scientistId: string;
  enRole: string;
}): Promise<{ id: string }> {
  const payload = {
    scientistId: data.scientistId,
    translations: [
      {
        locale: "en",
        role: data.enRole,
      },
    ],
  };

  const response = await fetchAPI("/directors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Failed to assign director"),
    );
  }

  return (await response.json()) as { id: string };
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
