export type PostStatus = "Draft" | "Published" | "Rejected";

export interface PostSummary {
  id: string;
  slug: string;
  /** Language of title and excerpt (the requested one, or the original as a fallback). */
  locale: string;
  title: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  scientistId: string | null;
  publishedAt: string | null;
  commentCount: number;
}

/** A post's content in one language. */
export interface PostTranslation {
  locale: string;
  title: string;
  excerpt: string;
  /** Serialized Lexical editor state (JSON string). */
  editorState: string;
}

export interface Post {
  id: string;
  slug: string;
  /** The language the author wrote the post in. */
  sourceLocale: string;
  /** The post in every language, original first. */
  translations: PostTranslation[];
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
  /** Title in the original language. */
  title: string;
  sourceLocale: string;
  locales: string[];
  status: PostStatus;
  verificationFeedback: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  commentCount: number;
}

/** Create/update payload: the post in every language. */
export interface PostInput {
  sourceLocale: string;
  translations: PostTranslation[];
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
  /** The language the commenter wrote in. */
  sourceLocale: string;
  /** The comment in every language, keyed by locale. */
  texts: Record<string, string>;
  createdAt: string;
}

/** A post as listed in the admin's "All posts" view. */
export interface AdminPost {
  id: string;
  slug: string;
  /** Title in the original language. */
  title: string;
  sourceLocale: string;
  locales: string[];
  authorId: string;
  authorName: string;
  status: PostStatus;
  verificationFeedback: string | null;
  updatedAt: string;
  publishedAt: string | null;
  commentCount: number;
}
