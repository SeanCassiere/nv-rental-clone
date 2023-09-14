import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { dashboardQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export function useGetDashboardWidgetList() {
  const auth = useAuth();

  const query = useQuery({
    queryKey: dashboardQKeys.widgets(),
    queryFn: () =>
      apiClient.dashboard.getWidgets({
        query: {
          clientId: auth.user?.profile?.navotar_clientid || "",
          userId: auth.user?.profile?.navotar_userid || "",
        },
      }),
    enabled: auth.isAuthenticated,
  });
  return query;
}
