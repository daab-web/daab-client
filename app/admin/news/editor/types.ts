export interface NewsFormData {
  title: string;
  excerpt: string;
  thumbnail?: FileList;
  category: string;
  authorName: string;
  authorId?: string
  publishedDate: Date;
}

export const DEFAULT_FORM_VALUES: Omit<NewsFormData, "thumbnail"> = {
  title: "",
  excerpt: "",
  category: "",
  authorName: "",
  publishedDate: new Date(),
};

// Re-export from global types so consumers only need one import
export type { Attachment, NewAttachment, ExistingAttachment } from "@/types/attachment";
export { isNewAttachment } from "@/types/attachment";
