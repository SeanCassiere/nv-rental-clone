import { z } from "zod";

export const CustomerFiltersSchema = z.object({
  Active: z.coerce.boolean().default(true).optional(),
  SortDirection: z.string().optional(),
  CustomerTypes: z.coerce.string().optional(),
});

export const CustomerSearchQuerySchema = z.object({
  page: z.number().min(1).default(1),
  size: z.number().min(1).default(10),
  filters: CustomerFiltersSchema.optional(),
});
export type TCustomerSearchQuery = z.infer<typeof CustomerSearchQuerySchema>;
