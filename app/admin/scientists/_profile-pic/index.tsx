"use client";

import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Scientist } from "@/types/scientist";

export default function ScientistProfilePicture({
  scientist,
}: {
  scientist: Scientist;
}) {
  const [preview, setPreview] = useState<string | null | undefined>(scientist.photoUrl);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Invalid file", {
        description: "File size must be less than 5MB.",
      });
      e.target.value = "";
      return;
    }

    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    inputRef.current!.value = "";
  };

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/scientists/${scientist.id}/profile-picture`,
        {
          method: "PUT",
          body: formData,
        },
      );
    },
    onSuccess: () => toast.success("Profile picture updated"),
    onError: () => toast.error("Failed to upload image"),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile picture</CardTitle>
        <CardDescription>Add a profile image for scientist</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="thumbnail">Upload Image</Label>
          <Input
            id="thumbnail"
            type="file"
            accept="image/*"
            className="cursor-pointer"
            ref={inputRef}
            onChange={handleThumbnailChange}
          />
          <p className="text-xs text-muted-foreground">
            Max file size: 5MB. Accepted formats: JPG, PNG, GIF, WebP
          </p>
        </div>
        <div className="space-y-2">
          {preview ? (
            <>
              <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                <img
                  src={preview}
                  alt="Thumbnail preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>{" "}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                className="w-full"
              >
                <X className="mr-2 h-4 w-4" />
                Remove Image
              </Button>
            </>
          ) : (
            <div className="aspect-video rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/10">
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No image yet
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={preview === null}
          onClick={() => mutate()}
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
