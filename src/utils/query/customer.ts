import { queryOptions } from "@tanstack/react-query";

import { mutateColumnAccessors } from "@/utils/columns";

import { apiClient } from "@/api";

import { isEnabled, rootKey, type Auth, type RefId } from "./helpers";

const SEGMENT = "customers";

export function fetchCustomersSearchColumnsOptions(options: Auth) {
  return queryOptions({
    queryKey: [rootKey(options), SEGMENT, "columns"],
    queryFn: () =>
      apiClient.client
        .getColumnHeaderInfo({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
            module: "customer",
          },
        })
        .then((data) =>
          mutateColumnAccessors("customer", {
            ...data,
            body: data.status === 200 ? data.body : [],
          })
        ),
    enabled: isEnabled(options),
  });
}

export function fetchNotesForCustomerById(
  options: { customerId: RefId } & Auth
) {
  return queryOptions({
    queryKey: [rootKey(options), SEGMENT, options.customerId, "notes"],
    queryFn: () =>
      apiClient.note.getListForRefId({
        params: {
          referenceType: "customer",
          referenceId: String(options.customerId),
        },
        query: {
          clientId: options.auth.clientId,
        },
      }),
    enabled: isEnabled(options),
  });
}
