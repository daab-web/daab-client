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

export type AddCountryReq = z.infer<typeof AddCountrySchema>;
