import { getTranslations } from "next-intl/server";
import { AboutSectionWrapper } from "@/components/about-section-wrapper";

const contentLoaders = {
  az: () => import("@/content/az/values.md"),
  en: () => import("@/content/en/values.md"),
} as const;

type LocaleKey = keyof typeof contentLoaders;

const isSupportedLocale = (locale: string): locale is LocaleKey =>
  Object.prototype.hasOwnProperty.call(contentLoaders, locale);

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Values({ params }: Props) {
  const { locale } = await params;
  const loader = isSupportedLocale(locale)
    ? contentLoaders[locale]
    : contentLoaders.en;
  const { default: Content } = await loader();
  const tNav = await getTranslations({ locale, namespace: "Navigation.about" });

  return (
    <AboutSectionWrapper sectionId="values" title={tNav("values")}>
      <div className="space-y-3 [&_h1]:hidden [&_p]:mb-0 [&_p]:text-xs [&_p]:leading-6 [&_p]:text-foreground/90 [&_p]:hyphens-auto [&_strong]:font-semibold [&_strong]:tracking-tight sm:[&_p]:text-sm sm:[&_p]:leading-7 sm:[&_strong]:tracking-wide md:[&_p]:text-base md:[&_p]:leading-8 md:[&_p]:text-center lg:[&_p]:text-lg">
        <Content />
      </div>
    </AboutSectionWrapper>
  );
}
