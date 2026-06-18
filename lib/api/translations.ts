import { fetchAPI } from ".";

export type TranslationNamespace = "areas" | "countries" | "institutions";

export type TranslationName = { key: string; name: string };

export type TranslationEntryDetail = {
  nameEn: string;
  translations: { locale: string; name: string }[];
};

export type TranslationMutation = {
  namespace: TranslationNamespace;
  nameEn: string;
  previousNameEn?: string;
  translations: { locale: string; name: string }[];
};

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const body = await response.json();
    if (typeof body?.title === "string" && body.title.length > 0) {
      return body.title;
    }
    if (typeof body?.message === "string" && body.message.length > 0) {
      return body.message;
    }
  } catch {}

  return fallback;
}

export async function getTranslationNames(
  namespace: TranslationNamespace,
  locale = "en",
): Promise<TranslationName[]> {
  const response = await fetchAPI(
    `/translations/names?namespace=${namespace}&locale=${locale}`,
  );

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Failed to load translations"));
  }

  return (await response.json()) as TranslationName[];
}

export async function getTranslationEntry(
  namespace: TranslationNamespace,
  nameEn: string,
): Promise<TranslationEntryDetail | null> {
  const response = await fetchAPI(
    `/translations/entry?namespace=${namespace}&nameEn=${encodeURIComponent(nameEn)}`,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Failed to load translation"));
  }

  return (await response.json()) as TranslationEntryDetail;
}

export async function createTranslation(data: TranslationMutation) {
  const response = await fetchAPI("/translations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Failed to save translation"));
  }
}

export async function updateTranslation(data: TranslationMutation) {
  const response = await fetchAPI("/translations", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Failed to update translation"));
  }
}

export async function deleteTranslation(
  namespace: TranslationNamespace,
  nameEn: string,
) {
  const response = await fetchAPI("/translations", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ namespace, nameEn }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Failed to delete translation"));
  }
}
