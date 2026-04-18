import { News } from "@/types/news"
import { Card, CardHeader, CardTitle, CardAction, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image";
import { getLocale } from "next-intl/server";
import { User } from "lucide-react";
import { formatDate } from "@/lib/date-utils";

export interface NewsCardProps {
  article: News;
}

export default async function NewsCard({ article }: NewsCardProps) {
  const locale = await getLocale();

  return (
    <Card className="mx-auto w-full h-full max-w-sm pt-0 overflow-hidden hover:border-primary/40">
      <div className="relative aspect-video w-full">
        <Image
          src={article.thumbnail}
          alt={article.title}
          className="object-cover"
          fill
        />
      </div>
      <CardHeader>
        {article.category &&
          <CardAction>
            <Badge variant="secondary">{article.category}</Badge>
          </CardAction>}
        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
        <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
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

        <div className="flex items-center gap-2 text-xs text-muted-foreground w-full pt-3">
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
  );
}
