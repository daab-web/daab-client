import {
  AdminPost,
  BlogComment,
  MyPost,
  Post,
  PostInput,
  PostSummary,
  SubmitPostResult,
} from "@/types/blog";
import { PagedResponse } from "@/types/paged-response";
import { fetchAPI } from ".";
import { toApiError } from "./errors";

const json = { "Content-Type": "application/json" };

/** Published posts, with titles and summaries in `locale` where available. */
export async function fetchPublishedPosts(
  page = 1,
  pageSize = 12,
  locale?: string,
  init?: RequestInit,
): Promise<PagedResponse<PostSummary>> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  if (locale) params.set("locale", locale);
  const res = await fetchAPI(`/blog/posts?${params}`, init);
  if (!res.ok) throw await toApiError(res, "Failed to load posts");
  return res.json();
}

/** Returns null when the post does not exist or is not visible to the caller. */
export async function fetchPost(
  idOrSlug: string,
  init?: RequestInit,
): Promise<Post | null> {
  const res = await fetchAPI(
    `/blog/posts/${encodeURIComponent(idOrSlug)}`,
    init,
  );
  if (res.status === 404) return null;
  if (!res.ok) throw await toApiError(res, "Failed to load post");
  return res.json();
}

export async function fetchMyPosts(): Promise<MyPost[]> {
  const res = await fetchAPI("/blog/my-posts");
  if (!res.ok) throw await toApiError(res, "Failed to load your posts");
  return res.json();
}

export async function createPost(
  data: PostInput,
): Promise<{ id: string; slug: string }> {
  const res = await fetchAPI("/blog/posts", {
    method: "POST",
    headers: json,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await toApiError(res, "Failed to save the post");
  return res.json();
}

export async function updatePost(id: string, data: PostInput): Promise<Post> {
  const res = await fetchAPI(`/blog/posts/${id}`, {
    method: "PUT",
    headers: json,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await toApiError(res, "Failed to save the post");
  return res.json();
}

export async function deletePost(id: string) {
  const res = await fetchAPI(`/blog/posts/${id}`, { method: "DELETE" });
  if (!res.ok) throw await toApiError(res, "Failed to delete the post");
}

/** Runs content verification; the post is published only if it passes. */
export async function submitPost(id: string): Promise<SubmitPostResult> {
  const res = await fetchAPI(`/blog/posts/${id}/submit`, { method: "POST" });
  if (!res.ok) throw await toApiError(res, "Failed to publish the post");
  return res.json();
}

export async function fetchComments(postId: string): Promise<BlogComment[]> {
  const res = await fetchAPI(`/blog/posts/${postId}/comments`);
  if (!res.ok) throw await toApiError(res, "Failed to load comments");
  return res.json();
}

/** Posts a comment in every language (`texts` is keyed by locale). */
export async function addComment(
  postId: string,
  sourceLocale: string,
  texts: Record<string, string>,
): Promise<BlogComment> {
  const res = await fetchAPI(`/blog/posts/${postId}/comments`, {
    method: "POST",
    headers: json,
    body: JSON.stringify({ sourceLocale, texts }),
  });
  if (!res.ok) throw await toApiError(res, "Failed to post the comment");
  return res.json();
}

export async function deleteComment(id: string) {
  const res = await fetchAPI(`/blog/comments/${id}`, { method: "DELETE" });
  if (!res.ok) throw await toApiError(res, "Failed to delete the comment");
}

/**
 * AI translation suggestions for plain texts (post title and summary, a comment). The user
 * reviews them; nothing is saved. Requires a signed-in user.
 */
export async function suggestTranslation(
  sourceLocale: string,
  targetLocale: string,
  texts: string[],
): Promise<string[]> {
  const res = await fetchAPI("/blog/translations/suggest", {
    method: "POST",
    headers: json,
    body: JSON.stringify({ sourceLocale, targetLocale, texts }),
  });
  if (!res.ok) throw await toApiError(res, "Translation is unavailable right now");
  const body: { translations: string[] } = await res.json();
  return body.translations;
}

/** Admin only: every post in any status. */
export async function fetchAllPosts(
  page = 1,
  pageSize = 50,
): Promise<PagedResponse<AdminPost>> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  const res = await fetchAPI(`/blog/admin/posts?${params}`);
  if (!res.ok) throw await toApiError(res, "Failed to load posts");
  return res.json();
}
