import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchDashboardWidgetList } from "../../../api/dashboard";
import { dashboardQKeys } from "../../../utils/query-key";

export function useGetDashboardWidgetList(params?: {
  onSuccess?: (
    data: Awaited<ReturnType<typeof fetchDashboardWidgetList>>
  ) => void;
}) {
  const { onSuccess } = params || {};
  const auth = useAuth();

  const query = useQuery({
    queryKey: dashboardQKeys.widgets(),
    queryFn: async () => {
      return await fetchDashboardWidgetList({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      });
    },
    enabled: auth.isAuthenticated,
    initialData: [],
    onSuccess: (data) => {
      onSuccess?.(data);
    },
  });
  return query;
}
