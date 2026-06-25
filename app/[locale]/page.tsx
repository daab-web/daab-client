import { getTranslations } from "next-intl/server";
import { ArrowRight, Calendar, ChevronRight, ImageIcon } from "lucide-react";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { fetchNews } from "@/lib/api/news";
import { ScrollReveal } from "@/components/scroll-reveal";
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
import NewsCard from "@/components/news-card";

type Props = {
  params: Promise<{ locale: string }>;
};

type FetchNewsResponse = PagedResponse<News>;

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const tGlobal = await getTranslations({ locale, namespace: "Global" });
  const tAbout = await getTranslations({ locale, namespace: "AboutPage" });
  const tActivities = await getTranslations({
    locale,
    namespace: "ActivitiesPage",
  });
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
        <section className="hero-section mb-10 space-y-4 rounded-lg p-16 shadow-sm  md:p-16 dark:border-white/10 dark:bg-transparent dark:backdrop-blur-none">
          <h1 className="max-w-5xl text-4xl font-extrabold leading-tight tracking-tight text-[#e0e0e0] drop-shadow-sm md:text-6xl fade-in dark:text-white">
            {tGlobal("title")}
          </h1>
          <p className="max-w-3xl text-base text-[#e0e0e0] md:text-lg fade-in-delay dark:text-white/90">
            {tActivities("description")}
          </p>
          <div className="flex gap-3">
            <Button
              className="py-5 px-6 font-semibold bg-background text-foreground shadow-sm cursor-pointer"
              variant="outline"
            >
              <Link href="/membership" className="flex items-center gap-1">
                {tGlobal("become-member")}
                <ArrowRight size={15} />
              </Link>
            </Button>
            <Button asChild variant="outline" className="font-semibold border-gray-500 text-white py-5 px-6 bg-white/10 shadow-sm">
              <Link href="/about" className="hover:bg-white/10 hover:text-white">{tAbout("title")}</Link>
            </Button>
          </div>
        </section>

        <section className="mb-12 grid items-start gap-5 lg:grid-cols-12">
          {featured ? (
            <>
              <div className="col-span-12 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-6 bg-brand-accent rounded-full" />
                  <h2 className="font-bold text-xl">{tGlobal("featured-news")}</h2>
                </div>
                <Link href="/activities" className="flex items-center gap-1 text-brand-accent">
                  {tActivities("view-all")}
                  <ArrowRight size={12} />
                </Link>
              </div>
              <Link
                href={`/activities/${featured.slug || featured.id}`}
                className="lg:col-span-8 reveal h-full"
              >
                <Card className="group pt-0 h-full overflow-hidden border transition-all duration-300 shadow-lg hover:scale-[1.02] hover:border-primary/40">
                  <div className="relative flex items-center justify-center aspect-video overflow-hidden bg-muted">
                    {featured.thumbnail ? (
                      <Image
                        src={featured.thumbnail}
                        alt={featured.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        sizes="(min-width: 1024px) 66vw, 100vw"
                      />
                    ) : (
                      <ImageIcon />
                    )}
                    {featured.category && (
                      <Badge className="absolute left-4 top-4 text-foreground bg-background/85 backdrop-blur-sm">
                        {featured.category}
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted py-1 px-3 rounded-full w-fit">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{featured.publishedDate}</span>
                    </div>
                    <CardTitle className="text-2xl leading-tight text-foreground transition-colors md:text-3xl">
                      {featured.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-sm md:text-base">
                      {featured.excerpt}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </>
          ) : (
            <Card className="lg:col-span-8">
              <CardContent className="py-16 text-center text-muted-foreground">
                {tActivities("noNews")}
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col gap-5 lg:col-span-4">
            {secondary.length > 0 ? (
              secondary.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/activities/${article.slug || article.id}`}
                  className={`reveal reveal-delay-${index + 1} flex flex-1`}
                >
                  <NewsCard article={article} />
                </Link>
              ))
            ) : (
              <Card>
                <CardContent className=" py-12 text-center text-sm text-muted-foreground">
                  {tActivities("noNews")}
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        <section className="mb-12 grid gap-5 md:grid-cols-2">
          <Card className="border-border/70 relative flex flex-col overflow-hidden reveal reveal-from-left transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
            <span
              className="pointer-events-none absolute bottom-4 left-0 h-full top-0 w-1.5 bg-brand-accent"
              aria-hidden
            />
            <CardHeader className="space-y-3 grow pl-5">
              <CardTitle className="text-2xl">{tAboutNav("mission")}</CardTitle>
              <CardDescription className="text-sm leading-6 md:text-base">
                {tHome("missionExcerpt")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pl-5">
              <Button
                asChild
                variant="link"
                className="group w-fit px-0 text-brand-accent"
              >
                <Link href="/about/mission">
                  {tHome("readSection")}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/70 relative flex flex-col overflow-hidden reveal reveal-from-right transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
            <span
              className="pointer-events-none absolute bottom-4 left-0 h-full top-0 w-1.5 bg-brand-accent"
              aria-hidden
            />
            <CardHeader className="space-y-3 grow pl-5">
              <CardTitle className="text-2xl">{tAboutNav("vision")}</CardTitle>
              <CardDescription className="text-sm leading-6 md:text-base">
                {tHome("visionExcerpt")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pl-5">
              <Button
                asChild
                variant="link"
                className="group w-fit px-0 text-brand-accent"
              >
                <Link href="/about/vision">
                  {tHome("readSection")}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12 space-y-5">
          <div className="flex gap-4">
            <span className="w-1.5 bg-brand-accent rounded-full" />

            <div className="space-y-2 reveal">
              <h2 className="text-3xl font-bold tracking-tight">
                {tHome("latestTitle")}
              </h2>
              <p className="text-muted-foreground">
                {tHome("latestDescription")}
              </p>
            </div>
          </div>

          {feed.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {feed.map((article, index) => (
                <Card
                  key={article.id}
                  className={`reveal reveal-delay-${(index % 3) + 1} group h-full border transition-all hover:border-primary/40`}
                >
                  <CardHeader className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{article.publishedDate}</span>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg text-foreground transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-sm">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 text-sm font-medium text-brand-accent">
                    <Link
                      key={article.id}
                      href={`/activities/${article.slug || article.id}`}
                      className="hover:underline"
                    >
                      {tHome("readArticle")}
                    </Link>
                  </CardContent>
                </Card>
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

        <section className="rounded-2xl shadow-lg border bg-[url(/bg-header-dark_1.png)] px-6 py-10 text-center text-white md:px-10 reveal">
          <h2 className="text-2xl font-bold md:text-3xl">
            {tHome("joinTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            {tHome("joinDescription")}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="transition-all font-semibold border-white py-5 px-6 shadow-sm bg-white text-[#14141e] hover:bg-white hover:text-[#14141e]"
            >
              <Link href="/membership">{tNav("membership")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="font-semibold border-gray-500 text-white py-5 px-6 bg-white/10 shadow-sm"
            >
              <Link href="/about" className="hover:bg-white/10 hover:text-white">{tAbout("title")}</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
