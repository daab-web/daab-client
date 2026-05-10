"use client";

import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { News } from "@/types/news";
import { useFormatter, useLocale } from "next-intl";

interface NewsCarouselProps {
  articles: News[];
}

export function NewsCarousel({ articles }: NewsCarouselProps) {
  const format = useFormatter();
  const locale = useLocale();

  return (
    <div className="mb-12 px-4 md:px-12">
      <Carousel
        opts={{
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {articles.map(a => <CarouselCard key={a.id} article={a} locale={locale} format={format} />)}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

function CarouselCard({ article, locale }: { article: News, locale: string, format: any }) {
  return (
    <CarouselItem key={article.id}>
      <Link href={`/${locale}/activities/${article.slug || article.id}`}>
        <div className="grid md:grid-cols-2 overflow-hidden rounded-lg border-2 bg-card hover:shadow-xl transition-all duration-300 cursor-pointer h-full">

          {/* Image side */}
          <div className="relative w-full aspect-video overflow-hidden bg-muted">
            {article.thumbnail && (
              <Image src={article.thumbnail} alt={article.title} fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            )}
            {article.category && (
              <div className="absolute top-4 left-4">
                <Badge variant="outline" className="backdrop-blur-sm bg-background/80">
                  {article.category}
                </Badge>
              </div>
            )}
          </div>

          {/* Content side */}
          <div className="p-8 flex flex-col justify-center overflow-hidden">
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
              <Calendar className="h-4 w-4" />
              <span>{article.publishedDate}</span>
            </div>
            <h3 className="text-2xl font-semibold mb-3 hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="h-4 w-4 shrink-0" />
              <span className="truncate">{article.authorName || "DAAB"}</span>
            </div>
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {article.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            )}
          </div>

        </div>
      </Link>
    </CarouselItem>
  )
}
