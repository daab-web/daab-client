import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createScientist } from "@/lib/api";
import { toast } from "sonner";
import { ScientistFormData } from "./types";

export function useScientistMutation() {
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
