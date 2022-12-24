import { z } from "zod";

export const VehicleFiltersSchema = z.object({
  Active: z.coerce.boolean().default(true).optional(),
  SortDirection: z.string().optional(),
});
