import { z } from "zod";

export const VehicleFiltersSchema = z.object({
  Active: z.coerce.boolean().default(true).optional(),
  // SortBy: z.string().optional(),
  SortDirection: z.string().optional(),
});
// .superRefine(({ StartDate, EndDate }, ctx) => {
//   if (StartDate && EndDate && StartDate > EndDate) {
//     ctx.addIssue({
//       message: "Start date must be before the End date",
//       code: "custom",
//     });
//   }
// });
