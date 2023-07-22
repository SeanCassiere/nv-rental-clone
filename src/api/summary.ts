import formatISO from "date-fns/formatISO";

import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";
import { RentalRatesSummarySchema } from "@/schemas/summary";
import { CustomerSummarySchema } from "@/schemas/summary/customerSummary";
import { VehicleSummarySchema } from "@/schemas/summary/vehicleSummary";
import type { CalculateRentalSummaryAmountsInput } from "@/types/CalculateRentalSummaryAmounts";
import { localDateTimeToQueryYearMonthDay } from "@/utils/date";

export const fetchRentalRateSummaryAmounts = async (
  opts: {
    module: "reservations" | "agreements";
    referenceId: string;
  } & CommonAuthParams
) => {
  const agreementUrl = makeUrl(`/v3/agreements/${opts.referenceId}/summary`, {
    clientId: opts.clientId,
    userId: opts.userId,
  });
  const reservationUrl = makeUrl(
    `/v3/reservations/${opts.referenceId}/summary`,
    {
      clientId: opts.clientId,
      userId: opts.userId,
    }
  );

  return await callV3Api(
    opts.module === "agreements" ? agreementUrl : reservationUrl,
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => RentalRatesSummarySchema.parse(res.data));
};

export const fetchCustomerSummaryAmounts = async (
  opts: { customerId: string | number } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/customers/${opts.customerId}/summary`, {
      clientId: opts.clientId,
      userId: opts.userId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => CustomerSummarySchema.parse(res.data));
};

export const fetchVehicleSummaryAmounts = async (
  opts: { vehicleId: string | number; clientDate: Date } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/vehicles/${opts.vehicleId}/summary`, {
      clientId: opts.clientId,
      userId: opts.userId,
      clientTime: localDateTimeToQueryYearMonthDay(opts.clientDate),
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => VehicleSummarySchema.parse(res.data));
};

export async function postCalculateRentalSummaryAmounts(
  opts: CommonAuthParams & CalculateRentalSummaryAmountsInput
) {
  const { accessToken, clientId, userId, ...inputs } = opts;
  const { startDate, endDate, checkoutLocationId, checkinLocationId, rate } =
    inputs;

  const body = {
    clientId: String(clientId),
    locationId: checkoutLocationId,
    locationToId: checkinLocationId,
    vehicleTypeId: inputs.vehicleTypeId,
    startDate: formatISO(startDate, {
      format: "extended",
      representation: "complete",
    }),
    endDate: formatISO(endDate, {
      format: "extended",
      representation: "complete",
    }),
    miscCharges: inputs.miscCharges.map((charge) => ({
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
    taxIds: inputs.taxIds,
    rates: [rate],
    advancePayment: inputs.advancePayment,
    amountPaid: inputs.amountPaid,
    preAdjustment: inputs.preAdjustment,
    postAdjustment: inputs.postAdjustment,
    securityDeposit: inputs.securityDeposit,
    additionalCharge: inputs.additionalCharge,
    unTaxableAdditional: inputs.unTaxableAdditional,
    agreementId: inputs.agreementId,
    agreementTypeName: inputs.agreementTypeName,
    promotionIds: [],
    agreementInsurance: null,
    writeOffAmount: inputs.writeOffAmount,
    customerId: inputs.customerId,
    isCheckin: inputs.isCheckin,
    odometerOut: 0,
    odometerIn: 0,
  };

  return await callV3Api(makeUrl(`/v3/summary`, {}), {
    method: "POST",
    body: JSON.stringify(body),
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then((res) => RentalRatesSummarySchema.parse(res.data));
}
