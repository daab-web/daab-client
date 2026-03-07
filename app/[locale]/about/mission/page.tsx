import { getTranslations } from "next-intl/server";
import { AboutSectionWrapper } from "@/components/about-section-wrapper";

const contentLoaders = {
  az: () => import("@/content/az/mission.md"),
  en: () => import("@/content/en/mission.md"),
} as const;

type LocaleKey = keyof typeof contentLoaders;

const isSupportedLocale = (locale: string): locale is LocaleKey =>
  Object.prototype.hasOwnProperty.call(contentLoaders, locale);

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Mission({ params }: Props) {
  const { locale } = await params;
  const loader = isSupportedLocale(locale)
    ? contentLoaders[locale]
    : contentLoaders.en;
  const { default: Content } = await loader();
  const tNav = await getTranslations({ locale, namespace: "Navigation.about" });

  return (
    <AboutSectionWrapper sectionId="mission" title={tNav("mission")}>
      <div className="space-y-5 [&_h1]:hidden [&_p]:mb-0 [&_p]:text-base [&_p]:leading-8 [&_p]:text-foreground/90 md:[&_p]:text-lg">
        <Content />
      </div>
    </AboutSectionWrapper>
  );
}
