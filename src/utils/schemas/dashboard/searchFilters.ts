import { z } from "zod";

export const DashboardSearchQuerySchema = z.object({
  "show-widget-picker": z.boolean().optional(),
});
export type TDashboardSearchQuery = z.infer<typeof DashboardSearchQuerySchema>;
