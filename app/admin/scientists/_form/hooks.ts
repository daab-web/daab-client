import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createScientist, updateScientist, updateScientistTranslation } from "@/lib/api/scientists";
import { toast } from "sonner";
import { ScientistFormData, scientistSchema } from "./types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Scientist } from "@/types/scientist";
import { SerializedEditorState } from "lexical";

export type ScientistLocaleTranslation = {
  firstName: string;
  lastName: string;
  description: SerializedEditorState | undefined;
};

export function useScientistCreateMutation(primaryLocale: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      translations,
    }: {
      data: ScientistFormData;
      translations: Record<string, ScientistLocaleTranslation>;
    }) => {
      const { id } = await createScientist(data, primaryLocale);

      for (const [loc, t] of Object.entries(translations)) {
        const translationRes = await updateScientistTranslation(id, loc, {
          firstName: t.firstName,
          lastName: t.lastName,
          description: JSON.stringify(t.description),
        });
        if (!translationRes.ok) {
          throw new Error(`Failed to save ${loc} translation (${translationRes.status})`);
        }
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["scientists"] });
      toast.success("Scientist created successfully");
    },
    onError: (err: Error) =>
      toast.error("Unable to create scientist", { description: err.message }),
  });
}

export function useScientistUpdateMutation(id: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      translations,
    }: {
      data: ScientistFormData;
      translations: Record<string, ScientistLocaleTranslation>;
    }) => {
      for (const [loc, t] of Object.entries(translations)) {
        const translationRes = await updateScientistTranslation(id, loc, {
          firstName: t.firstName,
          lastName: t.lastName,
          description: JSON.stringify(t.description),
        });
        if (!translationRes.ok) {
          throw new Error(`Failed to save ${loc} translation (${translationRes.status})`);
        }
      }

      const updateRes = await updateScientist(id, {
        ...data,
        dateOfBirth: data.dateOfBirth || null,
      })
      if (!updateRes.ok) {
        throw new Error(`Failed to update scientist (${updateRes.status})`);
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["scientists"] });
      toast.success("Scientist updated successfully");
    },
    onError: (err: Error) =>
      toast.error("Unable to update scientist", { description: err.message }),
  });
}

export const useScientistForm = (s?: Scientist) =>
  useForm<ScientistFormData>({
    resolver: zodResolver(scientistSchema),
    defaultValues: {
      firstName: s?.firstName || "",
      lastName: s?.lastName || "",
      academicTitle: s?.academicTitle || "",
      description: s?.description,
      institutions: s?.institutions || [],
      countries: s?.countries || [],
      areas: s?.areas || [],
      email: s?.email || "",
      phoneNumber: s?.phoneNumber || "",
      linkedInUrl: s?.linkedInUrl || "",
      orcid: s?.orcid || "",
      website: s?.website || "",
      dateOfBirth: s?.dateOfBirth || "",
    },
  });
