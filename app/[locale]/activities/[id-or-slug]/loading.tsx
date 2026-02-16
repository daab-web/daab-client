import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Back Button Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-9 w-24" />
      </div>

      {/* Article Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-5/6" />
      </div>

      {/* Metadata Skeleton */}
      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Featured Image Skeleton */}
      <Skeleton className="w-full h-96 mb-8 rounded-lg" />

      {/* Tags Skeleton */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24" />
      </div>

      <Separator className="my-8" />

      {/* Content Skeleton */}
      <div className="space-y-4 mb-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
      </div>

      <Separator />

      {/* Share Section Skeleton */}
      <div className="my-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Related Articles Skeleton */}
      <div className="mt-12">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="w-full h-48" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
