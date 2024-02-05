import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";

import { isEnabled, makeQueryKey, type Auth, type RefId } from "./helpers";

const SEGMENT = "role";

type RoleId = { roleId: RefId };

export function fetchRolesListOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "list"]),
    queryFn: () =>
      apiClient.role
        .getList({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    staleTime: 1000 * 60 * 1, // 1 minute,
    enabled: isEnabled(options),
  });
}

export function fetchRoleByIdOptions(
  options: { enabled?: boolean } & RoleId & Auth
) {
  const { enabled = true } = options;
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, String(options.roleId)]),
    queryFn: () =>
      apiClient.role
        .getById({
          params: { roleId: String(options.roleId) },
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: isEnabled(options) && enabled,
  });
}

export function fetchRolePermissionsListOptions(options: Auth) {
  return queryOptions({
    queryKey: makeQueryKey(options, [SEGMENT, "permissions"]),
    queryFn: () =>
      apiClient.role
        .getPermissions({
          query: {
            clientId: options.auth.clientId,
            userId: options.auth.userId,
          },
        })
        .then((res) => ({ ...res, headers: null })),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: isEnabled(options),
  });
}
