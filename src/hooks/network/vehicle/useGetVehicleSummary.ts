import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { localDateTimeToQueryYearMonthDay } from "@/utils/date";
import { fleetQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetVehicleSummary(params: { vehicleId: string | number }) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: fleetQKeys.summary(params.vehicleId),
    queryFn: () =>
      apiClient.vehicle.getSummaryForId({
        params: {
          vehicleId: String(params.vehicleId),
        },
        query: {
          clientId: auth.user?.profile.navotar_clientid || "",
          userId: auth.user?.profile.navotar_userid || "",
          clientTime: localDateTimeToQueryYearMonthDay(new Date()),
        },
      }),
    enabled: auth.isAuthenticated,
  });
  return query;
}
