import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import type { TClientProfileSchema } from "../../../utils/schemas/client";
import { fetchClientProfile } from "../../../api/clients";

export function useGetClientProfile() {
  const auth = useAuth();

  const query = useQuery<TClientProfileSchema>({
    queryKey: ["client", "profile"],
    queryFn: async () => {
      return await fetchClientProfile({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      });
    },
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 15, // 15 minutes before the data is considered to be stale
  });
  return query;
}
