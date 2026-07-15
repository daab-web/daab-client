import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  ImageIcon,
} from "lucide-react";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { fetchNews } from "@/lib/api/news";
import { ScrollReveal } from "@/components/scroll-reveal";
import { PagedResponse } from "@/types/paged-response";
import { News } from "@/types/news";
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
  const tAbout = await getTranslations({ locale, namespace: "AboutPage" });
  const tNav = await getTranslations({ locale, namespace: "Navigation" });
  const tAboutNav = await getTranslations({
    locale,
    namespace: "Navigation.about",
  });
  const tHome = await getTranslations({ locale, namespace: "HomePage" });
  const tActivities = await getTranslations({
    locale,
    namespace: "ActivitiesPage",
  });

  let news: News[] = [];
  try {
    const newsResponse = (await fetchNews(1, 9, locale)) as FetchNewsResponse;
    news = newsResponse.items;
  } catch {
    news = [];
  }

  const [featured, ...rest] = news;
  const secondary = rest.slice(0, 2);

  const purposeCards = [
    {
      title: tAboutNav("mission"),
      description: tHome("missionExcerpt"),
      href: "/about/mission",
    },
    {
      title: tAboutNav("vision"),
      description: tHome("visionExcerpt"),
      href: "/about/vision",
    },
    {
      title: tAboutNav("values"),
      description: tHome("valuesExcerpt"),
      href: "/about/values",
    },
  ];

  const networkCards = [
    {
      title: "Scientists living abroad",
      description: tHome("globalDescription"),
    },
    {
      title: "Scientific fields",
      description:
        "Discover members across engineering, medical sciences, humanities, technology, and applied research.",
    },
    {
      title: "International collaboration",
      description:
        "Support academic exchange, joint initiatives, and scientific partnerships across borders.",
    },
  ];

  function NewsImage({
    article,
    compact = false,
  }: {
    article: News;
    compact?: boolean;
  }) {
    if (article.thumbnail) {
      return (
        <Image
          src={article.thumbnail}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={
            compact
              ? "(min-width: 1024px) 20vw, 100vw"
              : "(min-width: 1024px) 50vw, 100vw"
          }
        />
      );
    }

    return (
      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-100 via-white to-slate-200 text-slate-400">
        <ImageIcon className="h-8 w-8" />
      </div>
    );
  }

  return (
    <>
      <ScrollReveal />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
        <section className="hero-section relative mb-10 overflow-hidden rounded-[1.9rem] border border-slate-200/70 bg-slate-900 shadow-[0_30px_70px_rgba(15,23,42,0.16)] md:mb-12 md:min-h-107.5 dark:border-white/10 dark:bg-[#0f0f0f] dark:shadow-[0_30px_70px_rgba(0,0,0,0.72)]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.66)_36%,rgba(0,0,0,0.28)_100%)]" />
          <div className="relative z-10 flex min-h-80 flex-col justify-end p-6 md:min-h-107.5 md:p-12 lg:px-14 lg:py-14">
            <div className="max-w-3xl space-y-4 text-white">
              <h1 className="fade-in max-w-2xl text-4xl font-semibold leading-[1.03] tracking-tight drop-shadow-sm md:text-6xl">
                {tHome("heroTitle")}
              </h1>
              <p className="fade-in-delay max-w-2xl text-sm leading-6 text-white/78 md:text-lg md:leading-7">
                {tHome("heroDescription")}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 fade-in-delay">
                <Button
                  asChild
                  size="lg"
                  className="group rounded-full bg-[#5e7ed8] px-6 text-white transition-colors duration-200 hover:bg-[#4f6ec7]"
                >
                  <Link href="/membership">
                    {tNav("membership")}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="group rounded-full border border-white/20 bg-white/5 px-6 text-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.16)] backdrop-blur-md transition-colors duration-200 hover:bg-white/10 hover:text-white hover:shadow-[0_12px_28px_rgba(15,23,42,0.18)]"
                >
                  <Link href="/scientists">
                    {tNav("ourScientists")}
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="reveal-from-left mb-12 overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white shadow-[0_28px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#1b1b1b] dark:shadow-[0_28px_60px_rgba(0,0,0,0.42)]">
          <div className="grid gap-8 p-6 md:grid-cols-2 md:gap-10 md:p-8 lg:p-10">
            <div className="flex flex-col justify-center space-y-5 md:pr-4">
              <p className="fade-in text-xs font-bold uppercase tracking-[0.22em] text-[#274380] dark:text-[#5e7ed8]">
                {tHome("aboutEyebrow")}
              </p>
              <h2 className="fade-in max-w-xl text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-4xl dark:text-[#f2f2f2]">
                {tHome("aboutTitle")}
              </h2>
              <p className="fade-in-delay max-w-xl text-sm leading-7 text-slate-600 md:text-base dark:text-[#a8a8a8]">
                {tHome("aboutDescription")}
              </p>
              <Button
                asChild
                variant="link"
                className="group w-fit px-0 text-[#274380] transition-colors duration-200 hover:text-[#20356a] dark:text-[#5e7ed8] dark:hover:text-[#7f9bed]"
              >
                <Link href="/about">
                  {tAbout("title")}
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <div className="relative min-h-57.5 overflow-hidden rounded-[1.35rem] bg-slate-100 md:min-h-65 dark:bg-[#121212]">
              <Image
                src="/about/necessity2.jpg"
                alt="WAAS conference"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </div>
          </div>
        </section>

        <section className="reveal mb-12 space-y-5 md:space-y-7 dark:text-[#f2f2f2]">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#274380] dark:text-[#5e7ed8]">
              {tHome("purposeEyebrow")}
            </p>
            <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-4xl dark:text-[#f2f2f2]">
              {tHome("purposeTitle")}
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-[#a8a8a8]">
              {tHome("purposeDescription")}
            </p>
          </div>

          <div className="grid items-stretch gap-4 md:grid-cols-3">
            {purposeCards.map((card) => (
              <Link key={card.href} href={card.href} className="group block">
                <Card className="flex h-full min-h-60 border-slate-200/80 bg-white/95 shadow-[0_14px_32px_rgba(15,23,42,0.07)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#274380]/30 group-hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#1b1b1b] dark:shadow-[0_14px_32px_rgba(0,0,0,0.28)] dark:group-hover:border-[#5e7ed8]/35 dark:group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.46)]">
                  <CardHeader className="flex h-full flex-col space-y-3 pb-4">
                    <span className="h-1.5 w-12 rounded-full bg-[#274380] dark:bg-[#5e7ed8]" />
                    <CardTitle className="text-xl text-slate-900 dark:text-[#f2f2f2]">
                      {card.title}
                    </CardTitle>
                    <CardDescription className="flex-1 text-sm leading-7 text-slate-600 dark:text-[#a8a8a8]">
                      {card.description}
                    </CardDescription>
                    <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-[#274380] transition-colors duration-200 group-hover:text-[#20356a] dark:text-[#5e7ed8] dark:group-hover:text-[#7f9bed]">
                      {tHome("linkLabel")}
                      <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="reveal-from-right mb-12 space-y-5 md:space-y-7 dark:text-[#f2f2f2]">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#274380] dark:text-[#5e7ed8]">
              {tHome("latestEyebrow")}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl dark:text-[#f2f2f2]">
              {tHome("latestFeedTitle")}
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-[#a8a8a8]">
              {tHome("latestFeedDescription")}
            </p>
          </div>

          {news.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-12">
              {featured && (
                <Link
                  href={`/activities/${featured.slug || featured.id}`}
                  className="group lg:col-span-8"
                >
                  <Card className="h-full overflow-hidden border-slate-200/80 bg-white shadow-[0_18px_36px_rgba(15,23,42,0.08)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_22px_44px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#1b1b1b] dark:shadow-[0_18px_36px_rgba(0,0,0,0.32)] dark:group-hover:shadow-[0_22px_44px_rgba(0,0,0,0.5)]">
                    <div className="relative aspect-16/10 overflow-hidden bg-slate-100 dark:bg-[#121212]">
                      <NewsImage article={featured} />
                    </div>
                    <CardHeader className="space-y-3 p-5 md:p-6">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-[#9a9a9a]">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>{featured.publishedDate}</span>
                        <span className="ml-2 rounded-full bg-slate-100 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-600 dark:bg-white/6 dark:text-[#cfcfcf]">
                          {featured.category || "DAAB"}
                        </span>
                      </div>
                      <CardTitle className="max-w-2xl text-2xl leading-tight text-slate-900 md:text-[2rem] dark:text-[#f2f2f2]">
                        {featured.title}
                      </CardTitle>
                      <CardDescription className="max-w-2xl text-sm leading-7 text-slate-600 md:text-base dark:text-[#a8a8a8]">
                        {featured.excerpt}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              )}

              <div className="grid gap-4 lg:col-span-4">
                {secondary.map((article) => (
                  <Link
                    key={article.id}
                    href={`/activities/${article.slug || article.id}`}
                    className="group"
                  >
                    <Card className="overflow-hidden border-slate-200/80 bg-white shadow-[0_16px_34px_rgba(15,23,42,0.07)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#1b1b1b] dark:shadow-[0_16px_34px_rgba(0,0,0,0.3)]">
                      <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-[#121212]">
                        <NewsImage article={article} compact />
                      </div>
                      <CardContent className="space-y-2 p-4">
                        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-[#9a9a9a]">
                          <span>{article.publishedDate}</span>
                          <span className="text-slate-300 dark:text-[#444]">
                            •
                          </span>
                          <span>{article.category || "DAAB"}</span>
                        </div>
                        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 dark:text-[#f2f2f2]">
                          {article.title}
                        </h3>
                        <p className="line-clamp-2 text-sm leading-6 text-slate-600 dark:text-[#a8a8a8]">
                          {article.excerpt}
                        </p>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-[#274380] dark:text-[#5e7ed8]">
                          Read more
                          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Card className="border-slate-200/80 bg-white shadow-[0_18px_36px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#1b1b1b] dark:shadow-[0_18px_36px_rgba(0,0,0,0.3)]">
              <CardContent className="py-12 text-center text-sm text-slate-500 dark:text-[#a8a8a8]">
                {tActivities("noNews")}
              </CardContent>
            </Card>
          )}
        </section>

        <section className="reveal mb-12 space-y-5 md:space-y-7">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#274380] dark:text-[#5e7ed8]">
              {tHome("globalEyebrow")}
            </p>
            <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-4xl dark:text-[#f2f2f2]">
              {tHome("globalTitle")}
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-[#a8a8a8]">
              {tHome("globalDescription")}
            </p>
          </div>

          <div className="grid items-stretch gap-4 md:grid-cols-3">
            {networkCards.map((card) => (
              <Card
                key={card.title}
                className="flex h-full min-h-45 border-slate-200/80 bg-white shadow-[0_14px_32px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#1b1b1b] dark:shadow-[0_14px_32px_rgba(0,0,0,0.28)]"
              >
                <CardHeader className="flex h-full flex-col space-y-3 pb-3">
                  <span className="h-1.5 w-12 rounded-full bg-[#274380] dark:bg-[#5e7ed8]" />
                  <CardTitle className="text-xl text-slate-900 dark:text-[#f2f2f2]">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="flex-1 text-sm leading-7 text-slate-600 dark:text-[#a8a8a8]">
                    {card.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Button
              asChild
              variant="link"
              className="group px-0 text-[#274380] transition-colors duration-200 hover:text-[#20356a] dark:text-[#5e7ed8] dark:hover:text-[#7f9bed]"
            >
              <Link href="/scientists">
                {tNav("ourScientists")}
                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="reveal rounded-[1.75rem] border border-[#c8d5ef] bg-white p-6 shadow-[0_18px_40px_rgba(39,67,128,0.08)] md:p-10 dark:border-white/10 dark:bg-[#1b1b1b] dark:shadow-[0_18px_40px_rgba(0,0,0,0.38)]">
          <div className="mx-auto max-w-3xl space-y-5 text-center">
            <h2 className="fade-in text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl dark:text-[#f2f2f2]">
              {tHome("joinTitle")}
            </h2>
            <p className="fade-in-delay text-sm leading-7 text-slate-600 md:text-base dark:text-[#a8a8a8]">
              {tHome("joinDescription")}
            </p>
            <div className="fade-in-delay flex flex-wrap justify-center gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="group rounded-full bg-[#274380] px-6 text-white transition-colors duration-200 hover:bg-[#20356a] dark:bg-[#5e7ed8] dark:text-white dark:hover:bg-[#4f6ec7]"
              >
                <Link href="/membership">
                  {tNav("membership")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="group rounded-full px-6 transition-colors duration-200 hover:border-[#274380]/40 hover:bg-[#EEF3FA] hover:shadow-[0_12px_26px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#1b1b1b] dark:text-slate-100 dark:hover:border-[#5e7ed8]/40 dark:hover:bg-[#232323]"
              >
                <Link href="/about">
                  {tAbout("title")}
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
