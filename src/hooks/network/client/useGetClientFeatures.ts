import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchClientFeatures } from "@/api/clients";
import { clientQKeys } from "@/utils/query-key";

export function useGetClientFeatures() {
  const auth = useAuth();

  const query = useQuery({
    queryKey: clientQKeys.features(),
    queryFn: async () => {
      return await fetchClientFeatures({
        clientId: auth.user?.profile.navotar_clientid || "",
        accessToken: auth.user?.access_token || "",
      });
    },
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 mins before the data is considered to be stale
  });
  return query;
}
