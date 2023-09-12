import { z } from "zod";

import { RentalRateSchema } from "@/schemas/rate";

export type CalculateRentalSummaryAmountsInput = z.infer<
  typeof CalculateRentalSummaryInputSchema
>;

export const CalculateRentalSummaryInputSchema = z.object({
  clientId: z.string(),
  locationId: z.number(),
  locationToId: z.number(),
  vehicleTypeId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  miscCharges: z.array(
    z.object({
      id: z.number(),
      locationMiscChargeId: z.number(),
      quantity: z.number(),
      startDate: z.string(),
      endDate: z.string(),
      optionId: z.number(),
      value: z.number(),
      minValue: z.number(),
      maxValue: z.number(),
      hourlyValue: z.number(),
      dailyValue: z.number(),
      weeklyValue: z.number(),
      monthlyValue: z.number(),
      hourlyQuantity: z.number(),
      dailyQuantity: z.number(),
      weeklyQuantity: z.number(),
      monthlyQuantity: z.number(),
    })
  ),
  taxIds: z.array(z.number()),
  rates: z.array(RentalRateSchema),
  advancePayment: z.number(),
  amountPaid: z.number(),
  preAdjustment: z.number(),
  postAdjustment: z.number(),
  securityDeposit: z.string().or(z.number()),
  additionalCharge: z.number(),
  unTaxableAdditional: z.number(),
  agreementId: z.number(),
  agreementTypeName: z.string(),
  promotionIds: z.array(z.any()),
  agreementInsurance: z.null(),
  writeOffAmount: z.number().nullable(),
  customerId: z.number(),
  isCheckin: z.boolean(),
  odometerOut: z.number(),
  odometerIn: z.number(),
});
