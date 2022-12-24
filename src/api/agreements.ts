import { AgreementDataSchema } from "../utils/schemas/agreement";
import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

export const fetchAgreementsList = async (
  opts: {
    page: number;
    pageSize: number;
    currentDate: Date;
    filters: any;
  } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/agreements`, {
      ...opts.filters,
      currentDate: opts.currentDate.toISOString(),
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

export const fetchAgreementData = async (
  opts: { agreementId: string | number } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/agreements/${opts.agreementId}`, {
      clientId: opts.clientId,
      userId: opts.userId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => AgreementDataSchema.parse(res.data));
};
