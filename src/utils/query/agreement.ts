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

const SEGMENT = "agreements";

type AgreementId = { agreementId: RefId };

export function fetchAgreementsSearchColumnsOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "columns"]),
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
  });
}

export function fetchAgreementsSearchListOptions(
  options: {
    filters: Omit<
      Parameters<(typeof apiClient)["agreement"]["getList"]>[0]["query"],
      "currentDate" | "clientId" | "userId" | "page" | "pageSize"
    > & {
      currentDate: Date;
    };
    enabled?: boolean;
  } & Pagination &
    Auth
) {
  const { enabled = true } = options;
  const { currentDate, ...filters } = options.filters;
  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      "list",
      sortObjectKeys(options.pagination),
      sortObjectKeys(filters),
    ]),
    queryFn: () => fetchAgreementsSearchListFn(options),
    enabled: isEnabled(options) && enabled,
    placeholderData: keepPreviousData,
  });
}

export function fetchAgreementsSearchListFn(
  options: {
    filters: Omit<
      Parameters<(typeof apiClient)["agreement"]["getList"]>[0]["query"],
      "currentDate" | "clientId" | "userId" | "page" | "pageSize"
    > & {
      currentDate: Date;
    };
  } & Pagination &
    Auth
) {
  const { currentDate, ...filters } = options.filters;

  return apiClient.agreement.getList({
    query: {
      clientId: options.auth.clientId,
      userId: options.auth.userId,
      page: options.pagination.page || 1,
      pageSize: options.pagination.pageSize || 10,
      currentDate: currentDate.toISOString(),
      ...filters,
    },
  });
}

export function fetchAgreementStatusesOptions(
  options: { enabled?: boolean } & Auth
) {
  const { enabled = true } = options;
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "statuses"]),
    queryFn: () =>
      apiClient.agreement
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

export function fetchAgreementTypesOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "types"]),
    queryFn: () =>
      apiClient.agreement
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

export function fetchAgreementByIdOptions(options: AgreementId & Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, options.agreementId]),
    queryFn: () =>
      apiClient.agreement.getById({
        params: {
          agreementId: String(options.agreementId),
        },
        query: {
          clientId: options.auth.clientId,
          userId: options.auth.userId,
        },
      }),
    enabled:
      isEnabled(options) &&
      Boolean(options.agreementId && options.agreementId !== "0"),
  });
}

export function fetchNotesForAgreementByIdOptions(options: AgreementId & Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, options.agreementId, "notes"]),
    queryFn: () =>
      apiClient.note.getListForRefId({
        params: {
          referenceType: "agreement",
          referenceId: String(options.agreementId),
        },
        query: {
          clientId: options.auth.clientId,
        },
      }),
    enabled: isEnabled(options),
  });
}

export function fetchExchangesForAgreementByIdOptions(
  options: AgreementId & Auth
) {
  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      options.agreementId,
      "exchanges",
    ]),
    queryFn: () =>
      apiClient.vehicleExchange.getList({
        query: {
          clientId: options.auth.clientId,
          userId: options.auth.userId,
          agreementId: String(options.agreementId),
        },
      }),
    enabled: isEnabled(options),
  });
}

export function fetchGenerateAgreementNumberOptions(
  options: { enabled: boolean; agreementType: string } & Auth
) {
  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      "generate_number",
      new Date().toISOString().slice(0, 16),
      options.agreementType,
    ]),
    queryFn: () =>
      apiClient.agreement
        .generateNewNumber({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
            agreementType: options.agreementType,
          },
        })
        .then((res) =>
          res.status === 200 ? res.body : { agreementNo: "NONE" }
        ),
    enabled: isEnabled(options) && options.enabled,
  });
}
