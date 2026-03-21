import { z } from "zod";

const TranslationEntrySchema = z.object({
  locale: z.string().max(3).nonempty(),
  name: z.string().nonempty(),
});

export const AddAreaSchema = z.object({
  nameEn: z.string().nonempty(),
  translations: z.array(TranslationEntrySchema),
});

export const UpdateAreaSchema = AddAreaSchema.extend({
  previousNameEn: z.string().nonempty().optional(),
});

export type AddAreaReq = z.infer<typeof AddAreaSchema>;
export type UpdateAreaReq = z.infer<typeof UpdateAreaSchema>;
