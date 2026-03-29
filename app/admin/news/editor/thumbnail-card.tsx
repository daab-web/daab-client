"use client";

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
import { X, Image as ImageIcon } from "lucide-react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { NewsFormData } from "./types";
import { toast } from "sonner";

interface ThumbnailCardProps {
  register: UseFormRegister<NewsFormData>;
  setValue: UseFormSetValue<NewsFormData>;
  thumbnailPreview: string;
  hasNewThumbnail: boolean;
  isEditMode: boolean;
  originalThumbnailPreview: string;
  onPreviewChange: (preview: string) => void;
  onHasNewThumbnailChange: (hasNew: boolean) => void;
}

export function ThumbnailCard({
  register,
  setValue,
  thumbnailPreview,
  hasNewThumbnail,
  isEditMode,
  originalThumbnailPreview,
  onPreviewChange,
  onHasNewThumbnailChange,
}: ThumbnailCardProps) {
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

    const reader = new FileReader();
    reader.onloadend = () => {
      onPreviewChange(reader.result as string);
      onHasNewThumbnailChange(true);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveThumbnail = () => {
    setValue("thumbnail", undefined);
    onPreviewChange(isEditMode ? originalThumbnailPreview : "");
    onHasNewThumbnailChange(false);
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
                className="w-full"
              >
                <X className="mr-2 h-4 w-4" />
                Remove New Image
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
    </Card>
  );
}
