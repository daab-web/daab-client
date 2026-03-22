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
