import { PagedResponse } from "@/types/paged-response";
import { Scientist, UpdateScientistRequest, UpdateScientistTranslationRequest } from "@/types/scientist";
import { fetchAPI } from ".";
import { Publication } from "@/types/publication";
import { SerializedEditorState } from "lexical";

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const body = await response.json();
    if (typeof body?.message === "string" && body.message.length > 0) {
      return body.message;
    }
  } catch {}

  return fallback;
}

function parseScientistDescription(
  description: unknown,
): SerializedEditorState | null {
  if (!description) {
    return null;
  }

  if (typeof description === "object") {
    return description as SerializedEditorState;
  }

  if (typeof description !== "string") {
    return null;
  }

  try {
    return JSON.parse(description) as SerializedEditorState;
  } catch {
    return null;
  }
}

export async function fetchScientists(
  locale: string,
  page: number = 1,
  pageSize: number = 20,
  search?: string,
  country?: string,
  area?: string,
): Promise<PagedResponse<Scientist>> {
  const params = new URLSearchParams({
    locale: locale,
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (search) {
    params.append("search", search);
  }

  if (country) {
    params.append("country", country);
  }

  if (area) {
    params.append("area", area);
  }

  const res = await fetchAPI(`/scientists?${params.toString()}`);

  const data: PagedResponse<Scientist> = await res.json();

  return data;
}

export async function fetchScientistById(idOrSlug: string, locale: string): Promise<Scientist> {
  const response = await fetchAPI(`/scientists/${idOrSlug}?locale=${locale}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch scientist: ${response.status}`);
  }

  const data = await response.json();

  return {
    ...data,
    description: parseScientistDescription(data.description),
  };
}

export async function fetchPublicationsByScientistId(
  id: string,
): Promise<Publication[]> {
  const response = await fetchAPI(`/scientists/${id}/publications`);
  if (!response.ok) return [];
  const data = await response.json();

  if (Array.isArray(data)) {
    return data as Publication[];
  }

  if (Array.isArray(data?.publications)) {
    return data.publications as Publication[];
  }

  if (Array.isArray(data?.items)) {
    return data.items as Publication[];
  }

  return [];
}

export async function createScientist(data: any) {
  const formData = new FormData();
  const { photo, orcId, ...rest } = data;

  Object.entries(rest).forEach(([key, value]) => {
    if (!value || value === "") return;

    if (key === "publications" && Array.isArray(value) && value.length > 0) {
      formData.append(key, JSON.stringify(value));
    } else if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
    } else {
      formData.append(key, value as string);
    }
  });

  if (orcId) {
    formData.append("orcid", orcId);
  }

  if (photo instanceof File) {
    formData.append("photo", photo);
  }

  const response = await fetchAPI("/scientists", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Failed to create scientist"),
    );
  }

  return (await response.json()) as Scientist;
}

export async function updateScientist(id: string, data: UpdateScientistRequest) {
  return fetchAPI(`/scientists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function updateScientistTranslation(id: string, locale: string, data: UpdateScientistTranslationRequest) {
  return fetchAPI(`/scientists/${id}/translations?locale=${locale}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function deleteScientist(id: string) {
  const response = await fetchAPI(`/scientists/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Failed to delete scientist"),
    );
  }

  return response;
}
