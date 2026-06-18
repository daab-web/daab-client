// In the browser, calls go through the same-origin BFF proxy (`/api/backend`),
// which injects the access token from the HttpOnly cookie. On the server
// (RSC public reads), calls hit the backend directly.
const isServer = typeof window === "undefined";
const serverBase = process.env.SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER;
const apiBase = isServer ? serverBase : "/api/backend";

export async function fetchAPI(path: string, options?: RequestInit) {
  const method = (options?.method ?? "GET").toUpperCase();
  const cache = options?.cache ?? (method === "GET" ? "no-store" : undefined);

  return fetch(apiBase + path, {
    ...options,
    cache,
  });
}
