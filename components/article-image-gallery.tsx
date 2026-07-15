"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Maximize2,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export type GalleryImage = {
  src: string;
  alt: string;
};

type Props = {
  title: string;
  images: GalleryImage[];
};

export function ArticleImageGallery({ title, images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<string[]>([]);

  if (images.length === 0) {
    return null;
  }

  const selectedImage = selectedIndex === null ? null : images[selectedIndex];
  const heroImage = images[0];
  const thumbnailImages = images.slice(1, 5);
  const isImageFailed = (src: string) => failedImages.includes(src);

  const markImageAsFailed = (src: string) => {
    setFailedImages((current) =>
      current.includes(src) ? current : [...current, src],
    );
  };

  const openAt = (index: number) => setSelectedIndex(index);
  const close = () => setSelectedIndex(null);
  const previous = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(Math.max(selectedIndex - 1, 0));
  };
  const next = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(Math.min(selectedIndex + 1, images.length - 1));
  };

  return (
    <>
      <section className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white/92 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-[#171717]/95 dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
        <div className="space-y-3 p-4 md:p-5">
          <div className="group relative aspect-4/3 overflow-hidden rounded-[22px] bg-muted dark:bg-[#121212]">
            {!isImageFailed(heroImage.src) ? (
              <>
                <button
                  type="button"
                  className="absolute inset-0 z-10"
                  onClick={() => openAt(0)}
                  aria-label={`Open ${title}`}
                />
                <Image
                  src={heroImage.src}
                  alt={heroImage.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 390px"
                  priority
                  onError={() => markImageAsFailed(heroImage.src)}
                />
                <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/45 p-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <Maximize2 className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-100 via-white to-slate-200 text-slate-400 dark:from-[#1a1a1a] dark:via-[#141414] dark:to-[#202020]">
                <ImageIcon className="h-10 w-10" />
              </div>
            )}
          </div>

          {thumbnailImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {thumbnailImages.map((image, index) => {
                const realIndex = index + 1;
                const showMore = index === 3 && images.length > 5;
                const failed = isImageFailed(image.src);

                return (
                  <button
                    key={`${image.src}-${index}`}
                    type="button"
                    className="relative aspect-square overflow-hidden rounded-xl border border-slate-200/80 bg-muted dark:border-white/10"
                    onClick={() => !failed && openAt(realIndex)}
                    aria-label={failed ? `${image.alt} unavailable` : `Open ${image.alt}`}
                    disabled={failed}
                  >
                    {!failed ? (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="96px"
                        onError={() => markImageAsFailed(image.src)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-100 via-white to-slate-200 text-slate-400 dark:from-[#1a1a1a] dark:via-[#141414] dark:to-[#202020]">
                        <ImageIcon className="h-7 w-7" />
                      </div>
                    )}
                    {showMore && !failed && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-base font-semibold text-white">
                        +{images.length - 5}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && close()}
      >
        <DialogContent
          className="w-[96vw] max-w-7xl border-none bg-black/95 p-0 text-white sm:max-w-[96vw]"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">
            {selectedImage?.alt || title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Viewing image {(selectedIndex ?? 0) + 1} of {images.length}
          </DialogDescription>

          {selectedImage && (
            <div className="relative flex min-h-[60vh] items-center justify-center">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1400}
                height={1000}
                className="max-h-[85vh] w-auto object-contain"
                priority
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/75 disabled:pointer-events-none disabled:opacity-50"
                    onClick={previous}
                    disabled={selectedIndex === 0}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/75 disabled:pointer-events-none disabled:opacity-50"
                    onClick={next}
                    disabled={selectedIndex === images.length - 1}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between gap-4 text-white">
                  <p className="text-sm">{selectedImage.alt}</p>
                  <span className="text-sm text-white/70">
                    {(selectedIndex ?? 0) + 1} / {images.length}
                  </span>
                </div>
              </div>

              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-3 top-3 rounded-full bg-black/50 text-white hover:bg-black/75"
                >
                  <XIcon className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogClose>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
