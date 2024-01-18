import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { mutateColumnAccessors } from "@/utils/columns";
import {
  localDateTimeToQueryYearMonthDay,
  localDateTimeWithoutSecondsToQueryYearMonthDay,
} from "@/utils/date";
import { sortObjectKeys } from "@/utils/sort";

import { apiClient } from "@/api";

import {
  isEnabled,
  makeQueryKey,
  type Auth,
  type Pagination,
  type RefId,
} from "./helpers";

const SEGMENT = "fleet";

type FleetId = { fleetId: RefId };

export function fetchFleetSearchColumnsOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "columns"]),
    queryFn: () =>
      apiClient.client
        .getColumnHeaderInfo({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
            module: "vehicle",
          },
        })
        .then((data) =>
          mutateColumnAccessors("vehicle", {
            ...data,
            body: data.status === 200 ? data.body : [],
          })
        ),
    enabled: isEnabled(options),
  });
}

export function fetchFleetSearchListOptions(
  options: {
    filters: Omit<
      Parameters<(typeof apiClient)["vehicle"]["getList"]>[0]["query"],
      "StartDate" | "EndDate" | "clientId" | "userId" | "page" | "pageSize"
    > & {
      StartDate?: Date;
      EndDate?: Date;
    };
    enabled?: boolean;
  } & Pagination &
    Auth
) {
  const { enabled = true } = options;
  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      "list",
      sortObjectKeys(options.pagination),
      sortObjectKeys(options.filters),
    ]),
    queryFn: () => fetchFleetSearchListFn(options),
    enabled: isEnabled(options) && enabled,
    placeholderData: keepPreviousData,
  });
}

export function fetchFleetSearchListFn(
  options: {
    filters: Omit<
      Parameters<(typeof apiClient)["vehicle"]["getList"]>[0]["query"],
      "StartDate" | "EndDate" | "clientId" | "userId" | "page" | "pageSize"
    > & {
      StartDate?: Date;
      EndDate?: Date;
    };
  } & Pagination &
    Auth
) {
  const { StartDate, EndDate, ...filters } = options.filters;

  return apiClient.vehicle.getList({
    query: {
      clientId: options.auth.clientId,
      userId: options.auth.userId,
      page: options.pagination.page || 1,
      pageSize: options.pagination.pageSize || 10,
      ...(StartDate
        ? {
            StartDate:
              localDateTimeWithoutSecondsToQueryYearMonthDay(StartDate),
          }
        : {}),
      ...(EndDate
        ? { EndDate: localDateTimeWithoutSecondsToQueryYearMonthDay(EndDate) }
        : {}),
      ...filters,
    },
  });
}

export function fetchFleetStatusesOptions(
  options: { enabled?: boolean } & Auth
) {
  const { enabled = true } = options;
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "statuses"]),
    queryFn: () =>
      apiClient.vehicle
        .getStatuses({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
          },
        })
        .then((res) => (res.status === 200 ? res.body : [])),
    enabled: isEnabled(options) && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function fetchFleetFuelLevelsOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "fuel_levels"]),
    queryFn: () =>
      apiClient.vehicle
        .getFuelLevels({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
          },
        })
        .then((res) => (res.status === 200 ? res.body : [])),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function fetchFleetByIdOptions(options: FleetId & Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, options.fleetId]),
    queryFn: () =>
      apiClient.vehicle.getById({
        params: {
          vehicleId: String(options.fleetId),
        },
        query: {
          clientId: options.auth.clientId,
          userId: options.auth.userId,
          clientTime: localDateTimeToQueryYearMonthDay(new Date()),
          getMakeDetails: "true",
        },
      }),
    enabled: isEnabled(options),
  });
}

export function fetchSummaryForFleetByIdOptions(options: FleetId & Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, options.fleetId, "summary"]),
    queryFn: () =>
      apiClient.vehicle.getSummaryForId({
        params: {
          vehicleId: String(options.fleetId),
        },
        query: {
          clientId: options.auth.clientId,
          userId: options.auth.userId,
          clientTime: localDateTimeToQueryYearMonthDay(new Date()),
        },
      }),
    enabled: isEnabled(options),
  });
}

export function fetchNotesForFleetByIdOptions(options: FleetId & Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, options.fleetId, "notes"]),
    queryFn: () =>
      apiClient.note.getListForRefId({
        params: {
          referenceType: "vehicle",
          referenceId: String(options.fleetId),
        },
        query: {
          clientId: options.auth.clientId,
        },
      }),
    enabled: isEnabled(options),
  });
}
