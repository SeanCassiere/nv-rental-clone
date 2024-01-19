import { queryOptions } from "@tanstack/react-query";

import type { RentalRateParsed } from "@/schemas/rate";
import type { CalculateRentalSummaryAmountsInput } from "@/schemas/summary";

import { sortObjectKeys } from "@/utils/sort";

import { apiClient } from "@/api";

import { isEnabled, makeQueryKey, type Auth } from "./helpers";

const SEGMENT = "summary";

type MiscCharge = CalculateRentalSummaryAmountsInput["miscCharges"][number] & {
  isSelected: boolean;
  unit: number;
  isTaxable: boolean;
};

export type CalculateRentalSummaryInput = {
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

/**
 *
 * @api `/summary`
 */
export function fetchSummaryForRentalOptions(
  options: {
    input: CalculateRentalSummaryInput;
    enabled?: boolean;
  } & Auth
) {
  const { enabled = true, input } = options;

  const { startDate, endDate, checkoutLocationId, checkinLocationId, rate } =
    input;

  const body: CalculateRentalSummaryAmountsInput = {
    clientId: options.auth.clientId,
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

  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      "calculate",
      sortObjectKeys(options.input),
    ]),
    queryFn: () =>
      apiClient.summary
        .getLiveCalculationsForRental({ body })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options) && enabled,
  });
}
