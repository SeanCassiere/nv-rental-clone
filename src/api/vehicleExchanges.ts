import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";
import { VehicleExchangeItemListSchema } from "@/schemas/vehicleExchange";
import { validateApiResWithZodSchema } from "@/schemas/apiFetcher";

export const fetchExchangesForAgreement = async (
  opts: {
    agreementId: string;
  } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/vehicleexchange`, {
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
