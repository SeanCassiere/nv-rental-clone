import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";
import { RentalRatesSummarySchema } from "../utils/schemas/summary";
import { CustomerSummarySchema } from "../utils/schemas/summary/customerSummary";
import { VehicleSummarySchema } from "../utils/schemas/summary/vehicleSummary";
import { localDateTimeToQueryYearMonthDay } from "../utils/date";

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
      clientTime: localDateTimeToQueryYearMonthDay(opts.clientDate, true),
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => VehicleSummarySchema.parse(res.data));
};
