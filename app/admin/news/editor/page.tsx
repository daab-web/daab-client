"use client";

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
import { Loader2, Plus, Save, Eye } from "lucide-react";
import dynamic from "next/dynamic";
const Editor = dynamic(
  () => import("@/components/editor").then((m) => ({ default: m.Editor })),
  { ssr: false }
);
import { ThumbnailCard } from "./thumbnail-card";
import { MetadataCard } from "./metadata-card";
import { TagsCard } from "./tags-card";
import { AttachmentsCard } from "./attachments-card";
import { PreviewDialog } from "./preview-dialog";
import { useNewsEditorPage } from "./use-news-editor-page";
import { ButtonGroup } from "@/components/ui/button-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TranslateDraftPanel } from "@/components/translate-draft-panel";
import { ApproveTranslationDialog } from "@/components/approve-translation-dialog";
import { ContentType } from "@/types/translation-memory";
import { use } from "react";

export default function NewsEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ editId?: string }>;
}) {
  const { editId } = use(searchParams);

  const {
    register,
    control,
    errors,
    watch,
    setValue,
    onSubmit,
    isPending,
    editorKey,
    editorStateRef,
    initialEditorState,
    applyTranslatedContent,
    thumbnailPreview,
    setThumbnailPreview,
    originalThumbnailPreview,
    setOriginalThumbnailPreview,
    hasNewThumbnail,
    setHasNewThumbnail,
    tags,
    setTags,
    attachments,
    setAttachments,
    isPreviewOpen,
    setIsPreviewOpen,
    editingNewsId,
    isLoadingArticle,
    resetFormForCreate,
    router,
    locale,
    localeDrafts,
    handleLocaleChange,
  } = useNewsEditorPage(editId);

  return (
    <div className="flex-1 space-y-4 p-8">
      {/* Header */}
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
          <Button variant="outline" onClick={() => setIsPreviewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <ButtonGroup>
            <Select value={locale} onValueChange={(v) => handleLocaleChange(v as "en" | "az")}>
              <SelectTrigger>
                <SelectValue placeholder="Select locale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="az">AZ</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={onSubmit} disabled={isPending || isLoadingArticle}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {editingNewsId ? "Update" : "Save"}
            </Button>
          </ButtonGroup>
          <ApproveTranslationDialog
            contentType={ContentType.Article}
            getLocaleEditorStateJson={(loc) => {
              if (loc === locale) {
                const state = editorStateRef.current?.toJSON() ?? initialEditorState;
                return state ? JSON.stringify(state) : undefined;
              }
              const draft = localeDrafts[loc as "en" | "az"];
              return draft?.editorState ? JSON.stringify(draft.editorState) : undefined;
            }}
            disabled={isLoadingArticle}
          />
        </div>
      </div>

      {/* Body */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Left column — main content */}
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
                  disabled={isLoadingArticle}
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="A brief summary of the article (1-2 sentences)"
                  disabled={isLoadingArticle}
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
            <CardContent className="space-y-4">
              <TranslateDraftPanel
                contentType={ContentType.Article}
                sourceLocale={locale}
                getSourceStateJson={() => {
                  const state = editorStateRef.current?.toJSON() ?? initialEditorState;
                  return state ? JSON.stringify(state) : undefined;
                }}
                onApply={applyTranslatedContent}
                disabled={isLoadingArticle}
              />
              <Editor
                key={editorKey}
                editorSerializedState={initialEditorState}
                onChange={(state) => {
                  editorStateRef.current = state;
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right column — sidebar */}
        <div className="space-y-4">
          <ThumbnailCard
            register={register}
            setValue={setValue}
            thumbnailPreview={thumbnailPreview}
            hasNewThumbnail={hasNewThumbnail}
            isEditMode={!!editingNewsId}
            originalThumbnailPreview={originalThumbnailPreview}
            onPreviewChange={setThumbnailPreview}
            onOriginalPreviewChange={setOriginalThumbnailPreview}
            onHasNewThumbnailChange={setHasNewThumbnail}
            newsId={editingNewsId ?? undefined}
            disabled={isLoadingArticle}
          />

          <MetadataCard register={register} control={control} disabled={isLoadingArticle} />

          <TagsCard tags={tags} onTagsChange={setTags} disabled={isLoadingArticle} />

          <AttachmentsCard
            attachments={attachments}
            onAttachmentsChange={setAttachments}
            newsId={editingNewsId ?? undefined}
            disabled={isLoadingArticle}
          />
        </div>
      </div>

      {/* Preview dialog */}
      <PreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        title={watch("title")}
        excerpt={watch("excerpt")}
        category={watch("category")}
        authorName={watch("authorName")}
        publishedDate={watch("publishedDate")}
        thumbnailPreview={thumbnailPreview}
        tags={tags}
        editorState={editorStateRef.current?.toJSON()}
      />
    </div>
  );
}
