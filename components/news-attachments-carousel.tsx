"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { NewsAttachment } from "@/types/news";
import { fetchNewsAttachments } from "@/lib/api/news";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  ImageIcon,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsAttachmentsCarouselProps {
  newsId: string;
  title?: string;
}

function isImageFile(attachment: NewsAttachment): boolean {
  if (attachment.fileType?.startsWith("image/")) return true;
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  return imageExtensions.some((ext) =>
    attachment.fileUrl.toLowerCase().endsWith(ext),
  );
}

function AttachmentThumbnail({
  attachment,
  onClick,
}: {
  attachment: NewsAttachment;
  onClick: () => void;
}) {
  const isImage = isImageFile(attachment);

  if (isImage) {
    return (
      <div
        className="relative aspect-video cursor-pointer group overflow-hidden rounded-lg"
        onClick={onClick}
      >
        <Image
          src={attachment.fileUrl}
          alt={attachment.caption || "Attachment"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
          <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8" />
        </div>
        {attachment.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3">
            <p className="text-white text-sm line-clamp-2">
              {attachment.caption}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <a
      href={attachment.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center aspect-video bg-muted rounded-lg hover:bg-muted/80 transition-colors group"
      onClick={(e) => e.stopPropagation()}
    >
      <FileText className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
      <span className="mt-2 text-sm text-muted-foreground group-hover:text-primary transition-colors">
        {attachment.caption || "Download file"}
      </span>
      <Download className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-primary transition-colors" />
    </a>
  );
}

export function NewsAttachmentsCarousel({
  newsId,
  title,
}: NewsAttachmentsCarouselProps) {
  const [attachments, setAttachments] = useState<NewsAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function loadAttachments() {
      try {
        setLoading(true);
        const response = await fetchNewsAttachments(newsId);
        setAttachments(response.attachments);
      } catch (err) {
        console.error("Failed to fetch attachments:", err);
        setError("Failed to load attachments");
      } finally {
        setLoading(false);
      }
    }

    loadAttachments();
  }, [newsId]);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handlePrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < imageAttachments.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {title && <Skeleton className="h-7 w-32" />}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-video rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error || attachments.length === 0) {
    return null;
  }

  const imageAttachments = attachments.filter(isImageFile);

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-sm text-muted-foreground">
            ({attachments.length})
          </span>
        </div>
      )}

      <div className="px-12">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: attachments.length > 3,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {attachments.map((attachment, index) => (
              <CarouselItem
                key={attachment.id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <Card className="overflow-hidden border-0 shadow-none">
                  <AttachmentThumbnail
                    attachment={attachment}
                    onClick={() => {
                      if (isImageFile(attachment)) {
                        const imageIndex = imageAttachments.findIndex(
                          (a) => a.id === attachment.id,
                        );
                        setSelectedIndex(imageIndex);
                      }
                    }}
                  />
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          {attachments.length > 3 && (
            <>
              <CarouselPrevious className="-left-10" />
              <CarouselNext className="-right-10" />
            </>
          )}
        </Carousel>

        {count > 1 && (
          <div className="flex justify-center gap-1 mt-4">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  current === index + 1
                    ? "bg-primary"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none"
          showCloseButton={true}
        >
          <DialogTitle className="sr-only">
            {imageAttachments[selectedIndex ?? 0]?.caption || "Image preview"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Viewing image {(selectedIndex ?? 0) + 1} of{" "}
            {imageAttachments.length}
          </DialogDescription>
          {selectedIndex !== null && imageAttachments[selectedIndex] && (
            <div className="relative flex items-center justify-center min-h-[60vh] max-h-[90vh]">
              <Image
                src={imageAttachments[selectedIndex].fileUrl}
                alt={imageAttachments[selectedIndex].caption || "Attachment"}
                width={1200}
                height={800}
                className="object-contain max-h-[85vh] w-auto"
                priority
              />

              {/* Navigation buttons */}
              {imageAttachments.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-10 w-10"
                    onClick={handlePrevious}
                    disabled={selectedIndex === 0}
                  >
                    <ChevronLeft className="h-6 w-6" />
                    <span className="sr-only">Previous image</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-10 w-10"
                    onClick={handleNext}
                    disabled={selectedIndex === imageAttachments.length - 1}
                  >
                    <ChevronRight className="h-6 w-6" />
                    <span className="sr-only">Next image</span>
                  </Button>
                </>
              )}

              {/* Caption and counter */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between text-white">
                  <p className="text-sm">
                    {imageAttachments[selectedIndex].caption || ""}
                  </p>
                  <span className="text-sm text-white/70">
                    {selectedIndex + 1} / {imageAttachments.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
