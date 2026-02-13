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

export async function fetchScientists(page: number = 1, pageSize: number = 20) {
  return fetchAPI(`/scientists?page=${page}&pageSize=${pageSize}`);
}

export async function fetchApplications() {
  return fetchAPI("/applications");
}

export async function fetchNews(page: number = 1, pageSize: number = 20) {
  return fetch(`/news?page=${page}&pageSize=${pageSize}`);
}
