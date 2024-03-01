import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { getDashboardMessagesAndFilter } from "@/lib/api/get-dashboard-messages";
import { saveDashboardWidgets } from "@/lib/api/save-dashboard-widgets";

import { localDateToQueryYearMonthDay } from "@/lib/utils/date";

import { apiClient } from "@/lib/api";

import { isEnabled, makeQueryKey, type Auth } from "./helpers";

const SEGMENT = "dashboard";

export function fetchDashboardMessagesOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "messages"]),
    queryFn: () =>
      getDashboardMessagesAndFilter(options).then((res) => ({
        data: res,
        headers: null,
      })),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

export function fetchDashboardWidgetsOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "widgets"]),
    queryFn: () =>
      apiClient.dashboard
        .getWidgets({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 1,
  });
}

export function fetchDashboardSalesStatisticsOptions(
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
      "statistics_sales",
      `locations_{${options.filters.locationIds.sort().join("|")}}`,
    ]),
    queryFn: () =>
      apiClient.dashboard
        .getStatisticsForSales({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
            ClientDate: localDateToQueryYearMonthDay(
              options.filters.clientDate
            ),
            ...(options.filters.locationIds.length === 0
              ? {
                  LocationId: "0",
                }
              : {
                  MultipleLocation: options.filters.locationIds,
                }),
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 1, // 1 minute
    placeholderData: keepPreviousData,
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
      "statistics_rentals",
      `locations_{${options.filters.locationIds.sort().join("|")}}`,
    ]),
    queryFn: () =>
      apiClient.dashboard
        .getStatisticsForRentals({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
            ClientDate: localDateToQueryYearMonthDay(
              options.filters.clientDate
            ),
            ...(options.filters.locationIds.length === 0
              ? {
                  LocationId: "0",
                }
              : {
                  MultipleLocation: options.filters.locationIds,
                }),
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 1, // 1 minute
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
      "statistics_vehicle_status_counts",
      `locations_{${options.filters.locationIds.sort().join("|")}}`,
      `vehicle_type_{${options.filters.vehicleTypeId}}`,
    ]),
    queryFn: () =>
      apiClient.dashboard
        .getStatisticsForVehiclesStatuses({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
            ClientDate: localDateToQueryYearMonthDay(
              options.filters.clientDate
            ),
            VehicleType: options.filters.vehicleTypeId,
            ...(options.filters.locationIds.length === 0
              ? {
                  LocationId: "0",
                }
              : {
                  MultipleLocation: options.filters.locationIds,
                }),
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 1, // 1 minute
    placeholderData: keepPreviousData,
  });
}

export function saveDashboardWidgetsMutationOptions() {
  return {
    mutationKey: [SEGMENT, "save_dashboard_widgets"],
    mutationFn: saveDashboardWidgets,
  } as const;
}
