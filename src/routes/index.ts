import { lazy, Route } from "@tanstack/router";

import { rootRoute } from "./__root";
import { queryClient as qc } from "../App";
import { fetchDashboardWidgetList } from "@/api/dashboard";
import { fetchDashboardNoticeListModded } from "@/hooks/network/dashboard/useGetDashboardNoticeList";
import { getAuthToken } from "@/utils/authLocal";
import { dashboardQKeys } from "@/utils/query-key";
import { DashboardSearchQuerySchema } from "@/schemas/dashboard";

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (search) => DashboardSearchQuerySchema.parse(search),
  loader: async () => {
    const auth = getAuthToken();
    if (auth) {
      const promises = [];

      // get notices
      const noticesKey = dashboardQKeys.notices();
      if (!qc.getQueryData(noticesKey)) {
        promises.push(
          qc.prefetchQuery({
            queryKey: noticesKey,
            queryFn: async () =>
              await fetchDashboardNoticeListModded({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
              }),
            initialData: [],
          })
        );
      }

      // get widgets
      const widgetsKey = dashboardQKeys.widgets();

      if (!qc.getQueryData(widgetsKey)) {
        promises.push(
          qc.prefetchQuery({
            queryKey: widgetsKey,
            queryFn: async () =>
              await fetchDashboardWidgetList({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
              }),
            initialData: [],
          })
        );
      }

      await Promise.all(promises);
    }
    return {};
  },
  component: lazy(() => import("../pages/Index/IndexPage")),
});
