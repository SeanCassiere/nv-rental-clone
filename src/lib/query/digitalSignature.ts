import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";

import { isEnabled, makeQueryKey } from "./helpers";
import type { Auth, Enabled } from "./helpers";

const SEGMENT = "digital_signature";

export function getDigSigDriversListOptions(
  options: {
    agreementId?: string;
    reservationId?: string;
  } & Auth &
    Enabled
) {
  const { enabled = true } = options;

  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      options.agreementId
        ? `agreement_${options.agreementId}`
        : `reservation_${options.reservationId}`,
      "drivers-list",
    ]),
    queryFn: async () =>
      apiClient.digitalSignature
        .getDriversList({
          query: {
            agreementId: options.agreementId,
            reservationId: options.reservationId,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options) && enabled,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

export function getAgreementCustomerDigSigUrlOptions(
  options: {
    agreementId: string;
    driverId: string | null;
    isCheckin: boolean;
    signatureImageUrl: string;
  } & Auth &
    Enabled
) {
  const { enabled = true } = options;

  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      `agreement_${options.agreementId}`,
      `driver_${options.driverId || "no-driver-id"}`,
      `checkin_${options.isCheckin}`,
      "url",
    ]),
    queryFn: async () =>
      apiClient.digitalSignature
        .getDigitalSignatureImageUrl({
          body: {
            agreementId: options.agreementId,
            isCheckin: options.isCheckin,
            signatureImageUrl: options.signatureImageUrl,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options) && enabled,
  });
}

export function getAgreementAdditionalDriverDigSigUrlOptions(
  options: {
    agreementId: string;
    additionalDriverId: string | null;
    isCheckin: boolean;
    signatureImageUrl: string;
  } & Auth &
    Enabled
) {
  const { enabled = true } = options;

  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      `agreement_${options.agreementId}`,
      `driver_${options.additionalDriverId || "no-driver-id"}`,
      `checkin_${options.isCheckin}`,
      "url",
    ]),
    queryFn: () =>
      apiClient.digitalSignature
        .getDigitalSignatureImageUrl({
          body: {
            agreementId: options.agreementId,
            signatureImageUrl: options.signatureImageUrl,
            additionalDriverId: options.additionalDriverId ?? undefined,
            isAdditional: true,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options) && enabled,
  });
}
