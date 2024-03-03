import { z } from "zod";

export const DashboardSearchQuerySchema = z.object({
  show_widget_picker: z.boolean().default(false).optional().catch(false),
});
export type TDashboardSearchQuery = z.infer<typeof DashboardSearchQuerySchema>;
