import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { vehicleTypeQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetVehicleTypesLookupList(opts?: { enabled?: boolean }) {
  const { enabled = true } = opts || {};
  const auth = useAuth();
  const query = useQuery({
    queryKey: vehicleTypeQKeys.lookup(),
    queryFn: () =>
      apiClient.vehicle
        .getTypesLookupList({
          query: {
            clientId: auth.user?.profile.navotar_clientid || "",
            userId: auth.user?.profile.navotar_userid || "",
          },
        })
        .then((res) => (res.status === 200 ? res.body : [])),
    enabled: auth.isAuthenticated && enabled,
    staleTime: 1000 * 60 * 1, // 5 minute
  });
  return query;
}
