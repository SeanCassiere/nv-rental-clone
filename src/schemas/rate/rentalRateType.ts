import { z } from "zod";

const RentalRateTypeSchema = z.object({
  rateId: z.number(),
  rateName: z.string().nullable().default("app not set rate"),
});
export type RentalRateTypeParsed = z.infer<typeof RentalRateTypeSchema>;
export const RentalRateTypeListSchema = z.array(RentalRateTypeSchema);
