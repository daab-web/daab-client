import { z } from "zod";

const TranslationEntrySchema = z.object({
  locale: z.string().max(3).nonempty(),
  name: z.string().nonempty(),
});

export const AddInstitutionSchema = z.object({
  nameEn: z.string().nonempty(),
  translations: z.array(TranslationEntrySchema),
});

export const UpdateInstitutionSchema = AddInstitutionSchema.extend({
  previousNameEn: z.string().nonempty().optional(),
});

export type AddInstitutionReq = z.infer<typeof AddInstitutionSchema>;
export type UpdateInstitutionReq = z.infer<typeof UpdateInstitutionSchema>;
