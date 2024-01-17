import { queryOptions } from "@tanstack/react-query";

import { mutateColumnAccessors } from "@/utils/columns";

import { apiClient } from "@/api";

import { isEnabled, rootKey, type Auth, type RefId } from "./helpers";

const SEGMENT = "fleet";

export function fetchFleetSearchColumnsOptions(options: Auth) {
  return queryOptions({
    queryKey: [rootKey(options), SEGMENT, "columns"],
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

export function fetchNotesForFleetById(options: { fleetId: RefId } & Auth) {
  return queryOptions({
    queryKey: [rootKey(options), SEGMENT, options.fleetId, "notes"],
    queryFn: () =>
      apiClient.note.getListForRefId({
        params: {
          referenceType: "vehicle",
          referenceId: String(options.fleetId),
        },
        query: {
          clientId: options.auth.clientId,
        },
      }),
    enabled: isEnabled(options),
  });
}
