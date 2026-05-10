import { getTranslations } from "next-intl/server";
import { NewsCarousel } from "@/components/news-carousel";
import { ActivitiesNewsFeed } from "@/components/activities-news-feed";
import { fetchNews } from "@/lib/api/news";
import { PagedResponse } from "@/types/paged-response";
import { News } from "@/types/news";
import { ScrollReveal } from "@/components/scroll-reveal";

type Props = {
  params: Promise<{ locale: string }>;
};

type FetchNewsResponse = PagedResponse<News>;

export default async function Activities({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ActivitiesPage" });

  const initialPageSize = 18;
  const newsResponse = (await fetchNews(
    1,
    initialPageSize,
    locale
  )) as FetchNewsResponse;
  const news = newsResponse.items;

  const carouselArticles = news.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <ScrollReveal />
      <div className="mb-12 text-center bg-muted/30 py-12 border rounded-2xl reveal">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t("description")}
        </p>
      </div>

      {carouselArticles.length > 0 && (
        <div className="reveal reveal-delay-1">
          <NewsCarousel articles={carouselArticles} />
        </div>
      )}

      <ActivitiesNewsFeed
        initialNewsResponse={newsResponse}
        noNewsText={t("noNews")}
        pageSize={initialPageSize}
        locale={locale}
      />
    </div>
  );
}
