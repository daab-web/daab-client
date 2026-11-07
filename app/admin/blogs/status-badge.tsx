import { Badge } from "@/components/ui/badge";
import { PostStatus } from "@/types/blog";

const variants: Record<PostStatus, "default" | "secondary" | "destructive"> = {
  Published: "default",
  Draft: "secondary",
  Rejected: "destructive",
};

export function StatusBadge({ status }: { status: PostStatus }) {
  return <Badge variant={variants[status]}>{status}</Badge>;
}
