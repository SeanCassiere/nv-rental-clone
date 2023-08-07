import { useAuth } from "react-oidc-context";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { userQKeys } from "@/utils/query-key";
import { apiClient } from "@/api";

type UseGetUserLanguagesOptions = Pick<UseQueryOptions, "suspense">;

export function useGetUserLanguages(
  useQueryOptions?: UseGetUserLanguagesOptions
) {
  const queryOptions = useQueryOptions || {};

  const auth = useAuth();
  const query = useQuery({
    queryKey: userQKeys.languages(),
    queryFn: () =>
      apiClient.getUserLanguages({
        query: {
          clientId: auth.user?.profile.navotar_clientid || "",
          userId: auth.user?.profile.navotar_userid || "",
        },
      }),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1,
    ...queryOptions,
  });

  return query;
}
