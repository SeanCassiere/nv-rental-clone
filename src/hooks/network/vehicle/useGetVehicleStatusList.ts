import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchVehicleStatusesList } from "@/api/vehicles";
import { fleetQKeys } from "@/utils/query-key";

export function useGetVehicleStatusList() {
  const auth = useAuth();
  const query = useQuery({
    queryKey: fleetQKeys.statuses(),
    queryFn: async () =>
      await fetchVehicleStatusesList({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1,
  });
  return query;
}
