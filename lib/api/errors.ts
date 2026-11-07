// Backend failures arrive as RFC 9457 problem details. Validation failures from
// FastEndpoints also carry an `errors` map ({ field: [messages] }).
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fieldErrors: Record<string, string[]> = {},
  ) {
    super(message);
  }
}

export async function toApiError(res: Response, fallback: string) {
  try {
    const body = await res.json();
    const fieldErrors: Record<string, string[]> = body?.errors ?? {};
    const firstFieldError = Object.values(fieldErrors).flat()[0];
    return new ApiError(
      body?.detail || firstFieldError || body?.title || fallback,
      res.status,
      fieldErrors,
    );
  } catch {
    return new ApiError(fallback, res.status);
  }
}
