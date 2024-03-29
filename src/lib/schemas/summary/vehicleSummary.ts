import { z } from "zod";

export const VehicleSummarySchema = z.object({
  currentReservation: z.coerce.string(),
  currentAgreement: z.coerce.string(),
  vehicleMakeName: z.string().nullable(),
  vehicleTypeId: z.number().nullable(),
  vehicleType: z.string().nullable(),
  totalNoOfAgreement: z.number(),
  futureNoOfAgreement: z.number(),
  totalNoOfReservation: z.number(),
  totalRevenue: z.number(),
  totalExpense: z.number(),
  totalProfit: z.number(),
  monthlyRevenue: z.number(),
  monthlyExpense: z.number(),
  monthlyProfit: z.number(),
  monthlyPayment: z.number(),
  leasePayoutAmount: z.number(),
  futureNoOfReservation: z.number(),
  pendingPayment: z.number(),
  createdBy: z.string().nullable(),
  editedBy: z.string().nullable(),
  balanceOwing: z.number(),
  owningLocationId: z.number().nullable(),
  owningLocationName: z.string().nullable(),
  finalPaymentDate: z.string().nullable(),
  currentNetValue: z.number(),
  monthlyDepreciation: z.number(),
  totalAmountDepreciated: z.number(),
  lastRentalDate: z.string().nullable(),
});
export type TVehicleSummarySchema = z.infer<typeof VehicleSummarySchema>;
