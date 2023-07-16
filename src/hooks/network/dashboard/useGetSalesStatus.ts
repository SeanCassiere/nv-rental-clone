import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchSalesStatus } from "@/api/dashboard";
import { dashboardQKeys } from "@/utils/query-key";

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
    queryFn: async () => {
      return await fetchSalesStatus({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        locations,
        clientDate,
      });
    },
    enabled: auth.isAuthenticated,
  });
  return query;
}
