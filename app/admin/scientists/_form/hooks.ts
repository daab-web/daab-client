import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createScientist, updateScientist, updateScientistTranslation } from "@/lib/api/scientists";
import { toast } from "sonner";
import { ScientistFormData, scientistSchema } from "./types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Scientist } from "@/types/scientist";

export function useScientistCreateMutation(locale: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (data: ScientistFormData) => {
      const { id } = await createScientist(data, locale)
      const translationRes = await updateScientistTranslation(id, locale, {
        firstName: data.firstName,
        lastName: data.lastName,
        description: JSON.stringify(data.description)
      })
      if (!translationRes.ok) {
        throw new Error(`Failed to create scientist translation (${translationRes.status})`);
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

export function useScientistUpdateMutation(id: string, locale: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (data: ScientistFormData) => {
      const translationRes = await updateScientistTranslation(id, locale, {
        firstName: data.firstName,
        lastName: data.lastName,
        description: JSON.stringify(data.description)
      })
      if (!translationRes.ok) {
        throw new Error(`Failed to update scientist translation (${translationRes.status})`);
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

