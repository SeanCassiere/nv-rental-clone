import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchVehicleStatusCounts } from "@/api/dashboard";
import { dashboardQKeys, type StringNumberIdType } from "@/utils/query-key";

export function useGetDashboardVehicleStatusCounts({
  locationIds,
  clientDate,
  vehicleType,
}: {
  locationIds: StringNumberIdType[];
  clientDate: Date;
  vehicleType: string | number;
}) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: dashboardQKeys.vehicleStatusCounts({
      vehicleType,
      locationId: locationIds,
    }),
    queryFn: async () => {
      return await fetchVehicleStatusCounts({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        locationIds,
        clientDate,
        vehicleType,
      });
    },
    enabled: auth.isAuthenticated,
    initialData: [],
  });
  return query;
}
