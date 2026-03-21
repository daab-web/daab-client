import { SerializedEditorState } from "lexical";
import { z } from "zod";

const publicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.url().optional().or(z.literal("")),
});

export const scientistSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  academicTitle: z.string().min(1, "Academic title is required"),
  description: z.custom<SerializedEditorState>().optional(),
  institutions: z
    .array(z.string())
    .min(1, "At least one institution is required"),
  countries: z.array(z.string()).min(1, "At least one country is required"),
  areas: z.array(z.string()).min(1, "At least one research area is required"),
  email: z.email().optional().or(z.literal("")),
  phoneNumber: z.string().optional(),
  linkedInUrl: z.url().optional().or(z.literal("")),
  orcId: z.string().optional(),
  website: z.url().optional().or(z.literal("")),
  dateOfBirth: z.string().optional(),
});

export type ScientistFormData = z.infer<typeof scientistSchema>;
