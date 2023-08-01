import { z } from "zod";
import parse from "date-fns/parse";
import isBefore from "date-fns/isBefore";

export const AgreementFiltersSchema = z
  .object({
    AgreementStatusName: z.string().optional(),
    Statuses: z.array(z.string()).optional(),
    IsSearchOverdues: z
      .preprocess(
        (val) =>
          val === "true" || val === "1" || val === true || val === 1
            ? "true"
            : "false",
        z.string()
      )
      .optional(),
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
    Keyword: z.coerce.string().optional(),
  })
  .superRefine(({ StartDate, EndDate }, ctx) => {
    if (StartDate && EndDate) {
      const startDateParsed = parse(StartDate, "yyyy-MM-dd", new Date());
      const endDateParsed = parse(EndDate, "yyyy-MM-dd", new Date());

      if (isBefore(endDateParsed, startDateParsed)) {
        ctx.addIssue({
          message: "Start date must be before the End date",
          code: "custom",
        });
      }
    }
  });

export const AgreementSearchQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  size: z.coerce.number().min(1).default(10),
  filters: AgreementFiltersSchema.optional(),
});
export type TAgreementSearchQuery = z.infer<typeof AgreementSearchQuerySchema>;
