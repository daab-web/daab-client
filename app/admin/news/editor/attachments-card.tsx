"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
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
import {
  Paperclip,
  Upload,
  X,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  File,
  Loader2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Attachment, ExistingAttachment, isNewAttachment } from "./types";
import { MAX_ATTACHMENT_SIZE_BYTES } from "./constants";
import { deleteNewsAttachment } from "@/lib/api/news";

function getFileIcon(type: string) {
  if (type.startsWith("image/"))
    return <FileImage className="h-4 w-4 text-blue-500" />;
  if (type.startsWith("video/"))
    return <FileVideo className="h-4 w-4 text-purple-500" />;
  if (type.startsWith("audio/"))
    return <FileAudio className="h-4 w-4 text-green-500" />;
  if (type === "application/pdf" || type.includes("text"))
    return <FileText className="h-4 w-4 text-orange-500" />;
  return <File className="h-4 w-4 text-muted-foreground" />;
}

function getFileNameFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname;
    return decodeURIComponent(path.split("/").pop() ?? url);
  } catch {
    return url;
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface AttachmentsCardProps {
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
  newsId?: string;
  disabled?: boolean;
}

export function AttachmentsCard({
  attachments,
  onAttachmentsChange,
  newsId,
  disabled = false,
}: AttachmentsCardProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<ExistingAttachment | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | File[]) => {
    const accepted: Attachment[] = [];
    const tooLarge: string[] = [];

    for (const file of Array.from(files)) {
      if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
        tooLarge.push(file.name);
        continue;
      }
      accepted.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        caption: null,
      });
    }

    if (tooLarge.length > 0) {
      toast.error("File too large", {
        description: `Max size is ${formatBytes(MAX_ATTACHMENT_SIZE_BYTES)}: ${tooLarge.join(", ")}`,
      });
    }

    if (accepted.length > 0) {
      onAttachmentsChange([...attachments, ...accepted]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      addFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const handleRemove = (id: string) => {
    onAttachmentsChange(attachments.filter((a) => a.id !== id));
  };

  const handleConfirmDelete = async () => {
    if (!confirmTarget || !newsId) return;

    const { id } = confirmTarget;
    setDeletingId(id);

    try {
      const res = await deleteNewsAttachment(newsId, id);
      if (!res.ok) {
        toast.error("Delete failed", {
          description: `Could not delete ${getFileNameFromUrl(confirmTarget.fileUrl)}.`,
        });
        return;
      }

      onAttachmentsChange(attachments.filter((a) => a.id !== id));
      toast.success("Attachment deleted");
      setConfirmTarget(null);
    } catch {
      toast.error("Delete failed", {
        description: "Network error. Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleCaptionChange = (id: string, caption: string) => {
    onAttachmentsChange(
      attachments.map((a) => (a.id === id ? { ...a, caption: caption || null } : a)),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paperclip className="h-4 w-4" />
          Attachments
        </CardTitle>
        <CardDescription>
          Attach files to this article (uploaded after saving)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors",
            disabled
              ? "cursor-not-allowed opacity-50 border-muted-foreground/25"
              : "cursor-pointer",
            !disabled && isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20",
          )}
        >
          <div className="rounded-full bg-muted p-2">
            <Upload className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {isDragOver ? "Drop files here" : "Click or drag files"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Any file type supported, up to {formatBytes(MAX_ATTACHMENT_SIZE_BYTES)}
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            disabled={disabled}
            className="hidden"
            onChange={handleInputChange}
          />
        </div>

        {attachments.length > 0 && (
          <>
            <div className="space-y-2">
              {attachments.map((attachment) => {
                const isNew = isNewAttachment(attachment);
                const fileType = (isNew ? attachment.file.type : attachment.fileType) ?? "";
                const fileName = isNew
                  ? attachment.file.name
                  : getFileNameFromUrl(attachment.fileUrl);

                return (
                  <div
                    key={attachment.id}
                    className="group rounded-lg border bg-muted/20 p-3 space-y-2 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-center gap-2">
                      {!isNew && fileType.startsWith("image/") ? (
                        <img
                          src={attachment.fileUrl}
                          alt={fileName}
                          loading="lazy"
                          className="h-8 w-8 shrink-0 rounded object-cover"
                        />
                      ) : (
                        <div className="shrink-0">{getFileIcon(fileType)}</div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {isNew ? formatBytes(attachment.file.size) : "Uploaded"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          isNew
                            ? handleRemove(attachment.id)
                            : setConfirmTarget(attachment)
                        }
                        disabled={disabled || deletingId === attachment.id}
                        className={cn(
                          "shrink-0 rounded p-0.5 text-muted-foreground transition-all hover:text-destructive hover:bg-destructive/10",
                          deletingId === attachment.id
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100 disabled:opacity-0",
                        )}
                      >
                        {deletingId === attachment.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <X className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <Input
                      placeholder="Caption (optional)"
                      value={attachment.caption ?? ""}
                      onChange={(e) => handleCaptionChange(attachment.id, e.target.value)}
                      disabled={disabled}
                      className="h-7 text-xs"
                    />
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {attachments.length} file{attachments.length !== 1 ? "s" : ""} queued —
              will be uploaded after saving
            </p>
          </>
        )}
      </CardContent>

      <Dialog
        open={Boolean(confirmTarget)}
        onOpenChange={(open) => {
          if (!open && !deletingId) {
            setConfirmTarget(null);
          }
        }}
      >
        <DialogContent className="max-w-md" showCloseButton={!deletingId}>
          <DialogHeader>
            <DialogTitle>Delete attachment?</DialogTitle>
            <DialogDescription>
              {confirmTarget
                ? `This will permanently delete "${getFileNameFromUrl(confirmTarget.fileUrl)}".`
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
              onClick={() => setConfirmTarget(null)}
              disabled={Boolean(deletingId)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleConfirmDelete()}
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
    </Card>
  );
}
