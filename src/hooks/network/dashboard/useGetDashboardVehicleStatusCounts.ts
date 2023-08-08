import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { apiClient } from "@/api";

import { dashboardQKeys } from "@/utils/query-key";
import { localDateToQueryYearMonthDay } from "@/utils/date";

export function useGetDashboardVehicleStatusCounts({
  locationIds,
  clientDate,
  vehicleType,
}: {
  locationIds: string[];
  clientDate: Date;
  vehicleType: string;
}) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: dashboardQKeys.vehicleStatusCounts({
      vehicleType,
      locationId: locationIds,
    }),
    queryFn: () =>
      apiClient
        .getStatisticsForVehiclesStatuses({
          query: {
            clientId: auth.user?.profile.navotar_clientid || "",
            userId: auth.user?.profile.navotar_userid || "",
            ClientDate: localDateToQueryYearMonthDay(clientDate),
            ...(locationIds.length === 0
              ? {
                  LocationId: "0",
                }
              : {
                  MultipleLocation: locationIds,
                }),
          },
        })
        .then((res) => (res.status === 200 ? res.body : null)),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1,
    keepPreviousData: true,
  });
  return query;
}
