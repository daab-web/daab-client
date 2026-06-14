"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { EditorState, SerializedEditorState } from "lexical";
import { parse } from "date-fns";
import { toast } from "sonner";
import { getNewsAttachments, getNewsByIdOrSlug } from "@/lib/api/news";
import { NewsFormData, DEFAULT_FORM_VALUES } from "./types";
import { Attachment, isNewAttachment } from "@/types/attachment";
import { useCreateNewsMutation, useUpdateNewsMutation } from "./hooks";

// Keep the calendar day the user picked (local Y/M/D) when serialized to
// UTC, so `JSON.stringify`'s `toISOString()` doesn't shift it by a day.
function toUtcDateOnly(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

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

  const createMutation = useCreateNewsMutation();
  const updateMutation = useUpdateNewsMutation(editId ?? "");
  const { mutateAsync, isPending } = editId ? updateMutation : createMutation;

  const resetFormForCreate = () => {
    reset(DEFAULT_FORM_VALUES);
    setTags([]);
    setThumbnailPreview("");
    setOriginalThumbnailPreview("");
    setHasNewThumbnail(false);
    setAttachments([]);
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
      setAttachments((prev) => [
        ...prev.filter(isNewAttachment),
        ...att.map((a) => ({
          id: a.id,
          fileUrl: a.fileUrl,
          fileType: a.fileType,
          caption: a.caption,
        })),
      ]);
      setValue("title", article.title);
      setValue("excerpt", article.excerpt ?? "");
      setValue("category", article.category ?? "");
      setValue("authorName", article.authorName ?? "");
      setValue(
        "publishedDate",
        article.publishedDate
          ? parse(article.publishedDate, "dd.MM.yyyy", new Date())
          : new Date(),
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
            publishedDate: toUtcDateOnly(formData.publishedDate),
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
            publishedDate: toUtcDateOnly(formData.publishedDate),
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
    } catch (err) {
      console.error(err);
    }
  });

  useEffect(() => {
    if (editId) void loadNewsForEdit(editId);
  }, [locale, editId]);

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
    setOriginalThumbnailPreview,
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
