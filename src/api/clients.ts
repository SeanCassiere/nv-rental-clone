import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";
import { ClientProfileSchema, ClientFeatureListSchema } from "@/schemas/client";

export const fetchClientProfile = async (opts: CommonAuthParams) => {
  return await callV3Api(makeUrl(`/v3/clients/${opts.clientId}`, {}), {
    headers: { Authorization: `Bearer ${opts.accessToken}` },
  }).then((res) => ClientProfileSchema.parse(res.data));
};

export const fetchClientFeatures = async (
  opts: Omit<CommonAuthParams, "userId">
) => {
  return await callV3Api(
    makeUrl(`/v3/clients/${opts.clientId}/clientfeatures`, {}),
    {
      method: "POST",
      headers: { Authorization: `Bearer ${opts.accessToken}` },
    }
  ).then((res) => ClientFeatureListSchema.parse(res.data));
};
