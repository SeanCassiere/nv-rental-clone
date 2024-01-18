import { queryOptions } from "@tanstack/react-query";

import { sortObjectKeys } from "@/utils/sort";

import { apiClient } from "@/api";

import { isEnabled, makeQueryKey, type Auth } from "./helpers";

const SEGMENT = "misc_charges";

/**
 *
 * @api `/locations`
 */
export function fetchMiscChargesListOptions(
  options: {
    filters: Omit<
      Parameters<(typeof apiClient)["miscCharge"]["getList"]>[0]["query"],
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
      apiClient.miscCharge.getList({
        query: {
          clientId: options.auth.clientId,
          userId: options.auth.userId,
          ...options.filters,
        },
      }),
    enabled: isEnabled(options) && enabled,
  });
}
