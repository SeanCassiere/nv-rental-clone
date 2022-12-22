import { z } from "zod";

export const CustomerSummarySchema = z.object({
  customerId: z.number(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  openedReservation: z.number(),
  confirmedReservation: z.number(),
  noShowReservation: z.number(),
  cancelledReservation: z.number(),
  openedAgreements: z.number(),
  closedAgreements: z.number(),
  totalTrafficTickets: z.number(),
  pendingPayments: z.number(),
  pendingDeposit: z.number(),
  totalRevenue: z.number(),
});
export type TCustomerSummarySchema = z.infer<typeof CustomerSummarySchema>;
