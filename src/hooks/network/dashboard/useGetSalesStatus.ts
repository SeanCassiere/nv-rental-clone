import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { localDateToQueryYearMonthDay } from "@/utils/date";
import { dashboardQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetSalesStatus({
  locations,
  clientDate,
}: {
  locations: string[];
  clientDate: Date;
}) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: dashboardQKeys.salesStatus({ locations }),
    queryFn: () =>
      apiClient.dashboard
        .getStatisticsForSales({
          query: {
            clientId: auth.user?.profile.navotar_clientid || "",
            userId: auth.user?.profile.navotar_userid || "",
            ClientDate: localDateToQueryYearMonthDay(clientDate),
            ...(locations.length === 0
              ? {
                  LocationId: "0",
                }
              : {
                  MultipleLocation: locations,
                }),
          },
        })
        .then((res) => (res.status === 200 ? res.body : [])),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1,
    placeholderData: (prev) => prev,
  });
  return query;
}
