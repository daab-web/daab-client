"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Languages } from "lucide-react";
import { SerializedEditorState } from "lexical";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { translateDraft } from "@/lib/api/translation-memory";
import { ContentType } from "@/types/translation-memory";

const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  az: "Azerbaijani",
};

const DEFAULT_LOCALES = [
  { value: "en", label: "EN" },
  { value: "az", label: "AZ" },
];

export interface TranslateDraftPanelProps {
  contentType: ContentType;
  sourceLocale: string;
  locales?: { value: string; label: string }[];
  getSourceStateJson: () => string | undefined;
  onApply: (state: SerializedEditorState, targetLocale: string) => void;
  disabled?: boolean;
}

export function TranslateDraftPanel({
  contentType,
  sourceLocale,
  locales = DEFAULT_LOCALES,
  getSourceStateJson,
  onApply,
  disabled,
}: TranslateDraftPanelProps) {
  const targetOptions = locales.filter((l) => l.value !== sourceLocale);
  const [targetLocale, setTargetLocale] = useState(
    () => targetOptions[0]?.value ?? sourceLocale,
  );
  const [hasGenerated, setHasGenerated] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const editorStateJson = getSourceStateJson();
      if (!editorStateJson) {
        throw new Error("There is no content in the editor to translate yet.");
      }

      return translateDraft({
        editorStateJson,
        contentType,
        sourceLocale,
        targetLocale,
      });
    },
    onSuccess: (data) => {
      setHasGenerated(true);
      try {
        onApply(JSON.parse(data.translatedJson) as SerializedEditorState, targetLocale);
        toast.success(
          `Translated draft (${LOCALE_LABELS[targetLocale] ?? targetLocale}) applied`,
        );
      } catch {
        toast.error("Could not apply translation", {
          description: "The translated content could not be parsed.",
        });
      }
    },
    onError: (err: Error) =>
      toast.error("Translation failed", { description: err.message }),
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <Languages className="h-4 w-4" />
        Translate
      </div>
      <div className="flex items-center gap-2">
        <div className="flex h-8 items-center rounded-lg border border-input px-2.5 text-sm text-muted-foreground">
          {LOCALE_LABELS[sourceLocale] ?? sourceLocale.toUpperCase()}
        </div>
        <span className="text-sm text-muted-foreground">to</span>
        <Select value={targetLocale} onValueChange={setTargetLocale}>
          <SelectTrigger id="translate-target-locale" className="w-28">
            <SelectValue placeholder="Select locale" />
          </SelectTrigger>
          <SelectContent>
            {targetOptions.map((l) => (
              <SelectItem key={l.value} value={l.value}>
                {LOCALE_LABELS[l.value] ?? l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          onClick={() => mutation.mutate()}
          disabled={disabled || mutation.isPending || targetOptions.length === 0}
        >
          {mutation.isPending && <Spinner className="mr-2" />}
          {hasGenerated ? "Regenerate" : "Generate draft"}
        </Button>
      </div>
    </div>
  );
}
