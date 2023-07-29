import { useAuth } from "react-oidc-context";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { fetchUserLanguages } from "@/api/users";
import { userQKeys } from "@/utils/query-key";

type UseGetUserLanguagesOptions = Pick<UseQueryOptions, "suspense">;

export function useGetUserLanguages(
  useQueryOptions?: UseGetUserLanguagesOptions
) {
  const queryOptions = useQueryOptions || {};

  const auth = useAuth();
  const query = useQuery({
    queryKey: userQKeys.languages(),
    queryFn: () =>
      fetchUserLanguages({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1,
    ...queryOptions,
  });

  return query;
}
