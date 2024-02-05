import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "@/api";
import i18next, { i18nextChangeLanguage } from "@/i18next-config";

import { isEnabled, makeQueryKey, type Auth, type RefId } from "./helpers";

const SEGMENT = "users";

type UserId = { userId: RefId };

export function fetchUserByIdOptions(
  options: { enabled?: boolean } & UserId & Auth
) {
  const { enabled = true } = options;
  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      String(options.userId),
      "profile",
    ]),
    queryFn: () =>
      apiClient.user
        .getProfileByUserId({
          params: {
            userId: String(options.userId),
          },
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
            currentUserId: options.auth.userId,
          },
        })
        .then((res) => {
          // settings the user language with the fetch call
          if (
            res.status === 200 &&
            String(options.userId) === String(options.auth.userId)
          ) {
            const userLanguage = res.body.language;

            if (userLanguage && userLanguage !== i18next.language) {
              i18nextChangeLanguage(userLanguage);
            }
          }

          return res;
        })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options) && enabled,
    staleTime: 1000 * 60 * 1, // 1 minutes
  });
}

export function fetchLanguagesForUsersOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "languages"]),
    queryFn: () =>
      apiClient.user
        .getLanguages({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

export function fetchPermissionsByUserIdOptions(options: UserId & Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [
      SEGMENT,
      String(options.userId),
      "permissions",
    ]),
    queryFn: () =>
      apiClient.user
        .getPermissionForUserId({
          params: { userId: String(options.userId) },
          query: {
            clientId: options.auth.clientId,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function fetchUserConfigurationOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "user_configurations"]),
    queryFn: () =>
      apiClient.user
        .getUserConfigurations({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function fetchActiveUsersCountOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "active_users_count"]),
    queryFn: () =>
      apiClient.user
        .getActiveUsersCount({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

export function fetchMaximumUsersCountOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "maximum_users_count"]),
    queryFn: () =>
      apiClient.user
        .getMaximumUsersCount({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

export function updateUserMutationOptions(options: UserId) {
  return {
    mutationKey: [SEGMENT, "update_profile", String(options.userId)],
    mutationFn: apiClient.user.updateProfileByUserId,
  } as const;
}

export function createUserMutationOptions() {
  return {
    mutationKey: [SEGMENT, "create_profile"],
    mutationFn: apiClient.user.createUserProfile,
  } as const;
}
