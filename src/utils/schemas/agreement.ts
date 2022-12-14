import { z } from "zod";

// EndDate: z
//   .preprocess((arg) => {
//     if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
//   }, z.date())
//   .optional(),

export const agreementFiltersModel = z
  .object({
    AgreementStatusName: z.string().optional(),
    Statuses: z.coerce.number().optional(),
    IsSearchOverdues: z.coerce.boolean().optional(),
    StartDate: z.coerce.date().optional(),
    EndDate: z.coerce.date().optional(),
    SortBy: z.string().optional(),
    SortDirection: z.string().optional(),
  })
  .superRefine(({ StartDate, EndDate }, ctx) => {
    if (StartDate && EndDate && StartDate > EndDate) {
      ctx.addIssue({
        message: "Start date must be before the End date",
        code: "custom",
      });
    }
  });
