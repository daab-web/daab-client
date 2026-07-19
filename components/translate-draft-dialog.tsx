"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Languages } from "lucide-react";
import { SerializedEditorState, SerializedLexicalNode } from "lexical";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { translateDraft } from "@/lib/api/translation-memory";
import { ContentType, TranslationDraft } from "@/types/translation-memory";

const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  az: "Azerbaijani",
};

const DEFAULT_LOCALES = [
  { value: "en", label: "EN" },
  { value: "az", label: "AZ" },
];

type LexicalTextNode = SerializedLexicalNode & {
  text?: string;
  children?: LexicalTextNode[];
};

function extractPlainText(state: SerializedEditorState): string {
  const walk = (node: LexicalTextNode): string => {
    if (typeof node.text === "string") return node.text;
    if (!node.children) return "";
    return node.children.map(walk).join("");
  };

  return (state.root.children as LexicalTextNode[]).map(walk).join("\n").trim();
}

export interface TranslateDraftDialogProps {
  contentType: ContentType;
  sourceLocale: string;
  locales?: { value: string; label: string }[];
  getSourceStateJson: () => string | undefined;
  onApply: (state: SerializedEditorState) => void;
  disabled?: boolean;
}

export function TranslateDraftDialog({
  contentType,
  sourceLocale,
  locales = DEFAULT_LOCALES,
  getSourceStateJson,
  onApply,
  disabled,
}: TranslateDraftDialogProps) {
  const [open, setOpen] = useState(false);
  const targetOptions = locales.filter((l) => l.value !== sourceLocale);
  const [targetLocale, setTargetLocale] = useState(
    () => targetOptions[0]?.value ?? sourceLocale,
  );
  const [result, setResult] = useState<TranslationDraft | null>(null);

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
    onSuccess: (data) => setResult(data),
    onError: (err: Error) =>
      toast.error("Translation failed", { description: err.message }),
  });

  const preview = useMemo(() => {
    if (!result) return "";
    try {
      return extractPlainText(JSON.parse(result.translatedJson));
    } catch {
      return "";
    }
  }, [result]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      mutation.reset();
      setResult(null);
    }
  };

  const handleApply = () => {
    if (!result) return;
    try {
      onApply(JSON.parse(result.translatedJson) as SerializedEditorState);
      toast.success(
        `Translated draft (${LOCALE_LABELS[targetLocale] ?? targetLocale}) applied to the editor`,
      );
      handleOpenChange(false);
    } catch {
      toast.error("Could not apply translation", {
        description: "The translated content could not be parsed.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" disabled={disabled}>
          <Languages className="mr-2 h-4 w-4" />
          Translate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Translate content</DialogTitle>
          <DialogDescription>
            Generate an AI draft translation of the current editor content. Review
            it below before applying — applying replaces whatever is currently in
            the editor.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>From</Label>
            <div className="flex h-8 items-center rounded-lg border border-input px-2.5 text-sm text-muted-foreground">
              {LOCALE_LABELS[sourceLocale] ?? sourceLocale.toUpperCase()}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="translate-target-locale">To</Label>
            <Select value={targetLocale} onValueChange={setTargetLocale}>
              <SelectTrigger id="translate-target-locale" className="w-full">
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
          </div>
        </div>

        {result && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary">{result.blockCount} blocks</Badge>
              <Badge variant="secondary">{result.exactHits} exact matches</Badge>
              <Badge variant="secondary">
                {result.modelTranslated} model-translated
              </Badge>
            </div>
            <ScrollArea className="h-40 rounded-lg border p-3">
              <p className="whitespace-pre-wrap text-sm">{preview || "(empty)"}</p>
            </ScrollArea>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || targetOptions.length === 0}
          >
            {mutation.isPending && <Spinner className="mr-2" />}
            {result ? "Regenerate" : "Generate draft"}
          </Button>
          <Button type="button" onClick={handleApply} disabled={!result}>
            Apply to editor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
