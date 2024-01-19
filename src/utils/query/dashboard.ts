import { queryOptions } from "@tanstack/react-query";

import { getDashboardMessagesAndFilter } from "@/api/get-dashboard-messages";

import { localDateToQueryYearMonthDay } from "@/utils/date";

import { apiClient } from "@/api";

import { isEnabled, makeQueryKey, type Auth } from "./helpers";

const SEGMENT = "dashboard";

export function fetchDashboardMessagesOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "messages"]),
    queryFn: () => getDashboardMessagesAndFilter(options),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

export function fetchDashboardRentalStatisticsOptions(
  options: {
    filters: {
      locationIds: string[];
      clientDate: Date;
    };
  } & Auth
) {
  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      "statistics",
      `locations-{${options.filters.locationIds.sort().join("|")}}`,
      localDateToQueryYearMonthDay(options.filters.clientDate),
    ]),
    queryFn: () =>
      apiClient.dashboard.getStatisticsForRentals({
        query: {
          clientId: options.auth.clientId,
          userId: options.auth.userId,
          ClientDate: localDateToQueryYearMonthDay(options.filters.clientDate),
          ...(options.filters.locationIds.length === 0
            ? {
                LocationId: "0",
              }
            : {
                MultipleLocation: options.filters.locationIds,
              }),
        },
      }),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 1, // 1 minutes
  });
}
