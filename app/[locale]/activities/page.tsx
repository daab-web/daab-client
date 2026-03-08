import { getTranslations } from "next-intl/server";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NewsCarousel } from "@/components/news-carousel";
import { fetchNews } from "@/lib/api";
import { PagedResponse } from "@/types/paged-response";
import { News } from "@/types/news";
import { formatDate, getTimeAgo } from "@/lib/date-utils";

type Props = {
  params: Promise<{ locale: string }>;
};

type FetchNewsResponse = PagedResponse<News>;

export default async function Activities({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ActivitiesPage" });

  const newsResponse = (await fetchNews(1, 10)) as FetchNewsResponse;
  const news = newsResponse.items;

  const carouselArticles = news.slice(0, 3);
  const gridArticles = news;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="mb-12 text-center bg-muted/30 py-12 border rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t("description")}
        </p>
      </div>

      {/* Carousel */}
      {carouselArticles.length > 0 && (
        <NewsCarousel articles={carouselArticles} locale={locale} />
      )}

      {/* News Grid */}
      {gridArticles.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gridArticles.map((article) => (
            <Link
              key={article.id}
              href={`/${locale}/activities/${article.slug || article.id}`}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group h-full cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  {article.thumbnail ? (
                    <Image
                      src={article.thumbnail}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : null}
                  {article.category && (
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="secondary"
                        className="backdrop-blur-sm bg-background/80"
                      >
                        {article.category}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Clock className="h-3 w-3" />
                    <span>{getTimeAgo(article.publishedDate, locale)}</span>
                  </div>
                  <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 mt-2">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="flex flex-col gap-3 items-start pt-0">
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground w-full border-t pt-3">
                    <User className="h-3 w-3" />
                    <span className="truncate">
                      {article.authorName || "DAAB"}
                    </span>
                    <span className="ml-auto text-xs">
                      {formatDate(article.publishedDate, locale)}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {news.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">{t("noNews")}</p>
        </div>
      )}
    </div>
  );
}
