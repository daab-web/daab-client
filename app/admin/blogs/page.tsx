"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, Loader2, Pencil, Plus, RefreshCw, Send, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";
import { deletePost, fetchAllPosts, fetchMyPosts, submitPost } from "@/lib/api/blog";
import { isAdmin, isScientist } from "@/types/session";
import { PostStatus } from "@/types/blog";
import { StatusBadge } from "./status-badge";

type Row = {
  id: string;
  slug: string;
  title: string;
  sourceLocale: string;
  locales: string[];
  status: PostStatus;
  verificationFeedback: string | null;
  updatedAt: string;
  commentCount: number;
  authorName?: string;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { dateStyle: "medium" });

export default function BlogsPage() {
  const { user, isLoading } = useSession();
  const scientist = isScientist(user);
  const admin = isAdmin(user);

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!scientist && !admin) {
    return (
      <Alert variant="destructive" className="max-w-2xl">
        <AlertTitle>No access</AlertTitle>
        <AlertDescription>Sign in with a scientist or admin account.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
          <p className="text-muted-foreground">
            {scientist
              ? "Write, edit, publish and delete your posts."
              : "Review and remove posts by any author."}
          </p>
        </div>
        {scientist && (
          <Button asChild>
            <Link href="/admin/blogs/editor">
              <Plus className="mr-2 h-4 w-4" />
              New post
            </Link>
          </Button>
        )}
      </div>

      {scientist && admin ? (
        <Tabs defaultValue="mine">
          <TabsList>
            <TabsTrigger value="mine">My posts</TabsTrigger>
            <TabsTrigger value="all">All posts</TabsTrigger>
          </TabsList>
          <TabsContent value="mine">
            <MyPosts />
          </TabsContent>
          <TabsContent value="all">
            <AllPosts />
          </TabsContent>
        </Tabs>
      ) : scientist ? (
        <MyPosts />
      ) : (
        <AllPosts />
      )}
    </div>
  );
}

function MyPosts() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["blog", "my-posts"],
    queryFn: fetchMyPosts,
  });

  return (
    <PostsTable
      title="My posts"
      description="Drafts, published posts and verification results."
      rows={data}
      isLoading={isLoading}
      error={error}
      onRefresh={refetch}
      isFetching={isFetching}
      editable
    />
  );
}

function AllPosts() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["blog", "all-posts"],
    queryFn: () => fetchAllPosts(1, 100),
    select: (page) => page.items,
  });

  return (
    <PostsTable
      title="All posts"
      description="Every post by every author, in any status."
      rows={data}
      isLoading={isLoading}
      error={error}
      onRefresh={refetch}
      isFetching={isFetching}
      showAuthor
    />
  );
}

function PostsTable({
  title,
  description,
  rows,
  isLoading,
  error,
  onRefresh,
  isFetching,
  editable = false,
  showAuthor = false,
}: {
  title: string;
  description: string;
  rows: Row[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
  isFetching: boolean;
  editable?: boolean;
  showAuthor?: boolean;
}) {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["blog"] });

  const publish = useMutation({
    mutationFn: (id: string) => submitPost(id),
    onSuccess: (result) => {
      if (result.status === "Published") toast.success("Post published");
      else toast.error("The post did not pass content verification");
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      toast.success("Post deleted");
      setDeleteTarget(null);
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isFetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load posts</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading…
          </div>
        ) : !rows || rows.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No posts yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                {showAuthor && <TableHead>Author</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead>Languages</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="max-w-xs">
                    <div className="truncate font-medium">{post.title}</div>
                    {post.status === "Rejected" && post.verificationFeedback && (
                      <div className="mt-1 whitespace-normal text-xs text-destructive">
                        {post.verificationFeedback.split("\n")[0]}
                      </div>
                    )}
                  </TableCell>
                  {showAuthor && <TableCell>{post.authorName}</TableCell>}
                  <TableCell>
                    <StatusBadge status={post.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {post.locales.map((l) => (
                        <Badge
                          key={l}
                          variant={l === post.sourceLocale ? "secondary" : "outline"}
                          className="uppercase"
                          title={l === post.sourceLocale ? "Original language" : "Translation"}
                        >
                          {l}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{post.commentCount}</TableCell>
                  <TableCell>{formatDate(post.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" aria-label="View">
                        <Link href={`/${post.sourceLocale}/blog/${post.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {editable && (
                        <>
                          <Button asChild variant="ghost" size="icon" aria-label="Edit">
                            <Link href={`/admin/blogs/editor?id=${post.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          {post.status !== "Published" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Publish"
                              disabled={publish.isPending}
                              onClick={() => publish.mutate(post.id)}
                            >
                              {publish.isPending && publish.variables === post.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(post)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete post</DialogTitle>
            <DialogDescription>
              Delete <span className="font-semibold">{deleteTarget?.title}</span> and its
              comments? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={remove.isPending}
              onClick={() => deleteTarget && remove.mutate(deleteTarget.id)}
            >
              {remove.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
