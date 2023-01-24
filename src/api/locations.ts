import { callV3Api, type CommonAuthParams, makeUrl } from "./fetcher";
import { LocationSchemaArray } from "../utils/schemas/location";

export const fetchLocationsList = async (
  opts: CommonAuthParams & { withActive: boolean }
) => {
  return await callV3Api(
    makeUrl(`/v3/locations`, {
      clientId: opts.clientId,
      userId: opts.userId,
      withActive: opts.withActive ? "true" : "false",
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => LocationSchemaArray.parse(res.data));
};
