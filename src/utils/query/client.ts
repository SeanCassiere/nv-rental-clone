import { queryOptions } from "@tanstack/react-query";

import { STORAGE_KEYS } from "@/utils/constants";

import { apiClient } from "@/api";

import { isEnabled, makeQueryKey, type Auth } from "./helpers";

const SEGMENT = "client";

export function fetchClientProfileOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "profile"]),
    queryFn: () =>
      apiClient.client
        .getProfile({
          params: { clientId: options.auth.clientId },
        })
        .then((res) => {
          if (res.status === 200) {
            const currency = res.body.currency || "USD";

            window.localStorage.setItem(STORAGE_KEYS.currency, currency);
          }
          return res;
        }),
    enabled: isEnabled(options),
    staleTime: 1000 * 30, // 30 secs before the data is considered to be stale
  });
}

export function fetchFeaturesForClientOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "features"]),
    queryFn: () =>
      apiClient.client.getFeatures({
        params: { clientId: options.auth.clientId },
        body: {},
      }),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 5, // 5 mins before the data is considered to be stale
  });
}

export function fetchScreenSettingsForClientOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "screen_settings"]),
    queryFn: () =>
      apiClient.client.getScreenSettings({
        params: { clientId: options.auth.clientId },
      }),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 5, // 5 mins before the data is considered to be stale
  });
}
