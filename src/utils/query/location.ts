import { queryOptions } from "@tanstack/react-query";

import { sortObjectKeys } from "@/utils/sort";

import { apiClient } from "@/api";

import { isEnabled, makeQueryKey, type Auth, type Enabled } from "./helpers";

const SEGMENT = "locations";

type LocationId = { locationId: string };

/**
 *
 * @api `/locations`
 */
export function fetchLocationsListOptions(
  options: {
    filters: Omit<
      Parameters<(typeof apiClient)["location"]["getList"]>[0]["query"],
      "clientId" | "userId"
    >;
    enabled?: boolean;
  } & Auth
) {
  const { enabled = true } = options;
  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      "list",
      sortObjectKeys(options.filters),
    ]),
    queryFn: () =>
      apiClient.location
        .getList({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
            ...options.filters,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options) && enabled,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

/**
 * @api `/locations/countries`
 */
export function fetchLocationCountriesListOptions(options: Auth & Enabled) {
  const { enabled = true } = options;
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "countries"]),
    queryFn: () =>
      apiClient.location
        .getCountries({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options) && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * @api `/locations/countries/:countryId/states`
 */
export function fetchLocationStatesByCountryIdListOptions(
  options: { countryId: string } & Auth & Enabled
) {
  const { enabled = true } = options;
  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      "countries",
      options.countryId,
      "states",
    ]),
    queryFn: () =>
      apiClient.location
        .getStatesByCountryId({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
          },
          params: {
            countryId: options.countryId,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled:
      isEnabled(options) &&
      !!options.countryId &&
      options.countryId !== "0" &&
      enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * @api `/locations/:id`
 */
export function fetchLocationByIdOptions(options: LocationId & Auth & Enabled) {
  const { enabled = true } = options;
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, options.locationId]),
    queryFn: () =>
      apiClient.location
        .getById({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
          },
          params: {
            locationId: options.locationId,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled:
      isEnabled(options) &&
      !!options.locationId &&
      options.locationId !== "0" &&
      enabled,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

export function updateLocationMutationOptions(options: LocationId) {
  return {
    mutationKey: [SEGMENT, "update_location", options.locationId],
    mutationFn: apiClient.location.updateLocationById,
  } as const;
}

export function createLocationMutationOptions() {
  return {
    mutationKey: [SEGMENT, "create_location"],
    mutationFn: apiClient.location.createLocation,
  } as const;
}
