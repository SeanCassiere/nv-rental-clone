import { z } from "zod";

export const reservationFiltersModel = z
  .object({
    Statuses: z.coerce.number().optional(),
    CreatedDateFrom: z.coerce.date().optional(),
    CreatedDateTo: z.coerce.date().optional(),
    // SortBy: z.string().optional(),
    SortDirection: z.string().optional(),
  })
  .superRefine(({ CreatedDateFrom, CreatedDateTo }, ctx) => {
    if (CreatedDateFrom && CreatedDateTo && CreatedDateFrom > CreatedDateTo) {
      ctx.addIssue({
        message: "CreatedDateFrom must be before the CreatedDateTo",
        code: "custom",
      });
    }
  });
