export type PostStatus = "Draft" | "Published" | "Rejected";

export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  locale: string;
  authorId: string;
  authorName: string;
  scientistId: string | null;
  publishedAt: string | null;
  commentCount: number;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Serialized Lexical editor state (JSON string). */
  editorState: string;
  locale: string;
  authorId: string;
  authorName: string;
  scientistId: string | null;
  status: PostStatus;
  verificationFeedback: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface MyPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  locale: string;
  status: PostStatus;
  verificationFeedback: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  commentCount: number;
}

export interface PostInput {
  title: string;
  excerpt: string;
  editorState: string;
  locale: string;
}

export interface SubmitPostResult {
  id: string;
  slug: string;
  status: PostStatus;
  verificationFeedback: string | null;
}

export interface BlogComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  /** ISO 639-1 code the comment is written in; null when unknown. */
  language: string | null;
  createdAt: string;
}

export interface CommentTranslation {
  commentId: string;
  locale: string;
  content: string;
  sourceLanguage: string | null;
}

/** A post as listed in the admin's "All posts" view. */
export interface AdminPost {
  id: string;
  slug: string;
  title: string;
  locale: string;
  authorId: string;
  authorName: string;
  status: PostStatus;
  verificationFeedback: string | null;
  updatedAt: string;
  publishedAt: string | null;
  commentCount: number;
}
