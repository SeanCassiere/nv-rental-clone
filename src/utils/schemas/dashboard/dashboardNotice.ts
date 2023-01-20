import { z } from "zod";

const DashboardNoticeSchema = z.object({
  id: z.string(),
  titleText: z.string(),
  titleTextShort: z.string(),
  actionText: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  link: z.string().nullable(),
  ignoreDismiss: z.boolean(),
});

export const DashboardNoticeListParsed = z.array(DashboardNoticeSchema);
export type TDashboardNotice = z.infer<typeof DashboardNoticeSchema>;
