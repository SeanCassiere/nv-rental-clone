import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { mutateColumnAccessors } from "@/utils/columns";

import { apiClient } from "@/api";

import { sortObjectKeys } from "../sort";
import {
  isEnabled,
  makeQueryKey,
  type Auth,
  type Pagination,
  type RefId,
} from "./helpers";

const SEGMENT = "customers";

type CustomerId = { customerId: RefId };

export function fetchCustomersSearchColumnsOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "columns"]),
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

export function fetchCustomersSearchListOptions(
  options: {
    filters: Omit<
      Parameters<(typeof apiClient)["customer"]["getList"]>[0]["query"],
      "clientId" | "userId" | "page" | "pageSize"
    >;
    enabled?: boolean;
  } & Pagination &
    Auth
) {
  const { enabled = true } = options;
  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      "list",
      sortObjectKeys(options.pagination),
      sortObjectKeys(options.filters),
    ]),
    queryFn: () => fetchCustomersSearchListFn(options),
    enabled: isEnabled(options) && enabled,
    placeholderData: keepPreviousData,
  });
}

export function fetchCustomersSearchListFn(
  options: {
    filters: Omit<
      Parameters<(typeof apiClient)["customer"]["getList"]>[0]["query"],
      "clientId" | "userId" | "page" | "pageSize"
    >;
  } & Pagination &
    Auth
) {
  return apiClient.customer.getList({
    query: {
      clientId: options.auth.clientId,
      userId: options.auth.userId,
      page: options.pagination.page || 1,
      pageSize: options.pagination.pageSize || 10,
      ...options.filters,
    },
  });
}

export function fetchCustomerTypesOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "types"]),
    queryFn: () =>
      apiClient.customer
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

export function fetchCustomerSummaryByIdOptions(options: CustomerId & Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, options.customerId, "summary"]),
    queryFn: () =>
      apiClient.customer.getSummaryForId({
        params: {
          customerId: String(options.customerId),
        },
        query: {
          clientId: options.auth.clientId,
          userId: options.auth.userId,
        },
      }),
    enabled: isEnabled(options),
  });
}

export function fetchCustomerNotesByIdOptions(options: CustomerId & Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, options.customerId, "notes"]),
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

export function fetchCustomerByIdOptions(options: CustomerId & Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, options.customerId]),
    queryFn: () =>
      apiClient.customer.getById({
        params: {
          customerId: String(options.customerId),
        },
        query: {
          clientId: options.auth.clientId,
          userId: options.auth.userId,
        },
      }),
    enabled: isEnabled(options),
  });
}
