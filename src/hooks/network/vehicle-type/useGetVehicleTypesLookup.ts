import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchVehicleTypesLookupList } from "@/api/vehicles";
import { vehicleTypeQKeys } from "@/utils/query-key";

export function useGetVehicleTypesLookupList() {
  const auth = useAuth();
  const query = useQuery({
    queryKey: vehicleTypeQKeys.lookup(),
    queryFn: async () =>
      await fetchVehicleTypesLookupList({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1, // 5 minute
  });
  return query;
}
