import { z } from "zod";

export const reservationFiltersModel = z.object({
  // StartDate: z.coerce.date().optional(),
  // EndDate: z.coerce.date().optional(),
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
