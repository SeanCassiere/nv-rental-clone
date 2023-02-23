import formatISO from "date-fns/formatISO";

import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";
import { RentalRatesSummarySchema } from "../utils/schemas/summary";
import { CustomerSummarySchema } from "../utils/schemas/summary/customerSummary";
import { VehicleSummarySchema } from "../utils/schemas/summary/vehicleSummary";
import { localDateTimeToQueryYearMonthDay } from "../utils/date";
import type { CalculateRentalSummaryAmountsInput } from "../types/CalculateRentalSummaryAmounts";

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
    miscCharges: [],
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
  };

  return await callV3Api(makeUrl(`/v3/summary`, {}), {
    method: "POST",
    body: JSON.stringify(body),
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then((res) => RentalRatesSummarySchema.parse(res.data));
}
