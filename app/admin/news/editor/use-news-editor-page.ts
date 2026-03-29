"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { SerializedEditorState } from "lexical";
import { toast } from "sonner";
import { getNewsByIdOrSlug } from "@/lib/api/news";
import { NewsFormData, DEFAULT_FORM_VALUES } from "./types";
import { Attachment } from "@/types/attachment";
import { useCreateNewsMutation } from "./hooks";

export function useNewsEditorPage() {
  const router = useRouter();

  const form = useForm<NewsFormData>({ defaultValues: DEFAULT_FORM_VALUES });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = form;

  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [editorState, setEditorState] = useState<SerializedEditorState | null>(
    null,
  );
  const [editorKey, setEditorKey] = useState(0);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [originalThumbnailPreview, setOriginalThumbnailPreview] = useState("");
  const [hasNewThumbnail, setHasNewThumbnail] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { mutate, isPending } = useCreateNewsMutation();

  const resetFormForCreate = () => {
    reset(DEFAULT_FORM_VALUES);
    setTags([]);
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
      const thumb = article.thumbnail ?? "";
      setThumbnailPreview(thumb);
      setOriginalThumbnailPreview(thumb);
      setHasNewThumbnail(false);
      setEditorKey((prev) => prev + 1);
      toast.success("Edit mode enabled", {
        description: `You are now editing "${article.title}".`,
      });
    } catch {
      toast.error("Could not open article", {
        description: "Please try again.",
      });
    } finally {
      setIsLoadingArticle(false);
    }
  };

  const onSubmit = handleSubmit((formData: NewsFormData) => {
    const thumbnail = formData.thumbnail?.[0];
    if (!thumbnail) {
      toast.error("Thumbnail required", {
        description: "Please upload a thumbnail image.",
      });
      return;
    }

    mutate({
      data: {
        title: formData.title,
        excerpt: formData.excerpt,
        category: formData.category,
        author: formData.authorName,
        authorId: "",
        editorState: JSON.stringify(editorState),
        tags: tags,
        publishedDate: formData.publishedDate,
      },
      thumbnail,
      attachments,
    });
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("editId");
    if (editId) void loadNewsForEdit(editId);
  }, []);

  return {
    // form
    register,
    control,
    errors,
    watch,
    setValue,
    onSubmit,
    isPending,
    // editor
    editorState,
    setEditorState,
    editorKey,
    // thumbnail
    thumbnailPreview,
    setThumbnailPreview,
    originalThumbnailPreview,
    hasNewThumbnail,
    setHasNewThumbnail,
    // tags
    tags,
    setTags,
    // attachments
    attachments,
    setAttachments,
    // preview
    isPreviewOpen,
    setIsPreviewOpen,
    // edit mode
    editingNewsId,
    isLoadingArticle,
    resetFormForCreate,
    router,
  };
}
