import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import { sortObjectKeys } from "@/lib/utils";

import { isEnabled, makeQueryKey, type Auth } from "./helpers";

const SEGMENT = "taxes";

export function fetchTaxesListOptions(
  options: {
    enabled?: boolean;
    filters?: Omit<
      Parameters<(typeof apiClient)["tax"]["getList"]>[0]["query"],
      "userId" | "clientId"
    >;
  } & Auth
) {
  const { enabled = true, filters } = options;
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "list", sortObjectKeys(filters)]),
    queryFn: () =>
      apiClient.tax
        .getList({
          query: {
            userId: options.auth.userId,
            clientId: options.auth.clientId,
            LocationId: filters?.LocationId || "0",
            AgreementId: filters?.AgreementId,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options) && enabled,
  });
}
