import { PagedResponse } from "@/types/paged-response";
import { Scientist } from "@/types/scientist";
import { fetchAPI } from ".";
import { Publication } from "@/types/publication";

export async function fetchScientists(
  page: number = 1,
  pageSize: number = 20,
  search?: string,
  country?: string,
  area?: string,
): Promise<PagedResponse<Scientist>> {
  const params = new URLSearchParams({
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

export async function fetchScientistById(idOrSlug: string) {
  const response = await fetchAPI(`/scientists/${idOrSlug}`);
  const scientist: Scientist = await response.json();

  return scientist;
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

  return fetchAPI("/scientists", {
    method: "POST",
    body: formData,
  });
}

export async function updateScientist(id: string, data: any) {
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

  return fetchAPI(`/scientists/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deleteScientist(id: string) {
  return fetchAPI(`/scientists/${id}`, {
    method: "DELETE",
  });
}
