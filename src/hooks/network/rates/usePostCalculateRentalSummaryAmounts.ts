import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import type { RentalRateParsed } from "@/schemas/rate";
import type { CalculateRentalSummaryAmountsInput } from "@/schemas/summary";

import { apiClient } from "@/api";

type MiscCharge = CalculateRentalSummaryAmountsInput["miscCharges"][number] & {
  isSelected: boolean;
  unit: number;
  isTaxable: boolean;
};

export type CalculateRentalSummaryHookInput = {
  startDate: Date;
  endDate: Date;
  checkoutLocationId: number;
  checkinLocationId: number;
  miscCharges: MiscCharge[];
  rate: RentalRateParsed;
  vehicleTypeId: number;
  taxIds: number[];
  advancePayment: number;
  amountPaid: number;
  preAdjustment: number;
  postAdjustment: number;
  securityDeposit: string | number;
  additionalCharge: number;
  unTaxableAdditional: number;
  fuelLevelOut: string;
  takeSize: number;
  fuelLevelIn: string;
  odometerOut: number;
  odometerIn: number;
  agreementId: number;
  agreementTypeName?: string;
  isCheckin: boolean;
  promotionIds: any[];
  agreementInsurance: null;
  writeOffAmount: number | null;
  customerId: number;
};

export function usePostCalculateRentalSummaryAmounts(opts: {
  input: CalculateRentalSummaryHookInput;
  enabled?: boolean;
}) {
  const { enabled = true, input } = opts;

  const auth = useAuth();

  const query = useQuery({
    queryKey: ["add-rental", "summary", JSON.stringify(opts.input)],
    enabled: auth.isAuthenticated && enabled,
    queryFn: () => {
      const clientId = auth.user?.profile.navotar_clientid || "";
      const {
        startDate,
        endDate,
        checkoutLocationId,
        checkinLocationId,
        rate,
      } = input;

      const body: CalculateRentalSummaryAmountsInput = {
        clientId: String(clientId),
        locationId: checkoutLocationId,
        locationToId: checkinLocationId,
        vehicleTypeId: input.vehicleTypeId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        miscCharges: input.miscCharges.map((charge) => ({
          id: charge.id,
          locationMiscChargeId: charge.locationMiscChargeId ?? 0,
          quantity: charge.quantity ?? 0,
          startDate: charge.startDate ?? "",
          endDate: charge.endDate ?? "",
          optionId: charge.optionId ?? 0,
          value: charge.value,
          minValue: charge.minValue,
          maxValue: charge.maxValue,
          hourlyValue: charge.hourlyValue,
          dailyValue: charge.dailyValue,
          weeklyValue: charge.weeklyValue,
          monthlyValue: charge.monthlyValue,
          hourlyQuantity: charge.hourlyQuantity,
          dailyQuantity: charge.dailyQuantity,
          weeklyQuantity: charge.weeklyQuantity,
          monthlyQuantity: charge.monthlyQuantity,
        })),
        taxIds: input.taxIds,
        rates: [rate],
        advancePayment: input.advancePayment,
        amountPaid: input.amountPaid,
        preAdjustment: input.preAdjustment,
        postAdjustment: input.postAdjustment,
        securityDeposit: input.securityDeposit,
        additionalCharge: input.additionalCharge,
        unTaxableAdditional: input.unTaxableAdditional,
        agreementId: input.agreementId,
        agreementTypeName: input.agreementTypeName ?? "",
        promotionIds: [],
        agreementInsurance: null,
        writeOffAmount: input.writeOffAmount,
        customerId: input.customerId,
        isCheckin: input.isCheckin,
        odometerOut: input.odometerOut,
        odometerIn: input.odometerIn,
        fuelLevelIn: input.fuelLevelIn,
        fuelLevelOut: input.fuelLevelOut,
      };

      return apiClient.summary.getLiveCalculationsForRental({ body });
    },
  });
  return query;
}
