import { queryOptions } from "@tanstack/react-query";

import { mutateColumnAccessors } from "@/utils/columns";

import { apiClient } from "@/api";

import { isEnabled, rootKey, type Auth } from "./helpers";

export function fetchFleetSearchColumnsOptions(options: Auth) {
  return queryOptions({
    queryKey: [rootKey(options), "fleet", "columns"],
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
