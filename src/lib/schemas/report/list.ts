import { z } from "zod";

export const ReportsListItemSchema = z.object({
  reportId: z.coerce.string(),
  title: z.string().nullable(),
  name: z.string().nullable(),
  reportCategory: z.string().nullable(),
});

export type TReportsListItem = z.infer<typeof ReportsListItemSchema>;

export const ReportsListSchema = z.array(ReportsListItemSchema);
