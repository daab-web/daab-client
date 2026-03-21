import { z } from "zod";

export const AddCountrySchema = z.object({
  nameEn: z.string().nonempty(),
  translations: z.array(
    z.object({
      locale: z.string().max(3).nonempty(),
      name: z.string().nonempty(),
    }),
  ),
});

export const UpdateCountrySchema = AddCountrySchema.extend({
  previousNameEn: z.string().nonempty().optional(),
});

export type AddCountryReq = z.infer<typeof AddCountrySchema>;
export type UpdateCountryReq = z.infer<typeof UpdateCountrySchema>;
