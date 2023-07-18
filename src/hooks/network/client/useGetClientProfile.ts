import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import type { TClientProfileSchema } from "@/schemas/client";
import { fetchClientProfile } from "@/api/clients";
import { clientQKeys } from "@/utils/query-key";

export function useGetClientProfile() {
  const auth = useAuth();

  const query = useQuery<TClientProfileSchema>({
    queryKey: clientQKeys.profile(),
    queryFn: async () => {
      return await fetchClientProfile({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      });
    },
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 30, // 30 secs before the data is considered to be stale
  });
  return query;
}
