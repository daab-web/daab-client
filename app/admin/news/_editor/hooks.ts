import { createNews, setThumbnail } from "@/lib/api/news";
import { Attachment } from "@/types/attachment";
import { CreateNewsRequest, CreateNewsResponse } from "@/types/news";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export type createNewsOpts = {
  data: CreateNewsRequest;
  thumbnail: File;
  attachments: Attachment[];
};

export const useCreateNewsMutation = () => useMutation({
  mutationFn: async ({ data, thumbnail, attachments }: createNewsOpts) => {
    const creationResponse = await createNews(data);
    const { id }: CreateNewsResponse = await creationResponse.json();

    await setThumbnail(id, thumbnail);

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
  },
  onSuccess: () => toast.success("News created successfully"),
  onError: (err: Error) =>
    toast.error(`News has not beed created.`, { description: err.message }),
});
