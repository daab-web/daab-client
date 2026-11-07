import { getTranslations } from "next-intl/server";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { PostCard } from "@/components/blog/post-card";
import { AuthorActions } from "@/components/blog/author-actions";
import { fetchPublishedPosts } from "@/lib/api/blog";
import { PagedResponse } from "@/types/paged-response";
import { PostSummary } from "@/types/blog";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

const PAGE_SIZE = 12;

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  const t = await getTranslations({ locale, namespace: "Blog" });

  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  let posts: PagedResponse<PostSummary> | null = null;
  try {
    posts = await fetchPublishedPosts(page, PAGE_SIZE, locale);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }

  const items = posts?.items ?? [];
  const meta = posts?.metadata;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <ScrollReveal />
      <div className="reveal mb-12 space-y-6 rounded-2xl border bg-muted/30 py-12 text-center">
        <div className="space-y-4 px-4">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <AuthorActions />
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
          <Newspaper className="h-8 w-8" />
          <p>{t("noPosts")}</p>
        </div>
      ) : (
        <div className="reveal reveal-delay-1 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <nav
          aria-label="pagination"
          className="mt-10 flex items-center justify-center gap-4"
        >
          <Button asChild variant="outline">
            <Link
              href={`/blog?page=${page - 1}`}
              aria-disabled={!meta.hasPreviousPage}
              className={meta.hasPreviousPage ? "" : "pointer-events-none opacity-50"}
            >
              <ChevronLeft className="h-4 w-4" />
              {t("previous")}
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            {t("pageOf", { page: meta.currentPage, total: meta.totalPages })}
          </span>
          <Button asChild variant="outline">
            <Link
              href={`/blog?page=${page + 1}`}
              aria-disabled={!meta.hasNextPage}
              className={meta.hasNextPage ? "" : "pointer-events-none opacity-50"}
            >
              {t("next")}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </nav>
      )}
    </div>
  );
}
