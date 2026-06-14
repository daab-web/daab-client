"use client";

import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, Trash2, X } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Scientist } from "@/types/scientist";
import { deleteScientistProfilePicture } from "@/lib/api/scientists";
import Image from "next/image"

export default function ScientistProfilePicture({
  scientist,
}: {
  scientist: Scientist;
}) {
  const [preview, setPreview] = useState<string | null | undefined>(scientist.photoUrl);
  const [file, setFile] = useState<File | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleRemoveClick = () => {
    if (file) {
      // Discard the not-yet-saved pick, revert to the persisted photo (if any).
      if (preview) URL.revokeObjectURL(preview);
      setFile(null);
      setPreview(scientist.photoUrl ?? null);
      inputRef.current!.value = "";
      return;
    }

    // No pending pick - "preview" is the persisted photo, deleting it is destructive.
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteScientistProfilePicture(scientist.id);
      if (!res.ok) {
        toast.error("Failed to delete profile picture", {
          description: `Status ${res.status}`,
        });
      } else {
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        toast.success("Profile picture deleted");
      }
    } catch {
      toast.error("Failed to delete profile picture", {
        description: "Network error.",
      });
    } finally {
      setIsDeleting(false);
      setConfirmDeleteOpen(false);
    }
  };

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/scientists/${scientist.id}/profile-picture`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to update profile picture (${res.status})`);
      }
    },
    onSuccess: () => toast.success("Profile picture updated"),
    onError: (err: Error) =>
      toast.error("Failed to upload image", { description: err.message }),
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
            <div className="relative mx-auto h-72 w-full max-w-64 overflow-hidden rounded-2xl border border-border/70 bg-background/30 shadow-sm backdrop-blur-sm">
              <Image
                src={preview}
                alt={`${scientist.firstName} ${scientist.lastName}`}
                fill
                sizes="(min-width: 1280px) 248px, 320px"
                className="object-cover transition duration-500 hover:scale-105"
              />
              </div>
              {" "}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveClick}
                className="w-full"
              >
                <X className="mr-2 h-4 w-4" />
                {file ? "Remove Image" : "Delete Image"}
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-center relative mx-auto h-72 w-full max-w-64 overflow-hidden rounded-2xl border border-border/70 bg-background/30 shadow-sm backdrop-blur-sm">
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
          disabled={!file}
          onClick={() => mutate()}
        >
          Save
        </Button>
      </CardFooter>

      <Dialog
        open={confirmDeleteOpen}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setConfirmDeleteOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-md" showCloseButton={!isDeleting}>
          <DialogHeader>
            <DialogTitle>Delete profile picture?</DialogTitle>
            <DialogDescription>
              This will permanently delete the current profile picture.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleConfirmDelete()}
              disabled={isDeleting}
            >
              {isDeleting ? (
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
