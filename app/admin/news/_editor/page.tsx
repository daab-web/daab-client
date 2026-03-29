"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import NewsEditor from "@/components/news-editor";
import NewsViewer from "@/components/news-viewer";
import { getNewsByIdOrSlug } from "@/lib/api/news";
import {
  Loader2,
  Plus,
  Save,
  Eye,
  Calendar as CalendarIcon,
  User,
  X,
  Image as ImageIcon,
  Paperclip,
  Upload,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  File,
} from "lucide-react";
import { SerializedEditorState } from "lexical";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CATEGORIES, COMMON_TAGS } from "./constants";
import { createNewsOpts, useCreateNewsMutation } from "./hooks";

interface Attachment {
  id: string;
  file: File;
  caption: string | null;
}

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

interface NewsFormData {
  title: string;
  excerpt: string;
  thumbnail?: FileList;
  category: string;
  authorName: string;
  publishedDate: Date;
}

const DEFAULT_FORM_VALUES: Omit<NewsFormData, "thumbnail"> = {
  title: "",
  excerpt: "",
  category: "",
  authorName: "",
  publishedDate: new Date(),
};

export default function NewsEditorPage() {
  const router = useRouter();
  const [editId, setEditId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<NewsFormData>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [originalThumbnailPreview, setOriginalThumbnailPreview] = useState("");
  const [hasNewThumbnail, setHasNewThumbnail] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [editorState, setEditorState] = useState<SerializedEditorState | null>(
    null,
  );
  const [editorKey, setEditorKey] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useCreateNewsMutation();

  const watchTitle = watch("title");
  const watchPublishedDate = watch("publishedDate");

  const resetFormForCreate = () => {
    reset(DEFAULT_FORM_VALUES);
    setTags([]);
    setTagInput("");
    setEditorState(null);
    setThumbnailPreview("");
    setOriginalThumbnailPreview("");
    setHasNewThumbnail(false);
    setEditingNewsId(null);
    setEditorKey((prev) => prev + 1);
  };

  const loadNewsForEdit = async (id: string) => {
    setIsLoadingArticle(true);
    try {
      const article = await getNewsByIdOrSlug(id, "en");
      setEditingNewsId(article.id);
      setValue("title", article.title);
      setValue("excerpt", article.excerpt ?? "");
      setValue("category", article.category ?? "");
      setValue("authorName", article.authorName ?? "");
      setValue(
        "publishedDate",
        article.publishedDate ? new Date(article.publishedDate) : new Date(),
      );
      setTags(Array.isArray(article.tags) ? article.tags : []);
      setEditorState(article.editorState ?? null);
      const existingThumbnail = article.thumbnail ?? "";
      setThumbnailPreview(existingThumbnail);
      setOriginalThumbnailPreview(existingThumbnail);
      setHasNewThumbnail(false);
      setEditorKey((prev) => prev + 1);
      toast.success("Edit mode enabled", {
        description: `You are now editing \"${article.title}\".`,
      });
    } catch {
      toast.error("Could not open article", {
        description: "Please try again.",
      });
    } finally {
      setIsLoadingArticle(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEditId(params.get("editId"));
  }, []);

  useEffect(() => {
    if (!editId) {
      return;
    }

    void loadNewsForEdit(editId);
  }, [editId]);

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file", {
          description: "Please select an image file.",
        });
        e.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Invalid file", {
          description: "File size must be less than 5MB.",
        });
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
        setHasNewThumbnail(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveThumbnail = () => {
    setValue("thumbnail", undefined);
    setThumbnailPreview(editingNewsId ? originalThumbnailPreview : "");
    setHasNewThumbnail(false);
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("title", e.target.value);
  };

  const addAttachmentFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newAttachments: Attachment[] = fileArray.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      caption: null,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const handleAttachmentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      addAttachmentFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleAttachmentDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addAttachmentFiles(e.dataTransfer.files);
    }
  };

  const handleAttachmentDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleAttachmentDragLeave = () => setIsDragOver(false);

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAttachmentCaptionChange = (id: string, caption: string) => {
    setAttachments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, caption: caption || null } : a)),
    );
  };

  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News Editor</h1>
          <p className="text-muted-foreground">
            {isLoadingArticle
              ? "Loading article..."
              : editingNewsId
                ? "Editing selected article"
                : "Create a new news article"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/news/management")}
          >
            Manage Articles
          </Button>
          {editingNewsId && (
            <Button
              variant="outline"
              onClick={() => {
                resetFormForCreate();
                router.push("/admin/news/editor");
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Button>
          )}
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {editingNewsId ? "Update" : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
              <CardDescription>
                Enter the basic information about your article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter article title"
                  {...register("title", { required: "Title is required" })}
                  onChange={handleTitleChange}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="A brief summary of the article (1-2 sentences)"
                  {...register("excerpt")}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Write your article content using the rich text editor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NewsEditor
                key={editorKey}
                initialEditorState={editorState}
                onContentChange={setEditorState}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thumbnail Image</CardTitle>
              <CardDescription>
                Add a cover image for your article
              </CardDescription>
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
                {editingNewsId ? (
                  <p className="text-xs text-muted-foreground">
                    Uploading a new file replaces the current image.
                  </p>
                ) : null}
              </div>
              {thumbnailPreview && (
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {hasNewThumbnail ? (
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
                  ) : null}
                </div>
              )}
              {!thumbnailPreview && (
                <div className="aspect-video rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/10">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      No image yet
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
              <CardDescription>Additional article information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorName">Author</Label>
                <Input
                  id="authorName"
                  placeholder="Author name"
                  {...register("authorName")}
                />
              </div>

              <div className="space-y-2">
                <Label>Published Date</Label>
                <Controller
                  name="publishedDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => date && field.onChange(date)}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Add relevant tags to your article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tags">Add Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Type a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleAddTag(tagInput)}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Quick Add
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_TAGS.filter((tag) => !tags.includes(tag))
                    .slice(0, 8)
                    .map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleAddTag(tag)}
                      >
                        + {tag}
                      </Button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

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
              {/* Drop zone */}
              <div
                onDrop={handleAttachmentDrop}
                onDragOver={handleAttachmentDragOver}
                onDragLeave={handleAttachmentDragLeave}
                onClick={() => attachmentInputRef.current?.click()}
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
                  ref={attachmentInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleAttachmentInputChange}
                />
              </div>

              {/* Attachment list */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="group rounded-lg border bg-muted/20 p-3 space-y-2 transition-colors hover:bg-muted/40"
                    >
                      <div className="flex items-center gap-2">
                        <div className="shrink-0">
                          {getFileIcon(attachment.file)}
                        </div>
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
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <Input
                        placeholder="Caption (optional)"
                        value={attachment.caption ?? ""}
                        onChange={(e) =>
                          handleAttachmentCaptionChange(
                            attachment.id,
                            e.target.value,
                          )
                        }
                        className="h-7 text-xs"
                      />
                    </div>
                  ))}
                </div>
              )}

              {attachments.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {attachments.length} file
                  {attachments.length !== 1 ? "s" : ""} queued — will be
                  uploaded after saving
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
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
                  alt={watchTitle}
                  className="w-full h-full object-cover"
                />
                {watch("category") && (
                  <div className="absolute top-4 left-4">
                    <Badge className="text-sm px-3 py-1">
                      {watch("category")}
                    </Badge>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                {watchTitle || "Untitled Article"}
              </h1>

              {watch("excerpt") && (
                <p className="text-lg text-muted-foreground">
                  {watch("excerpt")}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {watchPublishedDate
                      ? format(watchPublishedDate, "PPP")
                      : "Unpublished"}
                  </span>
                </div>
                {watch("authorName") && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{watch("authorName")}</span>
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
    </div>
  );
}
