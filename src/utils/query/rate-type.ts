import { queryOptions } from "@tanstack/react-query";

import { sortObjectKeys } from "@/utils/sort";

import { apiClient } from "@/api";

import { isEnabled, makeQueryKey, type Auth } from "./helpers";

const SEGMENT = "rate_types";

/**
 *
 * @api `/ratestypes`
 */
export function fetchRateTypesListOptions(
  options: {
    filters?: Omit<
      Parameters<(typeof apiClient)["rateType"]["getList"]>[0]["query"],
      "userId" | "clientId"
    >;
    enabled?: boolean;
  } & Auth
) {
  const { enabled = true } = options;

  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      "list",
      sortObjectKeys(options.filters ?? {}),
    ]),
    queryFn: () =>
      apiClient.rateType
        .getList({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
            ...options.filters,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options) && enabled,
  });
}
