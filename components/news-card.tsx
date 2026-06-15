import { News } from "@/types/news"
import { Card, CardHeader, CardTitle, CardAction, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image";
import { ImageIcon, User } from "lucide-react";

export interface NewsCardProps {
  article: News;
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <Card className="mx-auto w-full h-full max-w-sm pt-0 overflow-hidden hover:border-primary/40">
      <div className="relative flex items-center justify-center aspect-video w-full">
        {article.thumbnail ? (
          <Image
            src={article.thumbnail}
            alt={article.title}
            className="object-cover"
            fill
          />) : <ImageIcon />}
      </div>
      <CardHeader>
        {article.category &&
          <CardAction>
            <Badge variant="secondary">{article.category}</Badge>
          </CardAction>}
        <CardTitle className="line-clamp-2 text-[#274380] dark:text-[#C9D6F0]">
          {article.title}
        </CardTitle>
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

        <div className="flex items-center gap-2 text-xs text-[#274380] dark:text-[#C9D6F0] w-full pt-3">
          <User className="h-3 w-3" />
          <span className="truncate">
            {article.authorName || "DAAB"}
          </span>
          <span className="ml-auto text-xs">{article.publishedDate}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
