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
  area?: string,
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

export async function fetchApplications(
  page: number = 1,
  pageSize: number = 20,
) {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  return fetchAPI(`/applications?${params.toString()}`);
}

export async function fetchApplicationById(applicationId: string) {
  return fetchAPI(`/applications/${applicationId}`);
}

export async function approveApplication(applicationId: string) {
  return fetchAPI(`/applications/${applicationId}/approve`, {
    method: "PUT",
  });
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

export async function fetchScientistById(idOrSlug: string) {
  return fetchAPI(`/scientists/${idOrSlug}`);
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
