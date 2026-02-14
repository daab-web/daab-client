const apiBase = process.env.NEXT_PUBLIC_SERVER;

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  let res = await fetch(`${apiBase}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    // TODO: This does nothing
    await refreshToken();

    res = await fetch(`${apiBase}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        ...options?.headers,
      },
    });
  }

  return res.json();
}

async function refreshToken() {}

export async function fetchScientists(
  page: number = 1,
  pageSize: number = 20,
  search?: string,
  country?: string,
  area?: string
) {
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

  return fetchAPI(`/scientists?${params.toString()}`);
}

export async function fetchCountries() {
  return fetchAPI("/countries");
}

export async function fetchAreas() {
  return fetchAPI("/areas");
}

export async function fetchApplications() {
  return fetchAPI("/applications");
}

export async function fetchNews(page: number = 1, pageSize: number = 20) {
  return fetch(`/news?page=${page}&pageSize=${pageSize}`);
}
