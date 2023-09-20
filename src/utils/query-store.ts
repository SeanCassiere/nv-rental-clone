import { createQueryKeys } from "@lukemorales/query-key-factory";

import { apiClient } from "@/api";

type Auth = {
  userId: string;
  clientId: string;
};

export const rolesStore = createQueryKeys("roles", {
  all: (params: Auth) => ({
    queryKey: [""],
    queryFn: () =>
      apiClient.role.getList({
        query: { clientId: params.clientId, userId: params.userId },
      }),
    staleTime: 1000 * 60 * 1, // 1 minute
  }),
  getById: ({ roleId, clientId, userId }: Auth & { roleId: string }) => ({
    queryKey: [roleId],
    queryFn: () =>
      apiClient.role.getById({
        params: { roleId },
        query: { clientId, userId },
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),
  permissionsList: (params: Auth) => ({
    queryKey: ["permissions"],
    queryFn: () =>
      apiClient.role.getPermissions({
        query: { clientId: params.clientId, userId: params.userId },
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),
});
