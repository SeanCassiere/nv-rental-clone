import type { DashboardNoticeType } from "../types/Dashboard";
import { localDateToQueryYearMonthDay } from "../utils/date";
import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";

export const fetchDashboardStats = async (
  opts: { locationId: number; clientDate: Date } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/statistics`, {
      clientId: opts.clientId,
      userId: opts.userId,
      locationId: opts.locationId ?? 0,
      clientDate: localDateToQueryYearMonthDay(opts.clientDate),
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => res.data);
};

export const fetchDashboardNoticeList = async () => {
  const currentDate = new Date();
  const data = await fetch("/notices.json")
    .then((res) => res.json())
    .catch(() => []);

  const mapped: (DashboardNoticeType | null)[] = data.map(
    (notice: DashboardNoticeType) => {
      const startDate = notice.startDate ? new Date(notice.startDate) : null;
      const endDate = notice.endDate ? new Date(notice.endDate) : null;

      // if start date is in the future, don't show
      if (startDate && startDate > currentDate) {
        return null;
      }
      // if end date is in the past, don't show
      if (endDate && endDate < currentDate) {
        return null;
      }

      // if start date is in the past and end date is in the future, show
      if (
        startDate &&
        endDate &&
        startDate < currentDate &&
        endDate > currentDate
      ) {
        return notice;
      }

      // if start date is in the past and no end date, show
      if (startDate && !endDate && startDate < currentDate) {
        return notice;
      }
      // if end date is in the future and no start date, show
      if (endDate && !startDate && endDate > currentDate) {
        return notice;
      }

      // if no start or end date, show
      if (!startDate && !endDate) {
        return notice;
      }

      return null;
    }
  );
  return mapped.filter((notice) => notice !== null) as any[];
};
