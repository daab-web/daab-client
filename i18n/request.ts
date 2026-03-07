import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import DB from "@/db";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const base = (await import(`../messages/${locale}.json`)).default;
  const runtime = await DB.findOneAsync({ locale }, { _id: 0, locale: 0 });

  return {
    locale,
    messages: { ...base, ...runtime },
  };
});
