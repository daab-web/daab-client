"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Paperclip,
  Upload,
  X,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Attachment } from "./types";

function getFileIcon(file: File) {
  if (file.type.startsWith("image/"))
    return <FileImage className="h-4 w-4 text-blue-500" />;
  if (file.type.startsWith("video/"))
    return <FileVideo className="h-4 w-4 text-purple-500" />;
  if (file.type.startsWith("audio/"))
    return <FileAudio className="h-4 w-4 text-green-500" />;
  if (file.type === "application/pdf" || file.type.includes("text"))
    return <FileText className="h-4 w-4 text-orange-500" />;
  return <File className="h-4 w-4 text-muted-foreground" />;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface AttachmentsCardProps {
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
}

export function AttachmentsCard({
  attachments,
  onAttachmentsChange,
}: AttachmentsCardProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | File[]) => {
    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      caption: null,
    }));
    onAttachmentsChange([...attachments, ...newAttachments]);
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
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const handleRemove = (id: string) => {
    onAttachmentsChange(attachments.filter((a) => a.id !== id));
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
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors",
            isDragOver
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
              Any file type supported
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleInputChange}
          />
        </div>

        {attachments.length > 0 && (
          <>
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="group rounded-lg border bg-muted/20 p-3 space-y-2 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center gap-2">
                    <div className="shrink-0">{getFileIcon(attachment.file)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {attachment.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(attachment.file.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(attachment.id)}
                      className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <Input
                    placeholder="Caption (optional)"
                    value={attachment.caption ?? ""}
                    onChange={(e) => handleCaptionChange(attachment.id, e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {attachments.length} file{attachments.length !== 1 ? "s" : ""} queued —
              will be uploaded after saving
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
