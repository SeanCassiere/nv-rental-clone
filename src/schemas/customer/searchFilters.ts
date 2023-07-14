import { z } from "zod";

export const CustomerFiltersSchema = z.object({
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
  DateOfbirth: z.string().optional(),
  CustomerTypes: z.array(z.string()).optional(),
  Keyword: z.string().optional(),
  Phone: z.string().optional(),
});

export const CustomerSearchQuerySchema = z.object({
  page: z.number().min(1).default(1),
  size: z.number().min(1).default(10),
  filters: CustomerFiltersSchema.optional(),
});
export type TCustomerSearchQuery = z.infer<typeof CustomerSearchQuerySchema>;
