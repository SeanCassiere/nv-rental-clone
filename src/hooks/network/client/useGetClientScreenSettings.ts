import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { clientQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetClientScreenSettings() {
  const auth = useAuth();

  const query = useQuery({
    queryKey: clientQKeys.screenSettings(),
    queryFn: () =>
      apiClient.getClientScreenSettings({
        params: { clientId: auth?.user?.profile?.navotar_clientid || "" },
      }),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 mins before the data is considered to be stale
  });
  return query;
}
