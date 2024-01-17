import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "@/api";

import { isEnabled, rootKey, type Auth, type RefId } from "./helpers";

const SEGMENT = "role";

export function fetchRolesListOptions(options: Auth) {
  return queryOptions({
    queryKey: [rootKey(options), SEGMENT, "all"],
    queryFn: () =>
      apiClient.role.getList({
        query: {
          clientId: options.auth.clientId,
          userId: options.auth.userId,
        },
      }),
    staleTime: 1000 * 60 * 1, // 1 minute,
    enabled: isEnabled(options),
  });
}

export function fetchRoleByIdOptions(options: { roleId: RefId } & Auth) {
  return queryOptions({
    queryKey: [rootKey(options), SEGMENT, options.roleId],
    queryFn: () =>
      apiClient.role.getById({
        params: { roleId: String(options.roleId) },
        query: {
          clientId: options.auth.clientId,
          userId: options.auth.userId,
        },
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: isEnabled(options),
  });
}

export function fetchRolePermissionsListOptions(options: Auth) {
  return queryOptions({
    queryKey: [rootKey(options), SEGMENT, "permissions"],
    queryFn: () =>
      apiClient.role.getPermissions({
        query: {
          clientId: options.auth.clientId,
          userId: options.auth.userId,
        },
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: isEnabled(options),
  });
}
