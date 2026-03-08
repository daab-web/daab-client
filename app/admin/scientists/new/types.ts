import { z } from "zod"

export const scientistSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  academicTitle: z.string().min(1, "Academic title is required"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  institutions: z.array(z.string()),
  countries: z.array(z.string()).min(1, "At least one country is required"),
  areas: z.array(z.string()).min(1, "At least one research area is required"),
});

export type ScientistFormData = z.infer<typeof scientistSchema>;

