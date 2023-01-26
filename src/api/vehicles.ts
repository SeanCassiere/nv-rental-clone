import { localDateTimeToQueryYearMonthDay } from "../utils/date";
import { AgreementStatusListSchema } from "../utils/schemas/agreement";
import { VehicleDataSchema } from "../utils/schemas/vehicle/vehicleData";
import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

export const fetchVehiclesList = async (
  opts: {
    page: number;
    pageSize: number;
    filters: any;
  } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/vehicles`, {
      ...opts.filters,
      clientId: opts.clientId,
      userId: opts.userId,
      page: opts.page,
      pageSize: opts.pageSize,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  );
};

export const fetchVehicleData = async (
  opts: {
    vehicleId: string | number;
    clientTime: Date;
  } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/vehicles/${opts.vehicleId}`, {
      clientId: opts.clientId,
      userId: opts.userId,
      getMakeDetails: "true",
      clientTime: localDateTimeToQueryYearMonthDay(opts.clientTime),
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => VehicleDataSchema.parse(res.data));
};

export const fetchVehicleStatusesList = async (opts: CommonAuthParams) => {
  return await callV3Api(
    makeUrl(`/v3/vehicles/statuses`, {
      clientId: opts.clientId,
      userId: opts.userId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => AgreementStatusListSchema.parse(res.data));
};
