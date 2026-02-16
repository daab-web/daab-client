import { SerializedEditorState } from "lexical";

export type News = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  excerpt?: string;
  publishedDate: string;
  authorId?: string;
  authorName?: string;
  category?: string;
  tags: string[];
  editorState: SerializedEditorState | null
};

