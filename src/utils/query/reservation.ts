import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { mutateColumnAccessors } from "@/utils/columns";
import { localDateToQueryYearMonthDay } from "@/utils/date";
import { sortObjectKeys } from "@/utils/sort";

import { apiClient } from "@/api";

import {
  isEnabled,
  makeQueryKey,
  type Auth,
  type Pagination,
  type RefId,
} from "./helpers";

const SEGMENT = "reservations";

type ReservationId = { reservationId: RefId };

/**
 *
 * @api `/clients/columnheaderinformation?module=reservation`
 */
export function fetchReservationsSearchColumnsOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "columns"]),
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

/**
 *
 * @api `/reservations`
 */
export function fetchReservationsSearchListOptions(
  options: {
    filters: Omit<
      Parameters<(typeof apiClient)["reservation"]["getList"]>[0]["query"],
      "clientId" | "userId" | "page" | "pageSize" | "clientDate"
    > & {
      clientDate: Date;
    };
    enabled?: boolean;
  } & Pagination &
    Auth
) {
  const { enabled = true } = options;
  const { clientDate, ...filters } = options.filters;
  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      "list",
      sortObjectKeys(options.pagination),
      sortObjectKeys(filters),
    ]),
    queryFn: () => fetchReservationsSearchListFn(options),
    enabled: isEnabled(options) && enabled,
    placeholderData: keepPreviousData,
  });
}

export function fetchReservationsSearchListFn(
  options: {
    filters: Omit<
      Parameters<(typeof apiClient)["reservation"]["getList"]>[0]["query"],
      "clientId" | "userId" | "page" | "pageSize" | "clientDate"
    > & {
      clientDate: Date;
    };
  } & Pagination &
    Auth
) {
  const { clientDate, ...filters } = options.filters;

  return apiClient.reservation.getList({
    query: {
      clientId: options.auth.clientId,
      userId: options.auth.userId,
      page: options.pagination.page || 1,
      pageSize: options.pagination.pageSize || 10,
      clientDate: localDateToQueryYearMonthDay(clientDate),
      ...filters,
    },
  });
}

/**
 *
 * @api `/reservations/statuses`
 */
export function fetchReservationStatusesOptions(
  options: { enabled?: boolean } & Auth
) {
  const { enabled = true } = options;
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "statuses"]),
    queryFn: () =>
      apiClient.reservation
        .getStatuses({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
          },
        })
        .then((res) => (res.status === 200 ? res.body : [])),
    enabled: isEnabled(options) && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 *
 * @api `/reservations/types`
 */
export function fetchReservationTypesOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "types"]),
    queryFn: () =>
      apiClient.reservation
        .getTypes({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
          },
        })
        .then((res) => (res.status === 200 ? res.body : [])),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 *
 * @api `/reservations/$reservationId`
 */
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

/**
 *
 * @api `/reservations/$reservationId/summary`
 */
export function fetchReservationSummaryByIdOptions(
  options: ReservationId & Auth
) {
  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      options.reservationId,
      "summary",
    ]),
    queryFn: () =>
      apiClient.summary.getSummaryForReferenceId({
        params: {
          referenceType: "reservations",
          referenceId: String(options.reservationId),
        },
        query: {
          clientId: options.auth.clientId,
          userId: options.auth.userId,
        },
      }),
    enabled:
      isEnabled(options) &&
      Boolean(options.reservationId && options.reservationId !== "0"),
  });
}

/**
 *
 * @api `/reservation/$reservationId/note`
 */
export function fetchReservationNotesByIdOptions(
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
