import { queryOptions } from "@tanstack/react-query";

import { mutateColumnAccessors } from "@/utils/columns";

import { apiClient } from "@/api";

import { isEnabled, rootKey, type Auth } from "./helpers";

export function fetchReservationsSearchColumnsOptions(options: Auth) {
  return queryOptions({
    queryKey: [rootKey(options), "reservations", "columns"],
    queryFn: () =>
      apiClient.client
        .getColumnHeaderInfo({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
            module: "reservation",
          },
        })
        .then((data) =>
          mutateColumnAccessors("reservation", {
            ...data,
            body: data.status === 200 ? data.body : [],
          })
        ),
    enabled: isEnabled(options),
  });
}
