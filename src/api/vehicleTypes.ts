import { callV3Api, type CommonAuthParams, makeUrl } from "./fetcher";
import { VehicleTypeSchemaArray } from "@/schemas/vehicleType";
import { localDateTimeWithoutSecondsToQueryYearMonthDay } from "@/utils/date";

export type VehicleTypesListExtraOpts = {
  StartDate?: Date;
  EndDate?: Date;
  VehicleTypeId?: number;
  BaseRate?: number;
  LocationID?: number;
};

export const fetchVehicleTypesList = async (
  opts: CommonAuthParams & VehicleTypesListExtraOpts
) => {
  return await callV3Api(
    makeUrl(`/v3/vehicletypes`, {
      clientId: opts.clientId,
      userId: opts.userId,
      ...(typeof opts.StartDate !== "undefined"
        ? {
            StartDate: localDateTimeWithoutSecondsToQueryYearMonthDay(
              opts.StartDate
            ),
          }
        : {}),
      ...(typeof opts.EndDate !== "undefined"
        ? {
            EndDate: localDateTimeWithoutSecondsToQueryYearMonthDay(
              opts.EndDate
            ),
          }
        : {}),
      ...(typeof opts.VehicleTypeId !== "undefined"
        ? { VehicleTypeId: `${opts.VehicleTypeId}` }
        : {}),
      ...(typeof opts.BaseRate !== "undefined"
        ? { BaseRate: `${opts.BaseRate}` }
        : {}),
      ...(typeof opts.LocationID !== "undefined"
        ? { LocationID: `${opts.LocationID}` }
        : {}),
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => VehicleTypeSchemaArray.parse(res.data));
};
