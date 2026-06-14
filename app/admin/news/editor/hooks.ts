import {
  createNews,
  createTranslation,
  setThumbnail,
  updateNews,
  updateTranslation,
} from "@/lib/api/news";
import { Attachment, isNewAttachment } from "@/types/attachment";
import { CreateNewsRequest, CreateNewsResponse } from "@/types/news";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export type createNewsOpts = {
  data: CreateNewsRequest;
  thumbnail?: File;
  attachments: Attachment[];
  locale: "en" | "az";
};

export type updateNewsProps = {
  data: CreateNewsRequest;
  thumbnail?: File;
  attachments?: Attachment[];
  locale: "en" | "az";
};

export const useCreateNewsMutation = () =>
  useMutation({
    mutationFn: async ({
      data,
      thumbnail,
      attachments,
      locale,
    }: createNewsOpts) => {
      const creationResponse = await createNews(data);
      if (!creationResponse.ok) {
        throw new Error(`Failed to create news (${creationResponse.status})`);
      }
      const { id }: CreateNewsResponse = await creationResponse.json();

      if (thumbnail) {
        const thumbnailRes = await setThumbnail(id, thumbnail);
        if (!thumbnailRes.ok) {
          throw new Error(`Failed to upload thumbnail (${thumbnailRes.status})`);
        }
      }

      const translationRes = await createTranslation(id, {
        locale: locale,
        title: data.title,
        excerpt: data.excerpt,
        editorState: data.editorState,
      });
      if (!translationRes.ok) {
        throw new Error(`Failed to create translation (${translationRes.status})`);
      }

      const newAttachments = attachments.filter(isNewAttachment);
      if (newAttachments.length > 0 && id) {
        const failed: string[] = [];
        await Promise.all(
          newAttachments.map(async (attachment) => {
            const attachmentData = new FormData();
            attachmentData.append("file", attachment.file);
            if (attachment.caption) {
              attachmentData.append("caption", attachment.caption);
            }
            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER}/news/${id}/attachments`,
                { method: "POST", body: attachmentData },
              );
              if (!res.ok) failed.push(attachment.file.name);
            } catch (err) {
              console.error(err);
              failed.push(attachment.file.name);
            }
          }),
        );

        if (failed.length > 0) {
          toast.warning("Article saved with issues", {
            description: `Some attachments failed to upload: ${failed.join(", ")}`,
          });
          return;
        }
      }
      return { id };
    },
    onSuccess: () => toast.success("News created successfully"),
    onError: (err: Error) =>
      toast.error(`News has not beed created.`, { description: err.message }),
  });

export const useUpdateNewsMutation = (newsId: string) =>
  useMutation({
    mutationFn: async ({
      locale,
      thumbnail,
      data,
      attachments,
    }: updateNewsProps) => {
      const updateRes = await updateNews(newsId, {
        category: data.category,
        tags: data.tags,
        publishedDate: data.publishedDate,
      });
      if (!updateRes.ok) {
        throw new Error(`Failed to update news (${updateRes.status})`);
      }

      if (thumbnail) {
        const thumbnailRes = await setThumbnail(newsId, thumbnail);
        if (!thumbnailRes.ok) {
          throw new Error(`Failed to upload thumbnail (${thumbnailRes.status})`);
        }
      }

      const translationRes = await updateTranslation(newsId, {
        locale: locale,
        title: data.title,
        excerpt: data.excerpt,
        editorState: data.editorState,
      });
      if (!translationRes.ok) {
        throw new Error(`Failed to update translation (${translationRes.status})`);
      }

      const newAttachments = (attachments ?? []).filter(isNewAttachment);
      if (newAttachments.length > 0 && newsId) {
        const failed: string[] = [];
        await Promise.all(
          newAttachments.map(async (attachment) => {
            const attachmentData = new FormData();
            attachmentData.append("file", attachment.file);
            if (attachment.caption) {
              attachmentData.append("caption", attachment.caption);
            }
            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER}/news/${newsId}/attachments`,
                { method: "POST", body: attachmentData },
              );
              if (!res.ok) failed.push(attachment.file.name);
            } catch (err) {
              console.error(err);
              failed.push(attachment.file.name);
            }
          }),
        );

        if (failed.length > 0) {
          toast.warning("Article updated with issues", {
            description: `Some attachments failed to upload: ${failed.join(", ")}`,
          });
          return;
        }
      }
    },
    onSuccess: () => toast.success("News updated successfully"),
    onError: (err: Error) =>
      toast.error(`News has not beed updated.`, { description: err.message }),
  });
