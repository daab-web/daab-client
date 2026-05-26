import { SerializedEditorState } from "lexical";

export type News = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  excerpt?: string;
  publishedDate: string;
  authorName?: string;
  category?: string;
  tags: string[];
  editorState: SerializedEditorState | null;
};

export type NewsAttachment = {
  id: string;
  fileUrl: string;
  caption: string | null;
  fileType: string | null;
};

export type NewsAttachmentsResponse = {
  newsId: string;
  attachments: NewsAttachment[];
};

export type CreateNewsTranslationRequest = {
  locale: string;
  title: string;
  excerpt?: string;
  editorState?: string;
}

export type CreateNewsRequest = {
  title: string;
  editorState: string;
  excerpt?: string;
  author?: string;
  authorId?: string;
  category?: string;
  tags: string[]
  publishedDate: Date;
};

export type CreateNewsResponse = {
  id: string;
};

export interface UntranslateNewsEntry {
  newsId: string;
  title?: string;
  missingLocales: string[];
}
