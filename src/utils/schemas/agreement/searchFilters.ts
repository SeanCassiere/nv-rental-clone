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
    VehicleTypeId: z.coerce.string().optional(),
    PickupLocationId: z.coerce.string().optional(),
    ReturnLocationId: z.coerce.string().optional(),
    AgreementTypes: z.coerce.string().optional(),
  })
  .superRefine(({ StartDate, EndDate }, ctx) => {
    if (StartDate && EndDate && StartDate > EndDate) {
      ctx.addIssue({
        message: "Start date must be before the End date",
        code: "custom",
      });
    }
  });

export const AgreementSearchQuerySchema = z.object({
  page: z.number().min(1).default(1),
  size: z.number().min(1).default(10),
  filters: AgreementFiltersSchema.optional(),
});
export type TAgreementSearchQuery = z.infer<typeof AgreementSearchQuerySchema>;
