import { TaxListSchema } from "../utils/schemas/tax";
import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

export async function fetchTaxesList(
  opts: CommonAuthParams & { LocationId: number },
) {
  const { clientId, userId, accessToken, ...props } = opts;
  return await callV3Api(makeUrl(`/v3/taxes`, { clientId, userId, ...props }), {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then((res) => TaxListSchema.parse(res.data));
}
