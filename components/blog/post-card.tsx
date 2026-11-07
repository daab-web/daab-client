"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, MessageSquare, User } from "lucide-react";

import { Link } from "@/i18n/navigation";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { PostSummary } from "@/types/blog";

export function PostCard({ post }: { post: PostSummary }) {
  const t = useTranslations("Blog");
  const locale = useLocale();

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Card className="h-full justify-between shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md dark:ring-1 dark:ring-white/10">
        <CardHeader>
          <CardAction>
            <Badge variant="outline" className="uppercase">
              {post.locale}
            </Badge>
          </CardAction>
          <CardTitle className="line-clamp-2 text-lg leading-snug text-[#274380] dark:text-[#C9D6F0]">
            {post.title}
          </CardTitle>
          {post.excerpt && (
            <CardDescription className="line-clamp-3">
              {post.excerpt}
            </CardDescription>
          )}
        </CardHeader>
        <CardFooter className="flex flex-col items-start gap-3">
          <div className="flex w-full items-center gap-2 text-xs text-[#274380] dark:text-[#C9D6F0]">
            <User className="h-3 w-3" />
            <span className="truncate">{post.authorName}</span>
            <span className="ml-auto shrink-0">
              {formatDate(post.publishedAt, locale)}
            </span>
          </div>
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {t("commentCount", { count: post.commentCount })}
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-[#274380] dark:text-[#5e7ed8]">
              {t("readMore")}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
