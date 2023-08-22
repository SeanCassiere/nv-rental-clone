import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fleetQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetVehicleFuelLevelList() {
  const auth = useAuth();
  const query = useQuery({
    queryKey: fleetQKeys.fuelLevels(),
    queryFn: () =>
      apiClient
        .getVehicleFuelLevels({
          query: {
            clientId: auth.user?.profile.navotar_clientid || "",
            userId: auth.user?.profile.navotar_userid || "",
          },
        })
        .then((res) => (res.status === 200 ? res.body : [])),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
  return query;
}
