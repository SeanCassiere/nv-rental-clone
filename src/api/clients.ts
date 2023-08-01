import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

import { ClientProfileSchema, ClientFeatureListSchema } from "@/schemas/client";

import { setLocalStorageForUser } from "@/utils/user-local-storage";
import { USER_STORAGE_KEYS } from "@/utils/constants";

export const fetchClientProfile = async (opts: CommonAuthParams) => {
  return await callV3Api(makeUrl(`/v3/clients/${opts.clientId}`, {}), {
    headers: { Authorization: `Bearer ${opts.accessToken}` },
  }).then((res) => {
    const data = ClientProfileSchema.parse(res.data);
    const currency = data.currency || "USD";

    setLocalStorageForUser(
      opts.clientId,
      opts.userId,
      USER_STORAGE_KEYS.currency,
      currency
    );

    return data;
  });
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
