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
    initialData: [
      {
        widgetID: "QuickLookup",
        widgetName: "Quick Lookup",
        widgetScale: 6,
        widgetPosition: 1,
        widgetMappingID: 0,
        widgetUserPosition: 1,
        isEditable: true,
        isDeleted: false,
      },
      {
        widgetID: "QuickCheckin",
        widgetName: "Quick Check Agreement",
        widgetScale: 6,
        widgetPosition: 2,
        widgetMappingID: 0,
        widgetUserPosition: 2,
        isEditable: true,
        isDeleted: false,
      },
    ] as DashboardWidgetItemParsed[],
  });
  return query;
}
