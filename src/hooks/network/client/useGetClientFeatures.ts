import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { clientQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetClientFeatures() {
  const auth = useAuth();

  const query = useQuery({
    queryKey: clientQKeys.features(),
    queryFn: () =>
      apiClient.client.getFeatures({
        params: { clientId: auth.user?.profile?.navotar_clientid || "" },
        body: {},
      }),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 mins before the data is considered to be stale
  });
  return query;
}
