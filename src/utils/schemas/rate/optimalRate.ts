import { z } from "zod";

export const OptimalRateSchema = z
  .object({
    rateId: z.number(),
    rateName: z.string().nullable().default("app-not-set"),
    isOptimal: z.coerce.boolean(),
  })
  .nullable();
