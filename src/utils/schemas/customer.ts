import { z } from "zod";

export const CustomerFiltersSchema = z.object({
  Active: z.coerce.boolean().default(true).optional(),
  SortDirection: z.string().optional(),
});
