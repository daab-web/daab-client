"use client";

import { useEffect, useMemo, useRef } from "react";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { User, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { formatDate, getTimeAgo } from "@/lib/date-utils";
import { fetchNews } from "@/lib/api/news";
import { News } from "@/types/news";
import { PagedResponse } from "@/types/paged-response";

type Props = {
  locale: string;
  initialNewsResponse: PagedResponse<News>;
  noNewsText: string;
  pageSize: number;
};

export function ActivitiesNewsFeed({
  locale,
  initialNewsResponse,
  noNewsText,
  pageSize,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery<
      PagedResponse<News>,
      Error,
      InfiniteData<PagedResponse<News>>,
      [string, string, number],
      number
    >({
      queryKey: ["activities-news", locale, pageSize],
      queryFn: async ({ pageParam }) => await fetchNews(pageParam, pageSize),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.metadata.hasNextPage
          ? lastPage.metadata.currentPage + 1
          : undefined,
      initialData: {
        pages: [initialNewsResponse],
        pageParams: [1],
      },
    });

  const articles = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  useEffect(() => {
    if (!hasNextPage || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (articles.length === 0) {
    return (
      <div className="text-center py-20 reveal">
        <p className="text-muted-foreground text-lg">{noNewsText}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <Link
            key={article.id}
            href={`/${locale}/activities/${article.slug || article.id}`}
            className={`reveal `}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group h-full cursor-pointer">
              <div className="relative h-48 overflow-hidden bg-muted">
                {article.thumbnail ? (
                  <Image
                    src={article.thumbnail}
                    alt={article.title}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
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

      <div ref={sentinelRef} className="h-10" aria-hidden />

      {(isFetchingNextPage || (isFetching && hasNextPage)) && (
        <div className="flex justify-center py-6">
          <Spinner className="size-5" />
        </div>
      )}
    </>
  );
}
