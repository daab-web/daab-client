"use client";

import { SerializedEditorState } from "lexical";
import { format, isValid } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon, User } from "lucide-react";
import NewsViewer from "@/components/news-viewer";

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  excerpt: string;
  category: string;
  authorName: string;
  publishedDate: Date;
  thumbnailPreview: string;
  tags: string[];
  editorState?: SerializedEditorState;
}

export function PreviewDialog({
  open,
  onOpenChange,
  title,
  excerpt,
  category,
  authorName,
  publishedDate,
  thumbnailPreview,
  tags,
  editorState,
}: PreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Article Preview</DialogTitle>
          <DialogDescription>
            Preview how your article will appear to readers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {thumbnailPreview && (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={thumbnailPreview}
                alt={title}
                className="w-full h-full object-cover"
              />
              {category && (
                <div className="absolute top-4 left-4">
                  <Badge className="text-sm px-3 py-1">{category}</Badge>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              {title || "Untitled Article"}
            </h1>

            {excerpt && (
              <p className="text-lg text-muted-foreground">{excerpt}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {publishedDate && isValid(new Date(publishedDate))
                    ? format(new Date(publishedDate), "PPP")
                    : "Unpublished"}
                </span>
              </div>
              {authorName && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{authorName}</span>
                </div>
              )}
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <NewsViewer editorState={editorState} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
