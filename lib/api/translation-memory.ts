import { fetchAPI } from ".";
import {
  ApproveTranslationRequest,
  ApproveTranslationResult,
  DraftTranslationRequest,
  TranslationDraft,
} from "@/types/translation-memory";

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const body = await response.json();
    if (typeof body?.title === "string" && body.title.length > 0) {
      return body.title;
    }
    if (typeof body?.message === "string" && body.message.length > 0) {
      return body.message;
    }
  } catch {}

  return fallback;
}

export async function translateDraft(
  data: DraftTranslationRequest,
): Promise<TranslationDraft> {
  const response = await fetchAPI("/translations/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Failed to generate translation draft"),
    );
  }

  return (await response.json()) as TranslationDraft;
}

export async function approveTranslation(
  data: ApproveTranslationRequest,
): Promise<ApproveTranslationResult> {
  const response = await fetchAPI("/translations/approve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Failed to approve translation"),
    );
  }

  return (await response.json()) as ApproveTranslationResult;
}
