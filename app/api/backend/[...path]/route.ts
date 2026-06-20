import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

const SERVER = process.env.SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER!;

// BFF proxy: forwards browser API calls to the backend, attaching the access
// token (kept in an HttpOnly cookie) as a Bearer header. Keeps all browser
// traffic same-origin so tokens never touch client JS.
async function handler(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  const target = `${SERVER}/${path.join("/")}${req.nextUrl.search}`;

  const jar = await cookies();
  const accessToken = jar.get("daab.accessToken")?.value;

  // Forward the browser's headers as-is, stripping only what the proxy must
  // control. Allowlisting individual headers silently dropped things like
  // Accept-Language; a denylist keeps the pipe transparent.
  const headers = new Headers(req.headers);
  headers.delete("host"); // would point at the proxy, breaks vhost/redirects
  headers.delete("cookie"); // don't leak HttpOnly app cookies to backend
  headers.delete("connection"); // hop-by-hop
  headers.delete("content-length"); // refetch recomputes from body
  if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);
  else headers.delete("authorization"); // browser cannot spoof a bearer

  const method = req.method;
  const body =
    method === "GET" || method === "HEAD" ? undefined : await req.arrayBuffer();

  const res = await fetch(target, { method, headers, body, cache: "no-store" });

  // Strip hop-by-hop / encoding headers that don't survive re-emission.
  const resHeaders = new Headers(res.headers);
  resHeaders.delete("content-encoding");
  resHeaders.delete("content-length");
  resHeaders.delete("transfer-encoding");

  return new Response(res.body, { status: res.status, headers: resHeaders });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
