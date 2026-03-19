import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type NewsThumbnailPlaceholderProps = {
  className?: string;
  iconClassName?: string;
};

export function NewsThumbnailPlaceholder({
  className,
  iconClassName,
}: NewsThumbnailPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-muted/60",
        className,
      )}
      aria-hidden
    >
      <ImageIcon
        className={cn("h-10 w-10 text-muted-foreground/70", iconClassName)}
      />
    </div>
  );
}
