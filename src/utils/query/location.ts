import { queryOptions } from "@tanstack/react-query";

import { sortObjectKeys } from "@/utils/sort";

import { apiClient } from "@/api";

import { isEnabled, makeQueryKey, type Auth } from "./helpers";

const SEGMENT = "locations";

/**
 *
 * @api `/locations`
 */
export function fetchLocationsListOptions(
  options: {
    filters: Omit<
      Parameters<(typeof apiClient)["location"]["getList"]>[0]["query"],
      "clientId" | "userId"
    >;
    enabled?: boolean;
  } & Auth
) {
  const { enabled = true } = options;
  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      "list",
      sortObjectKeys(options.filters),
    ]),
    queryFn: () =>
      apiClient.location
        .getList({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
            ...options.filters,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options) && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
