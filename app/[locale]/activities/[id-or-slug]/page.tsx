import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import NewsViewer from "@/components/news-viewer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calendar, User, Tag, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { getNewsByIdOrSlug } from "@/lib/api/news";
import { News } from "@/types/news";
import { ScrollReveal } from "@/components/scroll-reveal";
import { NewsAttachmentsCarousel } from "@/components/news-attachments-carousel";

type Props = {
  params: Promise<{ locale: string; "id-or-slug": string }>;
};

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

export default async function ArticlePage({ params }: Props) {
  const { locale, "id-or-slug": idOrSlug } = await params;
  const t = await getTranslations({ locale, namespace: "ArticlePage" });

  const article = await getArticleWithContent(idOrSlug, locale);

  if (!article) {
    notFound();
  }

  return (
    <div className="container backdrop-blur-xl mx-auto px-4 py-12 max-w-5xl bg-muted/30 rounded-2xl border">
      <ScrollReveal />

      {/* Back Button */}
      <div className="mb-8 reveal">
        <Link href={`/${locale}/activities`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToActivities")}
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <article className="space-y-8">
        {/* Category Badge */}
        {article.category && (
          <div className="reveal reveal-delay-1">
            <Badge variant="default" className="text-sm px-3 py-1">
              {article.category}
            </Badge>
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight reveal reveal-delay-2">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-xl text-muted-foreground leading-relaxed reveal reveal-delay-3">
            {article.excerpt}
          </p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground reveal reveal-delay-4">
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

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex items-start gap-2 reveal reveal-delay-5">
            <Tag className="h-4 w-4 mt-1 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator className="reveal reveal-delay-6" />

        {/* Featured Image */}

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none reveal">
          <NewsViewer editorState={article.editorState} />
        </div>

        {/* Attachments Carousel */}
        <div className="reveal">
          <NewsAttachmentsCarousel
            newsId={article.id}
            title={t("attachments")}
          />
        </div>

        <Separator className="reveal" />

        {/* Share Section */}
        <div className="flex items-center justify-between bg-muted/30 rounded-lg p-6 reveal">
          <div>
            <h3 className="font-semibold text-lg mb-1">{t("shareArticle")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("shareDescription")}
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            {t("shareButton")}
          </Button>
        </div>

        {/* TODO: fetch related articles from backend */}
        {/*
        <div className="pt-8">
          <h2 className="text-2xl font-bold mb-6">
            {t("relatedArticles")}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            NEWS_ARTICLES.filter((a) => a.id !== article.id)
              .slice(0, 3)
              .map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/${locale}/activities/${relatedArticle.slug}`}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full group">
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={relatedArticle.thumbnail}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))
          </div>
        </div>
        */}
      </article>
    </div>
  );
}
