import { z } from "zod";

export const ReservationFiltersSchema = z
  .object({
    Statuses: z.array(z.coerce.number()).optional(),
    CreatedDateFrom: z.string().optional(),
    CreatedDateTo: z.string().optional(),
    SortDirection: z.string().optional(),
    CustomerId: z.string().optional(),
    VehicleId: z.string().optional(),
    VehicleNo: z.coerce.string().optional(),
    VehicleTypeId: z.coerce.string().optional(),
    CheckoutLocationId: z.coerce.string().optional(),
    CheckinLocationId: z.coerce.string().optional(),
    ReservationTypes: z.coerce.string().optional(),
  })
  .superRefine(({ CreatedDateFrom, CreatedDateTo }, ctx) => {
    if (CreatedDateFrom && CreatedDateTo && CreatedDateFrom > CreatedDateTo) {
      ctx.addIssue({
        message: "CreatedDateFrom must be before the CreatedDateTo",
        code: "custom",
      });
    }
  });

export const ReservationSearchQuerySchema = z.object({
  page: z.number().min(1).default(1),
  size: z.number().min(1).default(10),
  filters: ReservationFiltersSchema.optional(),
});
export type TReservationSearchQuery = z.infer<
  typeof ReservationSearchQuerySchema
>;
