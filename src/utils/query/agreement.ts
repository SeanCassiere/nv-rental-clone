import { queryOptions } from "@tanstack/react-query";

import {
  makeInitialColumnAccessors,
  mutateColumnAccessors,
} from "@/utils/columns";

import { apiClient } from "@/api";

import { isEnabled, rootKey, type Auth } from "./helpers";

export function fetchAgreementsSearchColumnsOptions(options: Auth) {
  return queryOptions({
    queryKey: [rootKey(options), "agreements", "columns"],
    queryFn: () =>
      apiClient.client
        .getColumnHeaderInfo({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
            module: "agreement",
          },
        })
        .then((data) =>
          mutateColumnAccessors("agreement", {
            ...data,
            body: data.status === 200 ? data.body : [],
          })
        ),
    enabled: isEnabled(options),
    initialData: {
      status: 200,
      body: makeInitialColumnAccessors("agreements"),
      headers: new Headers(),
    },
  });
}
