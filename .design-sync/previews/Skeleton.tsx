import { Skeleton } from "daab-client";

export function Card() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

export function Block() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-32 w-72 rounded-xl" />
      <Skeleton className="h-4 w-72" />
      <Skeleton className="h-4 w-56" />
    </div>
  );
}
