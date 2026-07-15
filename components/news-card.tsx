import { News } from "@/types/news";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ImageIcon, User } from "lucide-react";

export interface NewsCardProps {
  article: News;
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <Card className="group mx-auto h-full w-full max-w-sm overflow-hidden pt-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md dark:ring-1 dark:ring-white/10">
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden">
        {article.thumbnail ? (
          <Image
            src={article.thumbnail}
            alt={article.title}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fill
          />
        ) : (
          <ImageIcon />
        )}
      </div>
      <CardHeader>
        {article.category && (
          <CardAction>
            <Badge variant="secondary">{article.category}</Badge>
          </CardAction>
        )}
        <CardTitle className="line-clamp-2 text-[#274380] dark:text-[#C9D6F0]">
          {article.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
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

        <div className="flex items-center gap-2 text-xs text-[#274380] dark:text-[#C9D6F0] w-full pt-3">
          <User className="h-3 w-3" />
          <span className="truncate">{article.authorName || "DAAB"}</span>
          <span className="ml-auto text-xs">{article.publishedDate}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
