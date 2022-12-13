import { z } from "zod";

// EndDate: z
//   .preprocess((arg) => {
//     if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
//   }, z.date())
//   .optional(),

export const agreementFiltersModel = z.object({
  AgreementStatusName: z.string().optional(),
  Statuses: z.number().optional(),
  IsSearchOverdues: z.boolean().optional(),
  StartDate: z.coerce.date().optional(),
  EndDate: z.coerce.date().optional(),
});
