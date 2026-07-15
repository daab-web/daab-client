import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import NewsViewer from "@/components/news-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  Tag,
  ArrowLeft,
  Share2,
  ArrowRight,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  fetchNews,
  getNewsAttachments,
  getNewsByIdOrSlug,
} from "@/lib/api/news";
import { News, NewsAttachment } from "@/types/news";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  ArticleImageGallery,
  type GalleryImage,
} from "@/components/article-image-gallery";

type Props = {
  params: Promise<{ locale: string; "id-or-slug": string }>;
};

type RelatedNewsItem = Pick<
  News,
  | "id"
  | "slug"
  | "title"
  | "excerpt"
  | "thumbnail"
  | "publishedDate"
  | "category"
>;

function isImageAttachment(attachment: NewsAttachment): boolean {
  if (attachment.fileType?.startsWith("image/")) return true;

  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(attachment.fileUrl);
}

async function getArticleWithContent(
  idOrSlug: string,
  locale: string,
): Promise<News | null> {
  try {
    const article: News = await getNewsByIdOrSlug(idOrSlug, locale);
    return article;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

async function getRelatedNews(
  locale: string,
  currentId: string,
): Promise<RelatedNewsItem[]> {
  try {
    const response = await fetchNews(1, 6, locale);

    return response.items
      .filter((item) => item.id !== currentId)
      .slice(0, 3)
      .map(
        ({ id, slug, title, excerpt, thumbnail, publishedDate, category }) => ({
          id,
          slug,
          title,
          excerpt,
          thumbnail,
          publishedDate,
          category,
        }),
      );
  } catch (error) {
    console.error("Error fetching related news:", error);
    return [];
  }
}

function RelatedCard({
  article,
  locale,
  compact = false,
}: {
  article: RelatedNewsItem;
  locale: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/${locale}/activities/${article.slug || article.id}`}
      className="group block"
    >
      <article className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_36px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#1b1b1b] dark:shadow-[0_18px_36px_rgba(0,0,0,0.3)]">
        {!compact ? (
          <div className="relative aspect-video overflow-hidden bg-muted dark:bg-[#121212]">
            {article.thumbnail ? (
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1280px) 30vw, 100vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-100 via-white to-slate-200 text-slate-400 dark:from-[#1a1a1a] dark:via-[#141414] dark:to-[#202020]">
                <ImageIcon className="h-7 w-7" />
              </div>
            )}
            {article.category && (
              <div className="absolute left-4 top-4 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#274380] backdrop-blur dark:bg-black/50 dark:text-[#C9D6F0]">
                {article.category}
              </div>
            )}
          </div>
        ) : null}

        <div className={compact ? "p-4" : "space-y-3 p-4 md:p-5"}>
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-[#9a9a9a]">
            <span>{article.publishedDate}</span>
            <span className="text-slate-300 dark:text-[#444]">•</span>
            <span>{article.category || "DAAB"}</span>
          </div>
          <h3
            className={`line-clamp-2 font-semibold leading-snug text-slate-900 dark:text-[#f2f2f2] ${compact ? "text-base" : "text-lg md:text-xl"}`}
          >
            {article.title}
          </h3>
          {article.excerpt && (
            <p
              className={`line-clamp-2 leading-6 text-slate-600 dark:text-[#a8a8a8] ${compact ? "text-xs" : "text-sm md:text-base"}`}
            >
              {article.excerpt}
            </p>
          )}
          {compact && (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-[#274380] dark:text-[#5e7ed8]">
              Read more
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}

export default async function ArticlePage({ params }: Props) {
  const { locale, "id-or-slug": idOrSlug } = await params;
  const t = await getTranslations({ locale, namespace: "ArticlePage" });

  const article = await getArticleWithContent(idOrSlug, locale);

  if (!article) {
    notFound();
  }

  const [attachments, relatedNews] = await Promise.all([
    getNewsAttachments(article.id).catch((error) => {
      console.error("Error fetching article attachments:", error);
      return [] as NewsAttachment[];
    }),
    getRelatedNews(locale, article.id),
  ]);

  const galleryImages: GalleryImage[] = attachments
    .filter(isImageAttachment)
    .map((attachment, index) => ({
      src: attachment.fileUrl,
      alt: attachment.caption || `${article.title} ${index + 1}`,
    }));

  const featuredRelated = relatedNews[0];
  const compactRelated = relatedNews.slice(1, 3);

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(39,67,128,0.08),transparent_34%),linear-gradient(to_bottom,#f8fafc,#ffffff_45%,#eef2ff)] dark:bg-[radial-gradient(circle_at_top,rgba(39,67,128,0.18),transparent_30%),linear-gradient(to_bottom,#050505,#0b0b0b_42%,#111111)]" />
      <ScrollReveal />

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:py-12">
        <div className="mb-6">
          <Link href={`/${locale}/activities`}>
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToActivities")}
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_390px]">
          <article className="reveal rounded-[28px] border border-slate-200/80 bg-white/92 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-[#171717]/95 dark:shadow-[0_18px_60px_rgba(0,0,0,0.45)] md:p-8 lg:p-10">
            <div className="space-y-6">
              {article.category && (
                <Badge
                  variant="outline"
                  className="w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#274380] dark:text-[#C9D6F0]"
                >
                  {article.category}
                </Badge>
              )}

              <div className="space-y-4">
                <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl md:leading-[1.08] dark:text-white">
                  {article.title}
                </h1>
                {article.excerpt && (
                  <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-lg md:leading-8 dark:text-slate-300">
                    {article.excerpt}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 md:text-sm dark:text-slate-400">
                {article.authorName && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{article.authorName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{article.publishedDate}</span>
                </div>
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Tag className="mt-1 h-4 w-4 text-slate-500 dark:text-slate-400" />
                  {article.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-primary">
                <NewsViewer editorState={article.editorState} />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/90 p-5 dark:border-white/10 dark:bg-white/5">
                <div>
                  <h3 className="text-base font-semibold text-slate-950 md:text-lg dark:text-white">
                    {t("shareArticle")}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {t("shareDescription")}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  {t("shareButton")}
                </Button>
              </div>
            </div>
          </article>

          <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
            <ArticleImageGallery
              title={t("attachments")}
              images={galleryImages}
            />

            <section className="space-y-4">
              {featuredRelated && (
                <RelatedCard article={featuredRelated} locale={locale} />
              )}

              <div className="space-y-4">
                {compactRelated.map((article) => (
                  <RelatedCard
                    key={article.id}
                    article={article}
                    locale={locale}
                    compact
                  />
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
