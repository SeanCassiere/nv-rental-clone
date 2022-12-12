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
