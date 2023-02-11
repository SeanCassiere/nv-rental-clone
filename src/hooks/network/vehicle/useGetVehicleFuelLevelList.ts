import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchVehicleFuelLevelsList } from "../../../api/vehicles";
import { fleetQKeys } from "../../../utils/query-key";

export function useGetVehicleFuelLevelList() {
  const auth = useAuth();
  const query = useQuery({
    queryKey: fleetQKeys.fuelLevels(),
    queryFn: async () =>
      await fetchVehicleFuelLevelsList({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }),
    enabled: auth.isAuthenticated,
    initialData: [],
  });
  return query;
}
