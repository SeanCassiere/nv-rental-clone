import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import {
  fetchVehicleTypesList,
  type VehicleTypesListExtraOpts,
} from "@/api/vehicleTypes";
import { vehicleTypeQKeys } from "@/utils/query-key";

export function useGetVehicleTypesList(params?: VehicleTypesListExtraOpts) {
  const otherSearch: VehicleTypesListExtraOpts = {
    ...(params?.StartDate ? { StartDate: params.StartDate } : {}),
    ...(params?.EndDate ? { EndDate: params.EndDate } : {}),
    ...(typeof params?.LocationID !== "undefined"
      ? { LocationID: params.LocationID }
      : {}),
    ...(params
      ? {
          BaseRate: 0,
          VehicleTypeId: 0,
        }
      : {}),
  };

  const auth = useAuth();
  const query = useQuery({
    queryKey: vehicleTypeQKeys.all(),
    queryFn: async () =>
      await fetchVehicleTypesList({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        ...otherSearch,
      }),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
  return query;
}
