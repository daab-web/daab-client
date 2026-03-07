import { Application } from "@/types/application";
import { News } from "@/types/news";
import { PagedResponse } from "@/types/paged-response";
import { Publication } from "@/types/publication";
import { Scientist } from "@/types/scientist";

const apiBase = process.env.NEXT_PUBLIC_SERVER;

export async function fetchAPI(
  endpoint: string,
  options?: RequestInit,
): Promise<Response> {
  const buildRequest = (): RequestInit => {
    const headers = new Headers(options?.headers);

    return {
      ...options,
      credentials: "include",
      headers,
    };
  };

  let res = await fetch(`${apiBase}${endpoint}`, buildRequest());

  if (res.status === 401) {
    const refreshed = await refreshToken(options?.headers);

    if (!refreshed) {
    }

    res = await fetch(`${apiBase}${endpoint}`, buildRequest());
  }

  return res;
}

async function refreshToken(headers?: HeadersInit): Promise<boolean> {
  const res = await fetch(`${apiBase}/auth/refresh-token`, {
    method: "POST",
    cache: "no-cache",
    credentials: "include",
    headers: {
      ...headers,
    },
  });

  return res.ok;
}

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

export async function fetchCountries(): Promise<string[]> {
  const res = await fetchAPI("/countries");

  const data: { countries: string[] } = await res.json();

  return data.countries;
}

export async function fetchAreas(): Promise<string[]> {
  const res = await fetchAPI("/areas");

  const data: { areas: string[] } = await res.json();

  return data.areas;
}

export async function fetchApplications(
  page: number = 1,
  pageSize: number = 20,
): Promise<PagedResponse<Application>> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  const res = await fetchAPI(`/applications?${params.toString()}`);

  const data = await res.json();

  return data;
}

export async function submitApplication(data: any) {
  return fetchAPI("/applications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function approveApplication(applicationId: string) {
  return fetchAPI(`/applications/${applicationId}/approve`, {
    method: "PUT",
  });
}

export async function fetchNews(
  page: number = 1,
  pageSize: number = 20,
): Promise<PagedResponse<News>> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  const response = await fetchAPI(`/news?${params.toString()}`);
  const data: PagedResponse<News> = await response.json();

  return data;
}

export async function getNewsByIdOrSlug(idOrSlug: string) {
  const response = await fetchAPI(`/news/${idOrSlug}`);
  const news: News = await response.json();

  return news;
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
    body: JSON.stringify(data),
  });
}

export async function updateScientist(id: string, data: any) {
  return fetchAPI(`/scientists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function deleteScientist(id: string) {
  return fetchAPI(`/scientists/${id}`, {
    method: "DELETE",
  });
}
