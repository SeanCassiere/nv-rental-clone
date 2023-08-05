import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchClientScreenSettings } from "@/api/clients";
import { clientQKeys } from "@/utils/query-key";

export function useGetClientScreenSettings() {
  const auth = useAuth();

  const query = useQuery({
    queryKey: clientQKeys.screenSettings(),
    queryFn: async () => {
      return await fetchClientScreenSettings({
        clientId: auth.user?.profile.navotar_clientid || "",
        accessToken: auth.user?.access_token || "",
      });
    },
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 mins before the data is considered to be stale
  });
  return query;
}
