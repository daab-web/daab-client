import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

async function getRuntimeMessages(locale: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/translations`, {
      headers: { "Accept-Language": locale },
      cache: "no-store",
    });

    if (!res.ok) {
      return {};
    }

    return (await res.json()) as Record<string, unknown>;
  } catch {
    // Backend unreachable: fall back to the static base messages only.
    return {};
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const base = (await import(`../messages/${locale}.json`)).default;
  const runtime = await getRuntimeMessages(locale);

  return {
    locale,
    messages: { ...base, ...runtime },
  };
});
