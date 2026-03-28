import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Calendar, ChevronRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { fetchNews } from "@/lib/api/news";
import { ScrollReveal } from "@/components/scroll-reveal";
import { formatDate } from "@/lib/date-utils";
import { PagedResponse } from "@/types/paged-response";
import { News } from "@/types/news";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  params: Promise<{ locale: string }>;
};

type FetchNewsResponse = PagedResponse<News>;

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const tGlobal = await getTranslations({ locale, namespace: "Global" });
  const tActivities = await getTranslations({
    locale,
    namespace: "ActivitiesPage",
  });
  const tAbout = await getTranslations({ locale, namespace: "AboutPage" });
  const tNav = await getTranslations({ locale, namespace: "Navigation" });
  const tAboutNav = await getTranslations({
    locale,
    namespace: "Navigation.about",
  });
  const tHome = await getTranslations({ locale, namespace: "HomePage" });

  let news: News[] = [];
  try {
    const newsResponse = (await fetchNews(1, 9, locale)) as FetchNewsResponse;
    news = newsResponse.items;
  } catch {
    news = [];
  }

  const [featured, ...rest] = news;
  const secondary = rest.slice(0, 2);
  const feed = rest.slice(2, 8);

  return (
    <>
      <ScrollReveal />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
        <section className="mb-10 space-y-4 border-b pb-8">
        <h1 className="max-w-5xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl fade-in">
          {tGlobal("title")}
        </h1>
        <p className="max-w-3xl text-base text-muted-foreground md:text-lg fade-in-delay">
          {tActivities("description")}
        </p>
      </section>

      <section className="mb-12 grid gap-5 lg:grid-cols-12">
        {featured ? (
          <Link
            href={`/activities/${featured.slug || featured.id}`}
            className="lg:col-span-8 reveal"
          >
            <Card className="group h-full overflow-hidden border transition-colors hover:border-primary/40">
              <div className="relative aspect-video overflow-hidden bg-muted">
                {featured.thumbnail ? (
                  <Image
                    src={featured.thumbnail}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(min-width: 1024px) 66vw, 100vw"
                  />
                ) : null}
                {featured.category && (
                  <Badge className="absolute left-4 top-4 bg-background/85 backdrop-blur-sm">
                    {featured.category}
                  </Badge>
                )}
              </div>
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(featured.publishedDate, locale)}</span>
                </div>
                <CardTitle className="text-2xl leading-tight transition-colors group-hover:text-primary md:text-3xl">
                  {featured.title}
                </CardTitle>
                <CardDescription className="line-clamp-3 text-sm md:text-base">
                  {featured.excerpt}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ) : (
          <Card className="lg:col-span-8">
            <CardContent className="py-16 text-center text-muted-foreground">
              {tActivities("noNews")}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-5 lg:col-span-4">
          {secondary.length > 0 ? (
            secondary.map((article, index) => (
              <Link
                key={article.id}
                href={`/activities/${article.slug || article.id}`}
                className={`reveal reveal-delay-${index + 1}`}
              >
                <Card className="group h-full border transition-colors hover:border-primary/40">
                  <CardHeader className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(article.publishedDate, locale)}</span>
                    </div>
                    <CardTitle className="line-clamp-2 text-xl leading-snug transition-colors group-hover:text-primary">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                {tActivities("noNews")}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="mb-12 grid gap-5 md:grid-cols-2">
        <Card className="border-border/70 flex flex-col reveal reveal-from-left transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
          <CardHeader className="space-y-3 grow">
            <CardTitle className="text-2xl">{tAboutNav("mission")}</CardTitle>
            <CardDescription className="text-sm leading-6 md:text-base">
              {tHome("missionExcerpt")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild variant="link" className="group w-fit px-0">
              <Link href="/about/mission">
                {tHome("readSection")}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/70 flex flex-col reveal reveal-from-right transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
          <CardHeader className="space-y-3 grow">
            <CardTitle className="text-2xl">{tAboutNav("vision")}</CardTitle>
            <CardDescription className="text-sm leading-6 md:text-base">
              {tHome("visionExcerpt")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild variant="link" className="group w-fit px-0">
              <Link href="/about/vision">
                {tHome("readSection")}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12 space-y-5">
        <div className="space-y-2 reveal">
          <h2 className="text-3xl font-bold tracking-tight">
            {tHome("latestTitle")}
          </h2>
          <p className="text-muted-foreground">{tHome("latestDescription")}</p>
        </div>

        {feed.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {feed.map((article, index) => (
              <Link
                key={article.id}
                href={`/activities/${article.slug || article.id}`}
                className={`reveal reveal-delay-${(index % 3) + 1}`}
              >
                <Card className="group h-full border transition-all duration-300 hover:border-primary/40 hover:scale-105">
                  <CardHeader className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(article.publishedDate, locale)}</span>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg transition-colors group-hover:text-primary">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-sm">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 text-sm font-medium text-primary">
                    {tHome("readArticle")}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              {tActivities("noNews")}
            </CardContent>
          </Card>
        )}
      </section>

      <section className="rounded-2xl border bg-muted/20 px-6 py-10 text-center md:px-10 reveal">
        <h2 className="text-2xl font-bold md:text-3xl">{tHome("joinTitle")}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          {tHome("joinDescription")}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild size="lg" className="transition-all hover:scale-105 hover:shadow-lg">
            <Link href="/membership">{tNav("membership")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="transition-all hover:scale-105 hover:border-primary/50">
            <Link href="/about">{tAbout("title")}</Link>
          </Button>
        </div>
      </section>
    </div>
    </>
  );
}
