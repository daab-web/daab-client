import { z } from "zod";

const TranslationEntrySchema = z.object({
  locale: z.string().max(3).nonempty(),
  name: z.string().nonempty(),
});

export const AddAreaSchema = z.object({
  nameEn: z.string().nonempty(),
  translations: z.array(TranslationEntrySchema),
});

export type AddAreaReq = z.infer<typeof AddAreaSchema>;
