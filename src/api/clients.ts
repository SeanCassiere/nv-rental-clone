import { ClientProfileSchema } from "@/schemas/client";
import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

export const fetchClientProfile = async (opts: CommonAuthParams) => {
  return await callV3Api(makeUrl(`/v3/clients/${opts.clientId}`, {}), {
    headers: { Authorization: `Bearer ${opts.accessToken}` },
  }).then((res) => ClientProfileSchema.parse(res.data));
};
