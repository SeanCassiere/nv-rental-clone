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

const SEGMENT = "vehicles";

type VehicleId = { vehicleId: RefId };

/**
 *
 * @api `/clients/columnheaderinformation?module=vehicle`
 */
export function fetchVehiclesSearchColumnsOptions(options: Auth) {
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

/**
 *
 * @api `/vehicles`
 */
export function fetchVehiclesSearchListOptions(
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
    queryFn: () => fetchVehiclesSearchListFn(options),
    enabled: isEnabled(options) && enabled,
    placeholderData: keepPreviousData,
  });
}

export function fetchVehiclesSearchListFn(
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

/**
 *
 * @api `/vehicles/statuses`
 */
export function fetchVehiclesStatusesOptions(
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

/**
 *
 * @api `/vehicles/types`
 */
export function fetchVehiclesTypesOptions(
  options: { enabled?: boolean } & Auth
) {
  const { enabled = true } = options;
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "types"]),
    queryFn: () =>
      apiClient.vehicle
        .getTypesLookupList({
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

/**
 *
 * @api `/vehicles/fuellevels`
 */
export function fetchVehiclesFuelLevelsOptions(options: Auth) {
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

/**
 *
 * @api `/vehicles/$vehicleId`
 */
export function fetchVehiclesByIdOptions(options: VehicleId & Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, options.vehicleId]),
    queryFn: () =>
      apiClient.vehicle.getById({
        params: {
          vehicleId: String(options.vehicleId),
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

/**
 *
 * @api `/vehicles/$vehicleId/summary`
 */
export function fetchVehiclesSummaryByIdOptions(options: VehicleId & Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, options.vehicleId, "summary"]),
    queryFn: () =>
      apiClient.vehicle.getSummaryForId({
        params: {
          vehicleId: String(options.vehicleId),
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

/**
 *
 * @api `/vehicle/$vehicleId/note`
 */
export function fetchVehiclesNotesByIdOptions(options: VehicleId & Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, options.vehicleId, "notes"]),
    queryFn: () =>
      apiClient.note.getListForRefId({
        params: {
          referenceType: "vehicle",
          referenceId: String(options.vehicleId),
        },
        query: {
          clientId: options.auth.clientId,
        },
      }),
    enabled: isEnabled(options),
  });
}
