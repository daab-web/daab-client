import NextLink from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { SerializedEditorState } from "lexical";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  FileClock,
  Pencil,
  User,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import NewsViewer from "@/components/news-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CommentsSection } from "@/components/blog/comments-section";
import { fetchPost } from "@/lib/api/blog";
import { authHeaders } from "@/lib/api/server-auth";
import { formatDate } from "@/lib/format";
import { Post } from "@/types/blog";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// Authors may open their own drafts, so the request carries the session token.
async function loadPost(slug: string): Promise<Post | null> {
  try {
    return await fetchPost(slug, { headers: await authHeaders() });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

function parseEditorState(json: string): SerializedEditorState | undefined {
  try {
    return JSON.parse(json);
  } catch {
    return undefined;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  return post
    ? { title: post.title, description: post.excerpt || undefined }
    : {};
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });

  const post = await loadPost(slug);
  if (!post) notFound();

  const isPublished = post.status === "Published";

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(39,67,128,0.08),transparent_34%),linear-gradient(to_bottom,#f8fafc,#ffffff_45%,#eef2ff)] dark:bg-[radial-gradient(circle_at_top,rgba(39,67,128,0.18),transparent_30%),linear-gradient(to_bottom,#050505,#0b0b0b_42%,#111111)]" />
      <ScrollReveal />

      <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 lg:py-12">
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToBlog")}
            </Link>
          </Button>
        </div>

        {!isPublished && (
          <Alert
            variant={post.status === "Rejected" ? "destructive" : "default"}
            className="mb-6"
          >
            {post.status === "Rejected" ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <FileClock className="h-4 w-4" />
            )}
            <AlertTitle>
              {post.status === "Rejected" ? t("rejectedNotice") : t("draftNotice")}
            </AlertTitle>
            <AlertDescription className="space-y-3">
              {post.verificationFeedback && (
                <ul className="list-disc space-y-1 pl-4">
                  {post.verificationFeedback.split("\n").map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              )}
              <Button asChild size="sm" variant="outline">
                <NextLink href={`/admin/blogs/editor?id=${post.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  {t("edit")}
                </NextLink>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <article className="reveal rounded-[28px] border border-slate-200/80 bg-white/92 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-8 lg:p-10 dark:border-white/10 dark:bg-[#171717]/95 dark:shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
          <div className="space-y-6">
            <Badge
              variant="outline"
              className="w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#274380] dark:text-[#C9D6F0]"
            >
              {t(`languages.${post.locale}`)}
            </Badge>

            <div className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl md:leading-[1.08] dark:text-white">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-sm leading-7 text-slate-600 md:text-lg md:leading-8 dark:text-slate-300">
                  {post.excerpt}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 md:text-sm dark:text-slate-400">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.scientistId ? (
                  <Link
                    href={`/scientists/${post.scientistId}`}
                    className="font-medium text-[#274380] underline-offset-4 hover:underline dark:text-[#C9D6F0]"
                  >
                    {post.authorName}
                  </Link>
                ) : (
                  <span>{post.authorName}</span>
                )}
              </div>
              {post.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt, locale)}
                  </time>
                </div>
              )}
            </div>

            <Separator />

            <div className="prose prose-slate max-w-none dark:prose-invert prose-a:text-primary">
              <NewsViewer editorState={parseEditorState(post.editorState)} />
            </div>
          </div>
        </article>

        {isPublished && (
          <div className="reveal mt-8 rounded-[28px] border border-slate-200/80 bg-white/92 p-5 md:p-8 dark:border-white/10 dark:bg-[#171717]/95">
            <CommentsSection postId={post.id} postAuthorId={post.authorId} />
          </div>
        )}
      </div>
    </div>
  );
}
