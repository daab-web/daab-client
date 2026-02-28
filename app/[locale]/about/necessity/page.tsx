import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const contentLoaders = {
  az: () => import("@/content/az/necessity.mdx"),
  en: () => import("@/content/en/necessity.mdx"),
} as const;

type LocaleKey = keyof typeof contentLoaders;

const isSupportedLocale = (locale: string): locale is LocaleKey =>
  Object.prototype.hasOwnProperty.call(contentLoaders, locale);

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Necessity({ params }: Props) {
  const { locale } = await params;
  const loader = isSupportedLocale(locale)
    ? contentLoaders[locale]
    : contentLoaders.en;
  const { default: Content } = await loader();
  const tNav = await getTranslations({ locale, namespace: "Navigation.about" });

  return (
    <section
      id="necessity"
      data-section="necessity"
      className="mx-auto w-full max-w-4xl px-2 py-4 md:py-6"
    >
      <Card className="border-border/70 bg-card/90 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold md:text-3xl">
            {tNav("necessity")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Separator />
          <div className="space-y-5 [&_h1]:hidden [&_p]:mb-0 [&_p]:text-base [&_p]:leading-8 [&_p]:text-foreground/90 md:[&_p]:text-lg">
            <Content />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
