import {
  AdminPost,
  BlogComment,
  CommentTranslation,
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

export async function fetchPublishedPosts(
  page = 1,
  pageSize = 12,
  init?: RequestInit,
): Promise<PagedResponse<PostSummary>> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
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

export async function addComment(
  postId: string,
  content: string,
): Promise<BlogComment> {
  const res = await fetchAPI(`/blog/posts/${postId}/comments`, {
    method: "POST",
    headers: json,
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw await toApiError(res, "Failed to post the comment");
  return res.json();
}

export async function deleteComment(id: string) {
  const res = await fetchAPI(`/blog/comments/${id}`, { method: "DELETE" });
  if (!res.ok) throw await toApiError(res, "Failed to delete the comment");
}

export async function translateComment(
  id: string,
  locale: string,
): Promise<CommentTranslation> {
  const res = await fetchAPI(`/blog/comments/${id}/translation`, {
    method: "POST",
    headers: json,
    body: JSON.stringify({ locale }),
  });
  if (!res.ok) throw await toApiError(res, "Translation failed");
  return res.json();
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
