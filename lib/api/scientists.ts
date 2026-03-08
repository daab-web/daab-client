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
  const publications: Publication[] = await response.json();
  return publications;
}

export async function createScientist(data: any) {
  return fetchAPI("/scientists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
}

export async function updateScientist(id: string, data: any) {
  return fetchAPI(`/scientists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
}

export async function deleteScientist(id: string) {
  return fetchAPI(`/scientists/${id}`, {
    method: "DELETE"
  });
}
