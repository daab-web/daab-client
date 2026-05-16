import {
  createNews,
  createTranslation,
  setThumbnail,
  updateTranslation,
} from "@/lib/api/news";
import { Attachment } from "@/types/attachment";
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
      const { id }: CreateNewsResponse = await creationResponse.json();

      if (thumbnail) {
        await setThumbnail(id, thumbnail);
      }

      await createTranslation(id, {
        locale: locale,
        title: data.title,
        excerpt: data.excerpt,
        editorState: data.editorState,
      });

      if (attachments.length > 0 && id) {
        const failed: string[] = [];
        await Promise.all(
          attachments.map(async (attachment) => {
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
            } catch {
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
      if (thumbnail) {
        await setThumbnail(newsId, thumbnail);
      }

      await updateTranslation(newsId, {
        locale: locale,
        title: data.title,
        excerpt: data.excerpt,
        editorState: data.editorState,
      });

      if (attachments && attachments.length > 0 && newsId) {
        const failed: string[] = [];
        await Promise.all(
          attachments.map(async (attachment) => {
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
            } catch {
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
