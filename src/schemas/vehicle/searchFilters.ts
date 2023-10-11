import { z } from "zod";

export const VehicleFiltersSchema = z.object({
  Active: z
    .preprocess(
      (val) =>
        val === "true" || val === "1" || val === true || val === 1
          ? "true"
          : "false",
      z.string()
    )
    .optional(),
  SortDirection: z.string().optional(),
  VehicleNo: z.coerce.string().optional(),
  VehicleId: z.string().optional(),
  VehicleStatus: z.string().optional(),
  VehicleTypeId: z.coerce.string().optional(),
  OwningLocationId: z.coerce.string().optional(),
  CurrentLocationId: z.coerce.string().optional(),
  LicenseNo: z.string().optional(),
});

export const VehicleSearchQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  size: z.coerce.number().min(1).default(10),
  filters: VehicleFiltersSchema.optional(),
});
export type TVehicleSearchQuery = z.infer<typeof VehicleSearchQuerySchema>;
