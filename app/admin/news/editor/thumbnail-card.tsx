"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Image as ImageIcon, Loader2, Trash2 } from "lucide-react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { NewsFormData } from "./types";
import { toast } from "sonner";
import { deleteNewsThumbnail } from "@/lib/api/news";

interface ThumbnailCardProps {
  register: UseFormRegister<NewsFormData>;
  setValue: UseFormSetValue<NewsFormData>;
  thumbnailPreview: string;
  hasNewThumbnail: boolean;
  isEditMode: boolean;
  originalThumbnailPreview: string;
  onPreviewChange: (preview: string) => void;
  onOriginalPreviewChange: (preview: string) => void;
  onHasNewThumbnailChange: (hasNew: boolean) => void;
  newsId?: string;
  disabled?: boolean;
}

export function ThumbnailCard({
  register,
  setValue,
  thumbnailPreview,
  hasNewThumbnail,
  isEditMode,
  originalThumbnailPreview,
  onPreviewChange,
  onOriginalPreviewChange,
  onHasNewThumbnailChange,
  newsId,
  disabled = false,
}: ThumbnailCardProps) {
  const blobUrlRef = useRef<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingThumbnail, setDeletingThumbnail] = useState(false);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file", { description: "Please select an image file." });
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Invalid file", { description: "File size must be less than 5MB." });
      e.target.value = "";
      return;
    }

    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    const objectUrl = URL.createObjectURL(file);
    blobUrlRef.current = objectUrl;
    onPreviewChange(objectUrl);
    onHasNewThumbnailChange(true);
  };

  const handleRemoveThumbnail = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setValue("thumbnail", undefined);
    onPreviewChange(isEditMode ? originalThumbnailPreview : "");
    onHasNewThumbnailChange(false);
  };

  const handleConfirmDeleteThumbnail = async () => {
    if (!newsId) return;

    setDeletingThumbnail(true);
    try {
      const res = await deleteNewsThumbnail(newsId);
      if (!res.ok) {
        toast.error("Delete failed", {
          description: "Could not delete the current thumbnail.",
        });
        return;
      }

      onPreviewChange("");
      onOriginalPreviewChange("");
      toast.success("Thumbnail deleted");
      setConfirmDeleteOpen(false);
    } catch {
      toast.error("Delete failed", {
        description: "Network error. Please try again.",
      });
    } finally {
      setDeletingThumbnail(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thumbnail Image</CardTitle>
        <CardDescription>Add a cover image for your article</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="thumbnail">Upload Image</Label>
          <Input
            id="thumbnail"
            type="file"
            accept="image/*"
            disabled={disabled}
            {...register("thumbnail")}
            onChange={handleThumbnailChange}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">
            Max file size: 5MB. Accepted formats: JPG, PNG, GIF, WebP
          </p>
          {isEditMode && (
            <p className="text-xs text-muted-foreground">
              Uploading a new file replaces the current image.
            </p>
          )}
        </div>

        {thumbnailPreview ? (
          <div className="space-y-2">
            <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="w-full h-full object-cover"
              />
            </div>
            {hasNewThumbnail && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveThumbnail}
                disabled={disabled}
                className="w-full"
              >
                <X className="mr-2 h-4 w-4" />
                Remove New Image
              </Button>
            )}
            {isEditMode && originalThumbnailPreview && !hasNewThumbnail && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setConfirmDeleteOpen(true)}
                disabled={disabled}
                className="w-full text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Current Thumbnail
              </Button>
            )}
          </div>
        ) : (
          <div className="aspect-video rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/10">
            <div className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">No image yet</p>
            </div>
          </div>
        )}
      </CardContent>

      <Dialog
        open={confirmDeleteOpen}
        onOpenChange={(open) => {
          if (!open && !deletingThumbnail) {
            setConfirmDeleteOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-md" showCloseButton={!deletingThumbnail}>
          <DialogHeader>
            <DialogTitle>Delete thumbnail?</DialogTitle>
            <DialogDescription>
              This will permanently delete the current thumbnail image.
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDeleteOpen(false)}
              disabled={deletingThumbnail}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleConfirmDeleteThumbnail()}
              disabled={deletingThumbnail}
            >
              {deletingThumbnail ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
