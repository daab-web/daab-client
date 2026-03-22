const apiBase = process.env.NEXT_PUBLIC_SERVER;

export async function fetchAPI(path: string, options?: RequestInit) {
  const method = (options?.method ?? "GET").toUpperCase();
  const cache = options?.cache ?? (method === "GET" ? "no-store" : undefined);

  const makeRequest = () =>
    fetch(apiBase + path, {
      ...options,
      credentials: "include",
      cache,
    });

  let res = await makeRequest();

  if (res.status === 401) {
    const refreshed = await refreshToken();
    if (!refreshed) return res;
    res = await makeRequest();
  }

  return res;
}

async function refreshToken(): Promise<boolean> {
  const res = await fetch(apiBase + "/auth/refresh-token", {
    method: "POST",
    credentials: "include",
    cache: "no-cache",
  });

  return res.ok;
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

export async function fetchInstitutions(): Promise<string[]> {
  const res = await fetchAPI("/institutions");

  const data: { institutions: string[] } = await res.json();

  return data.institutions;
}
