import { News } from "@/types/news"
import { PagedResponse } from "@/types/paged-response"
import { fetchAPI } from ".";

export async function fetchNews(
  page: number = 1,
  pageSize: number = 20,
): Promise<PagedResponse<News>> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  const response = await fetchAPI(`/news?${params.toString()}`);
  const data: PagedResponse<News> = await response.json();

  return data;
}

export async function getNewsByIdOrSlug(idOrSlug: string) {
  const response = await fetchAPI(`/news/${idOrSlug}`);
  const news: News = await response.json();

  return news;
}
