import { createQueryKeys } from "@lukemorales/query-key-factory";

import { apiClient } from "@/api";

type Auth = {
  userId: string;
  clientId: string;
};

export const rolesStore = createQueryKeys("roles", {
  all: (params: Auth) => ({
    queryKey: [params],
    queryFn: () =>
      apiClient.role.getList({
        query: { clientId: params.clientId, userId: params.userId },
      }),
    staleTime: 1000 * 60 * 1, // 1 minute
  }),
});
