import { localDateToQueryYearMonthDay } from "@/utils/date";
import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

export const fetchReservationsList = async (
  opts: {
    page?: number;
    pageSize?: number;
    clientDate: Date;
    filters: any;
  } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/reservations`, {
      ...opts.filters,
      clientDate: localDateToQueryYearMonthDay(opts.clientDate),
      Page: opts?.page,
      PageSize: opts?.pageSize,
      clientId: opts.clientId,
      userId: opts.userId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  );
};
