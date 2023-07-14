import { isBefore, isAfter } from "date-fns";

import { callV3Api, makeUrl, type CommonAuthParams } from "./fetcher";
import {
  DashboardStatsSchema,
  VehicleStatusCountListSchema,
  DashboardWidgetItemListSchema,
  ServerMessageListSchema,
  type TDashboardNotice,
  type DashboardWidgetItemParsed,
} from "@/schemas/dashboard";
import { localDateToQueryYearMonthDay } from "@/utils/date";
import { type StringNumberIdType } from "@/utils/query-key";

export const fetchDashboardStats = async (
  opts: {
    locationId: StringNumberIdType[];
    clientDate: Date;
  } & CommonAuthParams
) => {
  return await callV3Api(
    makeUrl(`/v3/statistics`, {
      clientId: opts.clientId,
      userId: opts.userId,
      clientDate: localDateToQueryYearMonthDay(opts.clientDate),
      ...(opts.locationId.length === 1 && opts.locationId.includes(0)
        ? { locationId: opts.locationId[0] || 0 }
        : {}),
      ...(opts.locationId.length > 1
        ? { MultipleLocation: opts.locationId }
        : {}),
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => DashboardStatsSchema.parse(res.data));
};

export const fetchDashboardNoticeList = async () => {
  const currentDate = new Date();
  const data = await fetch("/notices.json")
    .then((res) => res.json())
    .catch(() => []);

  const mapped: (TDashboardNotice | null)[] = data.map(
    (notice: TDashboardNotice) => {
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

export const fetchDashboardMessagesList = async (opts: CommonAuthParams) => {
  const localMessagesPromise = fetch("/messages.json")
    .then((res) => res.json())
    .then(ServerMessageListSchema.parse)
    .catch(() => []);
  const serverMessagesPromise = fetch("data:application/json;base64,W10=")
    .then((res) => res.json())
    .then(ServerMessageListSchema.parse)
    .catch(() => []); // TODO: implement. currently returns empty array

  const [localMessages, serverMessages] = await Promise.all([
    localMessagesPromise,
    serverMessagesPromise,
  ]);

  const allMessages = [...localMessages, ...serverMessages];

  const currentDate = new Date();
  const sortedMessages = allMessages.filter((message) => {
    if (!message.active) return false;

    const startDate = message.sentDate
      ? new Date(message.sentDate)
      : new Date("1970-01-01");
    const endDate = message.expiryDate ? new Date(message.expiryDate) : null;

    // if start date is in the future, don't show
    if (isAfter(startDate, currentDate)) return false;

    // if end date is in the past, don't show
    if (endDate && isBefore(endDate, currentDate)) return false;

    // if start date is in the past and end date is in the future, show
    if (
      isBefore(startDate, currentDate) &&
      endDate &&
      isAfter(endDate, currentDate)
    ) {
      return true;
    }

    // if start date is in the past and no end date, show
    if (isBefore(startDate, currentDate) && !endDate) return true;

    return false;
  });

  return sortedMessages;
};

export const fetchDashboardWidgetList = async (opts: CommonAuthParams) => {
  return await callV3Api(
    makeUrl(`/v3/dashboard`, {
      clientId: opts.clientId,
      userId: opts.userId,
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => DashboardWidgetItemListSchema.parse(res.data));
};

export const saveDashboardWidgetItem = async (
  opts: { widget: DashboardWidgetItemParsed } & CommonAuthParams
) => {
  const body = {
    ...opts.widget,
    widgetScale: String(opts.widget.widgetScale),
    clientID: Number(opts.clientId),
    userID: Number(opts.userId),
  };

  return await callV3Api(makeUrl("/v3/dashboard", {}), {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${opts.accessToken}`,
    },
  });
};

export const fetchVehicleStatusCounts = async (
  opts: CommonAuthParams & {
    locationIds: StringNumberIdType[];
    vehicleType: string | number;
    clientDate: Date;
  }
) => {
  return await callV3Api(
    makeUrl(`/v3/statistics/vehiclestatuscounts`, {
      clientId: opts.clientId,
      userId: opts.userId,
      clientDate: localDateToQueryYearMonthDay(opts.clientDate),
      ...(opts.locationIds &&
      !opts.locationIds.includes(0) &&
      !opts.locationIds.includes("0")
        ? {
            ...(opts.locationIds.length === 1
              ? { locationId: opts.locationIds[0] }
              : { multipleLocation: opts.locationIds }),
          }
        : {}),
      ...(opts.vehicleType && opts.vehicleType !== 0 && opts.vehicleType !== "0"
        ? { vehicleType: opts.vehicleType }
        : {}),
    }),
    {
      headers: {
        Authorization: `Bearer ${opts.accessToken}`,
      },
    }
  ).then((res) => VehicleStatusCountListSchema.parse(res.data));
};
