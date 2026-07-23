"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCheck } from "lucide-react";

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
import { Spinner } from "@/components/ui/spinner";
import { approveTranslation } from "@/lib/api/translation-memory";
import { ApproveTranslationResult, ContentType } from "@/types/translation-memory";

const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  az: "Azerbaijani",
};

const DEFAULT_LOCALES = [
  { value: "en", label: "EN" },
  { value: "az", label: "AZ" },
];

export interface ApproveTranslationDialogProps {
  contentType: ContentType;
  locales?: { value: string; label: string }[];
  getLocaleEditorStateJson: (locale: string) => string | undefined;
  disabled?: boolean;
}

export function ApproveTranslationDialog({
  contentType,
  locales = DEFAULT_LOCALES,
  getLocaleEditorStateJson,
  disabled,
}: ApproveTranslationDialogProps) {
  const [open, setOpen] = useState(false);
  const [sourceLocale, setSourceLocale] = useState(locales[0]?.value ?? "en");
  const [targetLocale, setTargetLocale] = useState(
    () => locales.find((l) => l.value !== locales[0]?.value)?.value ?? "az",
  );
  const [result, setResult] = useState<ApproveTranslationResult | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const sourceEditorStateJson = getLocaleEditorStateJson(sourceLocale);
      const targetEditorStateJson = getLocaleEditorStateJson(targetLocale);

      if (!sourceEditorStateJson || !targetEditorStateJson) {
        throw new Error(
          `Both ${LOCALE_LABELS[sourceLocale] ?? sourceLocale} and ${LOCALE_LABELS[targetLocale] ?? targetLocale} need content before they can be approved as a translation pair.`,
        );
      }

      return approveTranslation({
        sourceEditorStateJson,
        targetEditorStateJson,
        contentType,
        sourceLocale,
        targetLocale,
      });
    },
    onSuccess: (data) => {
      setResult(data);
      toast.success("Translation approved", {
        description: `${data.added} block(s) added to the translation memory.`,
      });
    },
    onError: (err: Error) =>
      toast.error("Could not approve translation", { description: err.message }),
  });

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      mutation.reset();
      setResult(null);
    }
  };

  const targetOptions = locales.filter((l) => l.value !== sourceLocale);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" disabled={disabled}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Approve Translation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Approve translation</DialogTitle>
          <DialogDescription>
            Confirms the current content in these two locales is a good
            translation pair and adds it to the translation memory, so future
            AI drafts can reuse it.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="approve-source-locale">Source</Label>
            <Select
              value={sourceLocale}
              onValueChange={(v) => {
                setSourceLocale(v);
                if (v === targetLocale) {
                  setTargetLocale(locales.find((l) => l.value !== v)?.value ?? v);
                }
              }}
            >
              <SelectTrigger id="approve-source-locale" className="w-full">
                <SelectValue placeholder="Select locale" />
              </SelectTrigger>
              <SelectContent>
                {locales.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {LOCALE_LABELS[l.value] ?? l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="approve-target-locale">Target</Label>
            <Select value={targetLocale} onValueChange={setTargetLocale}>
              <SelectTrigger id="approve-target-locale" className="w-full">
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
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary">{result.blockCount} blocks</Badge>
            <Badge variant="default">{result.added} added</Badge>
            <Badge variant="outline">{result.skipped} already known</Badge>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || targetOptions.length === 0}
          >
            {mutation.isPending && <Spinner className="mr-2" />}
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
