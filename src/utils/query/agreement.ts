import { queryOptions } from "@tanstack/react-query";

import { mutateColumnAccessors } from "@/utils/columns";

import { apiClient } from "@/api";

import { isEnabled, rootKey, type Auth, type RefId } from "./helpers";

const SEGMENT = "agreements";

export function fetchAgreementsSearchColumnsOptions(options: Auth) {
  return queryOptions({
    queryKey: [rootKey(options), SEGMENT, "columns"],
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

export function fetchAgreementStatusesOptions(
  options: { enabled?: boolean } & Auth
) {
  const { enabled = true } = options;
  return queryOptions({
    queryKey: [rootKey(options), SEGMENT, "statuses"],
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

export function fetchAgreementByIdOptions(
  options: { agreementId: RefId } & Auth
) {
  return queryOptions({
    queryKey: [rootKey(options), SEGMENT, options.agreementId],
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

export function fetchNotesForAgreementById(
  options: { agreementId: RefId } & Auth
) {
  return queryOptions({
    queryKey: [rootKey(options), SEGMENT, options.agreementId, "notes"],
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

export function fetchExchangesForAgreementById(
  options: { agreementId: RefId } & Auth
) {
  return queryOptions({
    queryKey: [rootKey(options), SEGMENT, options.agreementId, "exchanges"],
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
