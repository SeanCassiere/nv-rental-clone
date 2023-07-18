import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchDashboardStats } from "@/api/dashboard";
import { dashboardQKeys } from "@/utils/query-key";

export function useGetDashboardStats({
  locationIds,
  clientDate,
}: {
  locationIds: string[];
  clientDate: Date;
}) {
  const auth = useAuth();
  const query = useQuery({
    queryKey: dashboardQKeys.stats(),
    queryFn: async () => {
      return await fetchDashboardStats({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        locationId: locationIds,
        clientDate,
      });
    },
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1,
  });
  return query;
}
