import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchVehicleTypesList } from "../../../api/vehicleTypes";
import { vehicleTypeQKeys } from "../../../utils/query-key";

export function useGetVehicleTypesList() {
  const auth = useAuth();
  const query = useQuery({
    queryKey: vehicleTypeQKeys.all(),
    queryFn: async () =>
      await fetchVehicleTypesList({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }),
    enabled: auth.isAuthenticated,
    initialData: [],
  });
  return query;
}
