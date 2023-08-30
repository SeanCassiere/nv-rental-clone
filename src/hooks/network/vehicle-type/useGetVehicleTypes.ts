import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import type { VehicleTypesListExtraOpts } from "@/api/_vehicle-types.contract";

import { vehicleTypeQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

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
    ...(typeof searchParams.LocationId !== "undefined"
      ? { LocationID: searchParams.LocationId }
      : {}),
    ...(params?.search
      ? {
          BaseRate: "0",
          VehicleTypeId: "0",
        }
      : {}),
  };

  const queryOptions = {
    suspense: params?.suspense,
  };

  const auth = useAuth();
  const query = useQuery({
    queryKey: vehicleTypeQKeys.all(searchParams),
    queryFn: () =>
      apiClient.vehicleType.getList({
        query: {
          clientId: auth.user?.profile.navotar_clientid || "",
          userId: auth.user?.profile.navotar_userid || "",
          ...otherSearch,
        },
      }),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1, // 1 minute
    ...queryOptions,
  });
  return query;
}
