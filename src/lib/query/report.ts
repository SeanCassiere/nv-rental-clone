import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "@/api";

import { isEnabled, makeQueryKey, type Auth } from "./helpers";

const SEGMENT = "reports";

export function fetchReportsListOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "search"]),
    queryFn: () =>
      apiClient.report
        .getList({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: isEnabled(options),
  });
}

export function fetchReportByIdOptions(options: { reportId: string } & Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, options.reportId]),
    queryFn: () =>
      apiClient.report
        .getById({
          params: { reportId: options.reportId },
          query: options.auth,
        })
        .then((res) => ({ ...res, headers: null })),
    staleTime: 1000 * 60 * 1, // 1 minutes
    enabled: isEnabled(options),
  });
}
