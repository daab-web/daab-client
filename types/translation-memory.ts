// Mirrors Daab.Modules.Translation.Models.ContentType on the backend.
export enum ContentType {
  Scientist = 0,
  Article = 1,
}

export type TranslationExample = {
  source: string;
  target: string;
  score: number;
  tier: "Fuzzy" | "Semantic";
};

export type DraftTranslationRequest = {
  editorStateJson: string;
  contentType: ContentType;
  sourceLocale: string;
  targetLocale: string;
  maxExamples?: number;
};

export type TranslationDraft = {
  translatedJson: string;
  blockCount: number;
  exactHits: number;
  modelTranslated: number;
  examplesUsed: TranslationExample[];
};

export type ApproveTranslationRequest = {
  sourceEditorStateJson: string;
  targetEditorStateJson: string;
  contentType: ContentType;
  sourceLocale: string;
  targetLocale: string;
};

export type ApproveTranslationResult = {
  blockCount: number;
  added: number;
  skipped: number;
};
