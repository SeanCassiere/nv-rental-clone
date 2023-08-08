import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { apiClient } from "@/api";

import { dashboardQKeys } from "@/utils/query-key";
import { localDateToQueryYearMonthDay } from "@/utils/date";

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
      apiClient
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
    keepPreviousData: true,
  });
  return query;
}
