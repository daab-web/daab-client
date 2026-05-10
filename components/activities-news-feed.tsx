'use client';

import Link from "next/link";

import { News } from "@/types/news";
import { PagedResponse } from "@/types/paged-response";
import NewsCard from "./news-card";
import { Button } from "./ui/button";
import { fetchNews } from "@/lib/api/news";

type Props = {
  initialNewsResponse: PagedResponse<News>;
  noNewsText: string;
  pageSize: number;
  locale: string;
};

import { useInfiniteQuery } from '@tanstack/react-query';
import { Spinner } from "./ui/spinner";

export function ActivitiesNewsFeed({ initialNewsResponse, locale }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['news', locale],
    queryFn: async ({ pageParam }) => await fetchNews(pageParam, 18, locale),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metadata.hasNextPage ? lastPage.metadata.currentPage + 1 : undefined,
    initialData: {
      pages: [initialNewsResponse],
      pageParams: [1],
    },
  });

  const articles = data.pages.flatMap((page) => page.items);

  return (
    <div className="flex flex-col justify-center gap-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link key={article.id} href={`/${locale}/activities/${article.slug || article.id}`}>
            <NewsCard article={article} />
          </Link>
        ))}
      </div>
      {hasNextPage && (
        <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? (
            <>
              'Loading...'
              <Spinner />
            </>
          ) : 'Load more'}
        </Button>
      )}
    </div>
  );
}
