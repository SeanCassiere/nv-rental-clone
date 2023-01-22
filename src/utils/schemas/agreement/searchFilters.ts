import { z } from "zod";

export const AgreementFiltersSchema = z
  .object({
    AgreementStatusName: z.string().optional(),
    Statuses: z.array(z.coerce.number()).optional(),
    IsSearchOverdues: z.coerce.boolean().optional(),
    StartDate: z.string().optional(),
    EndDate: z.string().optional(),
    SortBy: z.string().optional(),
    SortDirection: z.string().optional(),
    CustomerId: z.string().optional(),
    VehicleId: z.string().optional(),
    VehicleNo: z.coerce.string().optional(),
  })
  .superRefine(({ StartDate, EndDate }, ctx) => {
    if (StartDate && EndDate && StartDate > EndDate) {
      ctx.addIssue({
        message: "Start date must be before the End date",
        code: "custom",
      });
    }
  });
