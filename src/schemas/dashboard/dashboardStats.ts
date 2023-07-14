import { z } from "zod";

export const DashboardStatsSchema = z.object({
  openAgreement: z.number().default(0).nullable(),
  overDues: z.number().default(0).nullable(),
  dueIn: z.number().default(0).nullable(),
  todaysReservationCount: z.number().default(0).nullable(),
  todaysArrivalsCount: z.number().default(0).nullable(),
  serviceAlerts: z.number().default(0).nullable(),
  onHoldAgreements: z.number().default(0).nullable(),
  paymentDelay: z.number().default(0).nullable(),
  pendingPayment: z.number().default(0).nullable(),
});
export type TDashboardStats = z.infer<typeof DashboardStatsSchema>;
