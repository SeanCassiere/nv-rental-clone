import { queryOptions } from "@tanstack/react-query";

import { mutateColumnAccessors } from "@/utils/columns";

import { apiClient } from "@/api";

import { isEnabled, rootKey, type Auth, type RefId } from "./helpers";

const SEGMENT = "reservations";

export function fetchReservationsSearchColumnsOptions(options: Auth) {
  return queryOptions({
    queryKey: [rootKey(options), SEGMENT, "columns"],
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

export function fetchNotesForReservationById(
  options: { reservationId: RefId } & Auth
) {
  return queryOptions({
    queryKey: [rootKey(options), SEGMENT, options.reservationId, "notes"],
    queryFn: () =>
      apiClient.note.getListForRefId({
        params: {
          referenceType: "reservation",
          referenceId: String(options.reservationId),
        },
        query: {
          clientId: options.auth.clientId,
        },
      }),
    enabled: isEnabled(options),
  });
}
