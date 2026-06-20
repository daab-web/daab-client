import {
  CreateNewsRequest,
  CreateNewsTranslationRequest,
  News,
  NewsAttachment,
  NewsAttachmentsResponse,
  UntranslateNewsEntry,
  NewsApiResponse,
  UpdateNewsRequest,
} from "@/types/news"
import { PagedResponse } from "@/types/paged-response"
import { fetchAPI } from ".";

export async function fetchNews(
  page: number = 1,
  pageSize: number = 20,
  locale: string
): Promise<PagedResponse<News>> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    locale
  });
  const response = await fetchAPI(`/news?${params.toString()}`);
  const data: PagedResponse<News> = await response.json();

  return data;
}

export async function fetchUntranslatedNews(): Promise<UntranslateNewsEntry[]> {
  const res = await fetchAPI('/news/untranslated');

  if (!res.ok) {
    throw new Error(`Failed to fetch. Message: ${res.status}`)
  }

  const data: UntranslateNewsEntry[] = await res.json()

  return data;
}

export async function getNewsByIdOrSlug(idOrSlug: string, locale: string): Promise<News> {
  const response = await fetchAPI(`/news/${idOrSlug}`, {
    headers: {
      "Accept-Language": locale,
    }
  });
  const raw: NewsApiResponse = await response.json();

  return {
    ...raw,
    editorState: raw.editorState ? JSON.parse(raw.editorState) : undefined,
  } satisfies News;
}

export async function getNewsAttachments(id: string): Promise<NewsAttachment[]> {
  const response = await fetchAPI(`/news/${id}/attachments`);
  const data: NewsAttachmentsResponse = await response.json()

  return data.attachments
}

export async function createNews(data: CreateNewsRequest) {
  return fetchAPI("/news", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });
}

export async function publishNews(data: { newsIds: string[] }) {
  const res = await fetchAPI('/news', {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!res.ok) {
    throw new Error(`Failed to publish news. Message: ${res.status}`)
  }
}

export async function createTranslation(newsId: string, data: CreateNewsTranslationRequest) {
  return fetchAPI(`/news/${newsId}/translations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  })
}

export async function updateTranslation(newsId: string, data: CreateNewsTranslationRequest) {
  return fetchAPI(`/news/${newsId}/translations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  })
}

export async function setThumbnail(newsId: string, image: File) {
  const formData = new FormData()
  formData.append("image", image)
  return fetchAPI(`/news/${newsId}/thumbnail`, {
    method: "POST",
    body: formData
  })
}

export async function uploadNewsAttachment(
  newsId: string,
  file: File,
  caption?: string | null,
) {
  const formData = new FormData();
  formData.append("file", file);
  if (caption) formData.append("caption", caption);
  return fetchAPI(`/news/${newsId}/attachments`, {
    method: "POST",
    body: formData,
  });
}

export async function updateNews(id: string, data: UpdateNewsRequest) {
  return fetchAPI(`/news/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });
}

export async function deleteNews(id: string) {
  return fetchAPI(`/news/${id}`, {
    method: "DELETE",
  });
}

export async function fetchNewsAttachments(newsId: string): Promise<NewsAttachmentsResponse> {
  const response = await fetchAPI(`/news/${newsId}/attachments`);
  const data: NewsAttachmentsResponse = await response.json();
  return data;
}

export async function deleteNewsAttachment(newsId: string, attachmentId: string) {
  return fetchAPI(`/news/${newsId}/attachments/${attachmentId}`, {
    method: "DELETE",
  });
}

export async function deleteNewsThumbnail(newsId: string) {
  return fetchAPI(`/news/${newsId}/thumbnail`, {
    method: "DELETE",
  });
}
