import { keepPreviousData, queryOptions } from "@tanstack/react-query";

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

export function fetchDashboardWidgetsOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "widgets"]),
    queryFn: () =>
      apiClient.dashboard.getWidgets({
        query: {
          clientId: options.auth.clientId,
          userId: options.auth.userId,
        },
      }),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 1,
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
      localDateToQueryYearMonthDay(options.filters.clientDate),
      "statistics",
      `locations_{${options.filters.locationIds.sort().join("|")}}`,
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
    placeholderData: keepPreviousData,
  });
}

export function fetchDashboardVehicleStatusCountsOptions(
  options: {
    filters: {
      locationIds: string[];
      clientDate: Date;
      vehicleTypeId: string;
    };
  } & Auth
) {
  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      localDateToQueryYearMonthDay(options.filters.clientDate),
      "sales_status_counts",
      `locations_{${options.filters.locationIds.sort().join("|")}}`,
      `vehicle_type_{${options.filters.vehicleTypeId}}`,
    ]),
    queryFn: () =>
      apiClient.dashboard.getStatisticsForVehiclesStatuses({
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
    placeholderData: keepPreviousData,
  });
}
