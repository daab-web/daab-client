"use client";

import { useState } from "react";
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
import {
  Save,
  Eye,
  Calendar as CalendarIcon,
  User,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { SerializedEditorState } from "lexical";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CATEGORIES = [
  "Events",
  "Research",
  "Awards",
  "Education",
  "Programs",
  "Announcements",
];

const COMMON_TAGS = [
  "Assembly",
  "Annual Meeting",
  "Collaboration",
  "Research",
  "Europe",
  "Awards",
  "Excellence",
  "Recognition",
  "Webinar",
  "Climate",
  "Education",
  "Scholarship",
  "Young Researchers",
  "Support",
  "Conference",
  "Digital Humanities",
  "Technology",
];

interface NewsFormData {
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: FileList;
  category: string;
  authorName: string;
  publishedDate: Date;
}

export default function NewsEditorPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<NewsFormData>({
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      category: "",
      authorName: "",
      publishedDate: new Date(),
    },
  });

  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [editorState, setEditorState] = useState<SerializedEditorState | null>(
    null,
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Watch form values for preview and slug generation
  const watchTitle = watch("title");
  const watchThumbnail = watch("thumbnail");
  const watchPublishedDate = watch("publishedDate");

  const onSubmit = async (data: NewsFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("excerpt", data.excerpt);
    formData.append("category", data.category);
    formData.append("authorName", data.authorName);
    formData.append("tags", JSON.stringify(tags));
    formData.append(
      "publishedDate",
      data.publishedDate.toISOString().split("T")[0],
    );
    formData.append("editorState", JSON.stringify(editorState));

    if (data.thumbnail?.[0]) {
      formData.append("thumbnail", data.thumbnail[0]);
    }

    // TODO: vro, its 5am
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/news`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
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
              errorMessage = Object.values(errorData.errors).flat().join(", ");
            }
          }
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        toast.error("Save failed", {
          description: errorMessage,
        });
        return;
      }

      toast.success("Article saved", {
        description: "Your news article was saved successfully.",
      });
    } catch (err) {
      console.log("unable to do shit", err);
      toast.error("Save failed", {
        description: "Network error. Please try again.",
      });
    }
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        e.target.value = "";
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        e.target.value = "";
        return;
      }

      // Generate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveThumbnail = () => {
    setValue("thumbnail", {} as FileList);
    setThumbnailPreview("");
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

  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue("title", newTitle);
    if (!watch("slug")) {
      setValue("slug", generateSlug(newTitle));
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News Editor</h1>
          <p className="text-muted-foreground">Create and edit news articles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSubmit(onSubmit)}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Main Content - 2 columns */}
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
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  placeholder="article-url-slug"
                  {...register("slug", { required: "Slug is required" })}
                />
                {errors.slug && (
                  <p className="text-xs text-destructive">
                    {errors.slug.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Auto-generated from title, but you can edit it
                </p>
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
              <NewsEditor onContentChange={setEditorState} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveThumbnail}
                    className="w-full"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove Image
                  </Button>
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
                  <span>{format(watchPublishedDate, "PPP")}</span>
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
