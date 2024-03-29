import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { mutateColumnAccessors } from "@/lib/utils/columns";
import { getXPaginationFromHeaders } from "@/lib/utils/headers";

import { apiClient } from "@/lib/api";
import { sortObjectKeys } from "@/lib/utils";

import {
  isEnabled,
  makeQueryKey,
  type Auth,
  type Pagination,
  type RefId,
} from "./helpers";

const SEGMENT = "agreements";

type AgreementId = { agreementId: RefId };

/**
 *
 * @api `/clients/columnheaderinformation?module=agreement`
 */
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
        )
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options),
  });
}

/**
 *
 * @api `/agreements`
 */
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

  return apiClient.agreement
    .getList({
      query: {
        clientId: options.auth.clientId,
        userId: options.auth.userId,
        page: options.pagination.page || 1,
        pageSize: options.pagination.pageSize || 10,
        currentDate: currentDate.toISOString(),
        ...filters,
      },
    })
    .then((res) => {
      const pagination = getXPaginationFromHeaders(
        res.status === 200 ? res.headers : null
      );
      return { ...res, headers: null, pagination };
    });
}

/**
 *
 * @api `/agreements/statuses`
 */
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

/**
 *
 * @api `/agreements/types`
 */
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

/**
 *
 * @api `/agreements/$agreementId`
 */
export function fetchAgreementByIdOptions(options: AgreementId & Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, options.agreementId]),
    queryFn: () =>
      apiClient.agreement
        .getById({
          params: {
            agreementId: String(options.agreementId),
          },
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled:
      isEnabled(options) &&
      Boolean(options.agreementId && options.agreementId !== "0"),
  });
}

/**
 *
 * @api `/agreements/$agreementId/summary`
 */
export function fetchAgreementSummaryByIdOptions(options: AgreementId & Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, options.agreementId, "summary"]),
    queryFn: () =>
      apiClient.summary
        .getSummaryForReferenceId({
          params: {
            referenceType: "agreements",
            referenceId: String(options.agreementId),
          },
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled:
      isEnabled(options) &&
      Boolean(options.agreementId && options.agreementId !== "0"),
  });
}

/**
 *
 * @api `/agreement/$agreementId/note`
 */
export function fetchAgreementNotesByIdOptions(options: AgreementId & Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, options.agreementId, "notes"]),
    queryFn: () =>
      apiClient.note
        .getListForRefId({
          params: {
            referenceType: "agreement",
            referenceId: String(options.agreementId),
          },
          query: {
            clientId: options.auth.clientId,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options),
  });
}

/**
 *
 * @api `/vehicleexchanges?agreementId=$agreementId`
 */
export function fetchAgreementExchangesByIdOptions(
  options: AgreementId & Auth
) {
  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      options.agreementId,
      "exchanges",
    ]),
    queryFn: () =>
      apiClient.vehicleExchange
        .getList({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
            agreementId: String(options.agreementId),
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options),
  });
}

/**
 *
 * @api `/agreements/generateagreementno`
 */
export function fetchAgreementGeneratedNumberOptions(
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
