import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

export const fetchReservationsList = async (
  opts: {
    page: number;
    pageSize: number;
    filters: any;
  } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/reservations`, {
      ...opts.filters,
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
