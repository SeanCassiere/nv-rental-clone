import { validateApiResWithZodSchema } from "../utils/schemas/apiFetcher";
import { VehicleExchangeItemListSchema } from "../utils/schemas/vehicleExchange";
import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

export const fetchExchangesForAgreement = async (
  opts: {
    agreementId: string;
  } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/vehicleExchange`, {
      clientId: opts.clientId,
      userId: opts.userId,
      agreementId: opts.agreementId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) =>
    validateApiResWithZodSchema(VehicleExchangeItemListSchema, res)
  );
};
