import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import { sortObjectKeys } from "@/lib/utils";

import { isEnabled, makeQueryKey, type Auth } from "./helpers";

const SEGMENT = "vehicle_types";

/**
 *
 * @api `/vehicleTypes`
 */
export function fetchVehicleTypesListOptions(
  options: {
    filters?: Omit<
      Parameters<(typeof apiClient)["vehicleType"]["getList"]>[0]["query"],
      "clientId" | "userId"
    >;
  } & Auth
) {
  const { filters = {} } = options;
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "list", sortObjectKeys(filters)]),
    queryFn: () =>
      apiClient.vehicleType
        .getList({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
            ...filters,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}
