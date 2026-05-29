import { CreateNewsRequest, CreateNewsTranslationRequest, News, NewsAttachmentsResponse, UntranslateNewsEntry } from "@/types/news"
import { PagedResponse } from "@/types/paged-response"
import { fetchAPI } from ".";
import { Attachment } from "@/types/attachment";

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

export async function getNewsByIdOrSlug(idOrSlug: string, locale: string) {
  const response = await fetchAPI(`/news/${idOrSlug}`, {
    headers: {
      "Accept-Language": locale,
    }
  });
  const news: News = await response.json();

  return news;
}

export async function getNewsAttachments(id: string) {
  const response = await fetchAPI(`/news/${id}/attachments`);
  const attachments: Attachment[] = await response.json()

  return attachments
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

export async function updateNews(id: string, formData: FormData) {
  return fetchAPI(`/news/${id}`, {
    method: "PUT",
    body: formData,
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
