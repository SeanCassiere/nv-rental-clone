import { queryOptions } from "@tanstack/react-query";

import { mutateColumnAccessors } from "@/utils/columns";
import { localDateTimeToQueryYearMonthDay } from "@/utils/date";

import { apiClient } from "@/api";

import { isEnabled, makeQueryKey, type Auth, type RefId } from "./helpers";

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
