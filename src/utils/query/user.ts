import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "@/api";
import i18next, { i18nextChangeLanguage } from "@/i18next-config";

import { isEnabled, makeQueryKey, type Auth, type RefId } from "./helpers";

const SEGMENT = "users";

type UserId = { userId: RefId };

export function fetchUserByIdOptions(
  options: { enabled?: boolean } & UserId & Auth
) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, options.userId, "profile"]),
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
        }),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 1, // 1 minutes
  });
}

export function fetchLanguagesForUsersOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "languages"]),
    queryFn: () =>
      apiClient.user.getLanguages({
        query: {
          clientId: options.auth.clientId,
          userId: options.auth.userId,
        },
      }),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

export function fetchPermissionsByUserIdOptions(options: UserId & Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, options.userId, "permissions"]),
    queryFn: () =>
      apiClient.user.getPermissionForUserId({
        params: { userId: String(options.userId) },
        query: {
          clientId: options.auth.clientId,
        },
      }),
    enabled: isEnabled(options),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function fetchUserConfigurationOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "user_configurations"]),
    queryFn: () =>
      apiClient.user.getUserConfigurations({
        query: { clientId: options.auth.clientId, userId: options.auth.userId },
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function fetchActiveUsersCountOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "active_users_count"]),
    queryFn: () =>
      apiClient.user.getActiveUsersCount({
        query: {
          clientId: options.auth.clientId,
          userId: options.auth.userId,
        },
      }),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

export function makeMaximumUsersCountKey(options: Auth) {
  return makeQueryKey(options, [SEGMENT, "maximum_users_count"]);
}
export function makeUpdatingUserKey(options: UserId & Auth) {
  return makeQueryKey(options, [SEGMENT, options.userId, "updating_profile"]);
}
