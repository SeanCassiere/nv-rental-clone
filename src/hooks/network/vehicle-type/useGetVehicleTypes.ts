import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import {
  fetchVehicleTypesList,
  type VehicleTypesListExtraOpts,
} from "@/api/vehicleTypes";
import { vehicleTypeQKeys } from "@/utils/query-key";

export function useGetVehicleTypesList(
  params?: { search?: VehicleTypesListExtraOpts } & Pick<
    UseQueryOptions,
    "suspense"
  >
) {
  const searchParams = params?.search || {};

  const otherSearch: VehicleTypesListExtraOpts = {
    ...(searchParams.StartDate ? { StartDate: searchParams.StartDate } : {}),
    ...(searchParams.EndDate ? { EndDate: searchParams.EndDate } : {}),
    ...(typeof searchParams.LocationID !== "undefined"
      ? { LocationID: searchParams.LocationID }
      : {}),
    ...(params?.search
      ? {
          BaseRate: 0,
          VehicleTypeId: 0,
        }
      : {}),
  };

  const queryOptions = {
    suspense: params?.suspense,
  };

  const auth = useAuth();
  const query = useQuery({
    queryKey: vehicleTypeQKeys.all(searchParams),
    queryFn: async () =>
      await fetchVehicleTypesList({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        ...otherSearch,
      }),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1, // 1 minute
    ...queryOptions,
  });
  return query;
}
