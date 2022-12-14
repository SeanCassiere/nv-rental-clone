import { z } from "zod";

export const customerFiltersModel = z.object({
  Active: z.coerce.boolean().default(true).optional(),
  SortDirection: z.string().optional(),
});
