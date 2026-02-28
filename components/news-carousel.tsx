"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { formatDate } from "@/lib/date-utils";

interface NewsCarouselProps {
  articles: News[];
  locale: string;
}

export function NewsCarousel({ articles, locale }: NewsCarouselProps) {
  return (
    <div className="mb-12 px-4 md:px-12">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {articles.map((article) => (
            <CarouselItem key={article.id}>
              <Link
                href={`/${locale}/activities/${article.slug || article.id}`}
              >
                <Card className="overflow-hidden border-2 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
                  <div className="grid md:grid-cols-2 gap-0 h-full">
                    <div className="relative w-full aspect-video overflow-hidden bg-muted">
                      {article.thumbnail ? (
                        <Image
                          src={article.thumbnail}
                          alt={article.title}
                          fill
                          className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
                          sizes="(min-width: 768px) 50vw, 100vw"
                        />
                      ) : null}
                      {article.category && (
                        <div className="absolute top-4 left-4">
                          <Badge className="text-sm px-3 py-1 backdrop-blur-sm bg-background/80">
                            {article.category}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader className="p-8 flex flex-col justify-center overflow-hidden">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(article.publishedDate, locale)}
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-2xl mb-3 hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-sm mb-4 line-clamp-2">
                        {article.excerpt}
                      </CardDescription>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                        <User className="h-4 w-4 shrink-0" />
                        <span className="truncate">
                          {article.authorName || "DAAB"}
                        </span>
                      </div>
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {article.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardHeader>
                  </div>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
