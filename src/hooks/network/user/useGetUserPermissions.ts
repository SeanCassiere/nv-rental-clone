import { useAuth } from "react-oidc-context";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { fetchUserPermissions } from "@/api/users";
import { userQKeys } from "@/utils/query-key";

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
      fetchUserPermissions({
        clientId: auth.user?.profile.navotar_clientid || "",
        accessToken: auth.user?.access_token || "",
        intendedUserId: userId,
      }),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...queryOptions,
  });

  return query;
}
