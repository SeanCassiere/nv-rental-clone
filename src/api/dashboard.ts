import { dateToQueryYearMonthDay } from "../utils/date";
import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

export const fetchDashboardStats = async (
  opts: { locationId: number; clientDate: Date } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/statistics`, {
      clientId: opts.clientId,
      userId: opts.userId,
      locationId: opts.locationId ?? 0,
      clientDate: dateToQueryYearMonthDay(opts.clientDate),
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => res.data);
};
