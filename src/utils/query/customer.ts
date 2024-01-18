import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { mutateColumnAccessors } from "@/utils/columns";

import { apiClient } from "@/api";

import { sortObjectKeys } from "../sort";
import {
  isEnabled,
  rootKey,
  type Auth,
  type Pagination,
  type RefId,
} from "./helpers";

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
    queryKey: [
      rootKey(options),
      SEGMENT,
      "list",
      sortObjectKeys(options.pagination),
      sortObjectKeys(options.filters),
    ],
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

export function fetchSummaryForCustomerByIdOptions() {}

export function fetchNotesForCustomerByIdOptions(
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

export function fetchCustomerByIdOptions(
  options: { customerId: RefId } & Auth
) {
  return queryOptions({
    queryKey: [rootKey(options), SEGMENT, options.customerId],
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
