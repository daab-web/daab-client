import { Application } from "@/types/application";
import { PagedResponse } from "@/types/paged-response";
import { Scientist } from "@/types/scientist";

const apiBase = process.env.NEXT_PUBLIC_SERVER;

export async function fetchAPI(
  endpoint: string,
  options?: RequestInit,
): Promise<Response> {
  const buildRequest = (): RequestInit => {
    const headers = new Headers(options?.headers);
    
    // Only add Content-Type for requests with a body
    if (options?.body) {
      headers.set("Content-Type", "application/json");
    }
    
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

export async function fetchNews(page: number = 1, pageSize: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  return fetchAPI(`/news?${params.toString()}`);
}

export async function getNewsByIdOrSlug(idOrSlug: string) {
  return fetchAPI(`/news/${idOrSlug}`);
}
