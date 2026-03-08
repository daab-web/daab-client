const apiBase = process.env.NEXT_PUBLIC_SERVER;

export async function fetchAPI(path: string, options?: RequestInit) {
  const makeRequest = () => fetch(apiBase + path, {
    ...options,
    credentials: "include",
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
