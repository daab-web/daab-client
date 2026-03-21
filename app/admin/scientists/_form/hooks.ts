import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createScientist, updateScientist } from "@/lib/api/scientists";
import { toast } from "sonner";
import { ScientistFormData, scientistSchema } from "./types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Scientist } from "@/types/scientist";

export function useScientistCreateMutation() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (data: ScientistFormData) => createScientist(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["scientists"] });
      toast.success("Scientist created successfully");
    },
    onError: () => toast.error("Unable to create scientist"),
  });
}

export function useScientistUpdateMutation(id: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (data: ScientistFormData) => { 
      return updateScientist(id, data)
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["scientists"] });
      toast.success("Scientist updated successfully");
    },
    onError: () => toast.error("Unable to update scientist"),
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
      orcId: s?.orcid || "",
      website: s?.website || "",
      dateOfBirth: s?.dateOfBirth || "",
    },
  });

