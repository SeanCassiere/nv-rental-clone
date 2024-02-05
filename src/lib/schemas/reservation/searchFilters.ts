import { isBefore, parse } from "date-fns";
import { z } from "zod";

export const ReservationFiltersSchema = z
  .object({
    Statuses: z.array(z.string()).optional(),
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
    Keyword: z.coerce.string().optional(),
    ReservationNumber: z.string().optional(),
  })
  .superRefine(({ CreatedDateFrom, CreatedDateTo }, ctx) => {
    if (CreatedDateFrom && CreatedDateTo) {
      const createdDateFromParsed = parse(
        CreatedDateFrom,
        "yyyy-MM-dd",
        new Date()
      );
      const createdDateToParsed = parse(
        CreatedDateTo,
        "yyyy-MM-dd",
        new Date()
      );
      if (isBefore(createdDateToParsed, createdDateFromParsed)) {
        ctx.addIssue({
          message: "Start date must be before the End date",
          code: "custom",
        });
      }
    }
  });

export const ReservationSearchQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  size: z.coerce.number().min(1).default(10).optional(),
  filters: ReservationFiltersSchema.optional(),
});
export type TReservationSearchQuery = z.infer<
  typeof ReservationSearchQuerySchema
>;
