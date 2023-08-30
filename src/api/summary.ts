import { CustomerSummarySchema } from "@/schemas/summary/customerSummary";
import { VehicleSummarySchema } from "@/schemas/summary/vehicleSummary";

import { localDateTimeToQueryYearMonthDay } from "@/utils/date";

import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

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
