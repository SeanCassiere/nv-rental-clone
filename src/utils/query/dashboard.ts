import { queryOptions } from "@tanstack/react-query";

import { getDashboardMessagesAndFilter } from "@/api/get-dashboard-messages";

import { isEnabled, makeQueryKey, type Auth } from "./helpers";

const SEGMENT = "dashboard";

export function fetchDashboardMessagesOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "messages"]),
    queryFn: () => getDashboardMessagesAndFilter(options),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}
