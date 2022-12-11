import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

export const fetchAgreementsList = async (
  opts: { page: number; pageSize: number } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/agreements`, {
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
