"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { EditorState, SerializedEditorState } from "lexical";
import { toast } from "sonner";
import { getNewsAttachments, getNewsByIdOrSlug } from "@/lib/api/news";
import { NewsFormData, DEFAULT_FORM_VALUES } from "./types";
import { Attachment } from "@/types/attachment";
import { useCreateNewsMutation, useUpdateNewsMutation } from "./hooks";

export function useNewsEditorPage(editId?: string) {
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
  const [locale, setLocale] = useState<"en" | "az">("en");
  const [editorKey, setEditorKey] = useState(0);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [originalThumbnailPreview, setOriginalThumbnailPreview] = useState("");
  const [hasNewThumbnail, setHasNewThumbnail] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [initialEditorState, setInitialEditorState] = useState<
    SerializedEditorState | undefined
  >(undefined);

  const editorStateRef = useRef<EditorState | undefined>(undefined);

  const mutation = editId
    ? useUpdateNewsMutation(editId)
    : useCreateNewsMutation();
  const { mutateAsync, isPending } = mutation;

  const resetFormForCreate = () => {
    reset(DEFAULT_FORM_VALUES);
    setTags([]);
    setThumbnailPreview("");
    setOriginalThumbnailPreview("");
    setHasNewThumbnail(false);
    setEditingNewsId(null);
    setInitialEditorState(undefined);
    editorStateRef.current = undefined;
    setEditorKey((prev) => prev + 1);
  };

  const loadNewsForEdit = async (id: string) => {
    setIsLoadingArticle(true);
    try {
      const article = await getNewsByIdOrSlug(id, locale);
      const att = await getNewsAttachments(id);
      setEditingNewsId(article.id);
      setAttachments(att);
      setValue("title", article.title);
      setValue("excerpt", article.excerpt ?? "");
      setValue("category", article.category ?? "");
      setValue("authorName", article.authorName ?? "");
      setValue(
        "publishedDate",
        article.publishedDate ? new Date(article.publishedDate) : new Date(),
      );
      setTags(Array.isArray(article.tags) ? article.tags : []);
      setInitialEditorState(article.editorState);
      editorStateRef.current = undefined;
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

  const onSubmit = handleSubmit(async (formData: NewsFormData) => {
    const thumbnail = formData.thumbnail?.[0];
    try {
      if (editId) {
        await mutateAsync({
          data: {
            title: formData.title,
            excerpt: formData.excerpt,
            category: formData.category,
            author: formData.authorName,
            authorId: "",
            editorState: JSON.stringify(editorStateRef.current?.toJSON()),
            tags: tags,
            publishedDate: formData.publishedDate,
          },
          thumbnail,
          attachments,
          locale,
        });
      } else {
        const result = await mutateAsync({
          data: {
            title: formData.title,
            excerpt: formData.excerpt,
            category: formData.category,
            author: formData.authorName,
            authorId: "",
            editorState: JSON.stringify(editorStateRef.current?.toJSON()),
            tags: tags,
            publishedDate: formData.publishedDate,
          },
          thumbnail,
          attachments,
          locale,
        });

        const createdId = result?.id;
        if (createdId) {
          setEditingNewsId(createdId);
          router.replace(`/admin/news/editor?editId=${createdId}`);
        }
      }
    } catch (err) {}
  });

  useEffect(() => {
    if (editId) void loadNewsForEdit(editId);
  }, [locale]);

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
    editorKey,
    editorStateRef,
    initialEditorState,
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
    //locale
    locale,
    setLocale,
  };
}
