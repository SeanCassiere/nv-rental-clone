import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { clientQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetClientProfile() {
  const auth = useAuth();

  const query = useQuery({
    queryKey: clientQKeys.profile(),
    queryFn: () =>
      apiClient.client.getProfile({
        params: { clientId: auth.user?.profile.navotar_clientid || "" },
      }),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 30, // 30 secs before the data is considered to be stale
  });
  return query;
}
