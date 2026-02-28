import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ABOUT_SECTIONS } from "@/lib/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function About({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });
  const tNav = await getTranslations({ locale, namespace: "Navigation.about" });

  return (
    <section className="mx-auto w-full max-w-5xl px-2 py-6 md:py-10">
      <div className="space-y-5 md:space-y-7">
        <Card className="border-border/70 bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-3xl font-extrabold md:text-4xl">
              {t("title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <Separator />
            <p className="mx-auto max-w-3xl text-center text-base leading-7 text-muted-foreground md:text-lg">
              {t("intro")}
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ABOUT_SECTIONS.map((section) => (
            <Link key={section.id} href={section.path}>
              <Card className="h-full border-border/70 bg-card/85 transition-colors hover:bg-accent/60">
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <span className="text-sm font-medium leading-6">
                    {tNav(section.id)}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
