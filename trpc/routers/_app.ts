import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import DB from "@/db";

export const appRouter = createTRPCRouter({
  institutions: baseProcedure
    .input(z.object({ locale: z.string().default("en") }))
    .query(async (opts) => {
      const { locale } = opts.input;
      const data = await DB.findOneAsync(
        { locale },
        { institutions: 1, _id: 0 },
      );

      return Object.keys(data.institutions || {})
    }),

  areas: baseProcedure
    .input(z.object({ locale: z.string().default("en") }))
    .query(async (opts) => {
      const { locale } = opts.input;
      const data = await DB.findOneAsync({ locale }, { areas: 1, _id: 0 });

      return Object.keys(data.areas || {})
    }),

  countries: baseProcedure
    .input(z.object({ locale: z.string().default("en") }))
    .query(async (opts) => {
      const { locale } = opts.input;
      const data = await DB.findOneAsync({ locale }, { countries: 1, _id: 0 });

      return Object.keys(data.countries || {})
    }),
});

export type AppRouter = typeof appRouter;
