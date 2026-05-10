"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { deleteNews, fetchNews } from "@/lib/api/news";
import { News } from "@/types/news";
import { Loader2, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function NewsManagementPage() {
  const router = useRouter();
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [isListLoading, setIsListLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    void loadNews();
  }, []);

  const loadNews = async () => {
    setIsListLoading(true);
    try {
      const response = await fetchNews(1, 50, "en");
      setNewsItems(response.items);
    } catch {
      toast.error("Could not load news", {
        description: "Please refresh and try again.",
      });
    } finally {
      setIsListLoading(false);
    }
  };

  const extractErrorMessage = async (response: Response) => {
    let errorMessage = "Please try again or check the server response.";
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
      if (errorData.errors) {
        if (Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.join(", ");
        } else {
          errorMessage = Object.values(
            errorData.errors as Record<string, string[]>,
          )
            .flat()
            .join(", ");
        }
      }
    } catch {
      errorMessage = `Server error: ${response.status} ${response.statusText}`;
    }
    return errorMessage;
  };

  const handleDeleteNews = async () => {
    if (!deleteTarget) {
      return;
    }

    const { id, title } = deleteTarget;
    setDeletingId(id);

    try {
      const response = await deleteNews(id);
      if (!response.ok) {
        const message = await extractErrorMessage(response);
        toast.error("Delete failed", {
          description: message,
        });
        return;
      }

      toast.success("Article deleted", {
        description: `\"${title}\" was removed.`,
      });
      setDeleteTarget(null);
      await loadNews();
    } catch {
      toast.error("Delete failed", {
        description: "Network error. Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News Management</h1>
          <p className="text-muted-foreground">
            Manage existing news articles and open them in editor mode.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void loadNews()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh List
          </Button>
          <Button onClick={() => router.push("/admin/news/editor")}>
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Articles</CardTitle>
          <CardDescription>
            Pick an article to edit or remove it permanently.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isListLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading articles...
            </div>
          ) : newsItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No articles found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsItems.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      {article.title}
                    </TableCell>
                    <TableCell>{article.category || "-"}</TableCell>
                    <TableCell>
                      {article.publishedDate}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(`/admin/news/editor?editId=${article.id}`)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          setDeleteTarget({
                            id: article.id,
                            title: article.title,
                          })
                        }
                        disabled={deletingId === article.id}
                      >
                        {deletingId === article.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !deletingId) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent className="max-w-md" showCloseButton={!deletingId}>
          <DialogHeader>
            <DialogTitle>Delete article?</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `This will permanently delete \"${deleteTarget.title}\".`
                : "This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={Boolean(deletingId)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleDeleteNews()}
              disabled={Boolean(deletingId)}
            >
              {deletingId ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
