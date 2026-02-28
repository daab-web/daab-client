import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
    <section
      id="values"
      data-section="values"
      className="mx-auto w-full max-w-4xl px-2 py-4 md:py-6"
    >
      <Card className="border-border/70 bg-card/90 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold md:text-3xl">
            {tNav("values")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Separator />
          <div className="rounded-lg border border-border/70 bg-muted/30 px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-7">
            <div className="space-y-3 [&_h1]:hidden [&_p]:mb-0 [&_p]:text-xs [&_p]:leading-6 [&_p]:text-foreground/90 [&_p]:hyphens-auto [&_strong]:font-semibold [&_strong]:tracking-tight sm:[&_p]:text-sm sm:[&_p]:leading-7 sm:[&_strong]:tracking-wide md:[&_p]:text-base md:[&_p]:leading-8 md:[&_p]:text-center lg:[&_p]:text-lg">
              <Content />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
