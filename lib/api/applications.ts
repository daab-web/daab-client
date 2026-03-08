import { Application } from "@/types/application";
import { PagedResponse } from "@/types/paged-response";
import { fetchAPI } from ".";

export async function fetchApplications(
  page: number = 1,
  pageSize: number = 20,
): Promise<PagedResponse<Application>> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  const res = await fetchAPI(`/applications?${params.toString()}`);

  const data = await res.json();

  return data;
}

export async function submitApplication(data: any) {
  return fetchAPI("/applications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function approveApplication(applicationId: string) {
  return fetchAPI(`/applications/${applicationId}/approve`, {
    method: "PUT",
  });
}
