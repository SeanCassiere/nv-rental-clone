import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { DashboardSearchQuerySchema } from "@/schemas/dashboard";

import { getAuthFromRouterContext, getAuthToken } from "@/utils/auth";
import { dashboardQKeys, locationQKeys } from "@/utils/query-key";
import { fetchDashboardMessagesOptions } from "@/utils/query/dashboard";

import { rootRoute } from "./__root";

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (search) => DashboardSearchQuerySchema.parse(search),
  beforeLoad: ({ context }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      dashboardMessagesOptions: fetchDashboardMessagesOptions({ auth }),
    };
  },
  loader: async ({ context }) => {
    const { queryClient, apiClient, dashboardMessagesOptions } = context;
    const promises = [];

    // get messages
    promises.push(queryClient.ensureQueryData(dashboardMessagesOptions));

    const auth = getAuthToken();
    if (auth) {
      // get widgets
      const widgetsKey = dashboardQKeys.widgets();
      promises.push(
        queryClient.ensureQueryData({
          queryKey: widgetsKey,
          queryFn: () =>
            apiClient.dashboard.getWidgets({
              query: {
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
              },
            }),
        })
      );

      // get locations
      const locationsKey = locationQKeys.all({ withActive: true });
      promises.push(
        queryClient.ensureQueryData({
          queryKey: locationsKey,
          queryFn: async () =>
            apiClient.location.getList({
              query: {
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                withActive: true,
              },
            }),
        })
      );
    }

    await Promise.all(promises);
    return;
  },
  component: lazyRouteComponent(() => import("@/pages/dashboard")),
});
