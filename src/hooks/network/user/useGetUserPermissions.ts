import { useAuth } from "react-oidc-context";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { userQKeys } from "@/utils/query-key";
import { apiClient } from "@/api";

type UseGetUserPermissionsOptions = Pick<UseQueryOptions, "suspense">;

export function useGetUserPermissions(
  userId: string,
  useQueryOptions?: UseGetUserPermissionsOptions
) {
  const queryOptions = useQueryOptions || {};

  const auth = useAuth();
  const query = useQuery({
    queryKey: userQKeys.permissions(userId),
    queryFn: () =>
      apiClient.getUserPermissionByUserId({
        params: { userId },
        query: {
          clientId: auth.user?.profile.navotar_clientid || "",
        },
      }),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...queryOptions,
  });

  return query;
}
