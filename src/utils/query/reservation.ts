import { queryOptions } from "@tanstack/react-query";

import { mutateColumnAccessors } from "@/utils/columns";

import { apiClient } from "@/api";

import { isEnabled, makeQueryKey, type Auth, type RefId } from "./helpers";

const SEGMENT = "reservations";

type ReservationId = { reservationId: RefId };

export function fetchReservationsSearchColumnsOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [, SEGMENT, "columns"]),
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

export function fetchReservationByIdOptions(options: ReservationId & Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, String(options.reservationId)]),
    queryFn: () =>
      apiClient.reservation.getById({
        query: {
          clientId: options.auth.clientId,
          userId: options.auth.userId,
        },
        params: {
          reservationId: String(options.reservationId),
        },
      }),
    enabled: isEnabled(options),
  });
}

export function fetchNotesForReservationByIdOptions(
  options: ReservationId & Auth
) {
  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      String(options.reservationId),
      "notes",
    ]),
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
