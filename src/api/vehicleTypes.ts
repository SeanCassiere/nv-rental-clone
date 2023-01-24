import { callV3Api, type CommonAuthParams, makeUrl } from "./fetcher";
import { VehicleTypeSchemaArray } from "../utils/schemas/vehicleType";

export const fetchVehicleTypesList = async (opts: CommonAuthParams) => {
  return await callV3Api(
    makeUrl(`/v3/vehicletypes`, {
      clientId: opts.clientId,
      userId: opts.userId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => VehicleTypeSchemaArray.parse(res.data));
};
