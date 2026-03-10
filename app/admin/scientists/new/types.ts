import { z } from "zod";

const publicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url().optional().or(z.literal("")),
});

export const scientistSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  academicTitle: z.string().min(1, "Academic title is required"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  institutions: z
    .array(z.string())
    .min(1, "At least one institution is required"),
  countries: z.array(z.string()).min(1, "At least one country is required"),
  areas: z.array(z.string()).min(1, "At least one research area is required"),
  email: z.string().email().optional().or(z.literal("")),
  phoneNumber: z.string().optional(),
  linkedInUrl: z.string().url().optional().or(z.literal("")),
  orcId: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  photo: z.instanceof(File).optional().nullable(),
  publications: z.array(publicationSchema).optional(),
});

export type ScientistFormData = z.infer<typeof scientistSchema>;
