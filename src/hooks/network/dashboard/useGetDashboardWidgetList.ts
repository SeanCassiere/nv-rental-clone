import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchDashboardWidgetList } from "../../../api/dashboard";
import type { DashboardWidgetItemParsed } from "../../../utils/schemas/dashboard";

export function useGetDashboardWidgetList() {
  const auth = useAuth();

  const query = useQuery<DashboardWidgetItemParsed[]>({
    queryKey: ["dashboard", "widgets"],
    queryFn: () =>
      fetchDashboardWidgetList({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }),
    enabled: auth.isAuthenticated,
    initialData: [],
  });
  return query;
}
