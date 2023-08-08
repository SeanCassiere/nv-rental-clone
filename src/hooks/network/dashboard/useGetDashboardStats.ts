import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { apiClient } from "@/api";

import { dashboardQKeys } from "@/utils/query-key";
import { localDateToQueryYearMonthDay } from "@/utils/date";

export function useGetDashboardStats({
  locationIds,
  clientDate,
}: {
  locationIds: string[];
  clientDate: Date;
}) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: dashboardQKeys.stats(clientDate, locationIds),
    queryFn: () =>
      apiClient
        .getStatisticsForRentals({
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
        .then((res) => {
          if (res.status === 200) {
            return res.body;
          }
          return null;
        }),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1,
  });
  return query;
}
