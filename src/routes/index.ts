import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { DashboardSearchQuerySchema } from "@/schemas/dashboard";

import { getAuthFromRouterContext, getAuthToken } from "@/utils/auth";
import { dashboardQKeys } from "@/utils/query-key";
import { fetchDashboardMessagesOptions } from "@/utils/query/dashboard";
import { fetchLocationsListOptions } from "@/utils/query/location";

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
      activeLocationsOptions: fetchLocationsListOptions({
        auth,
        filters: { withActive: true },
      }),
    };
  },
  loader: async ({ context }) => {
    const {
      queryClient,
      apiClient,
      dashboardMessagesOptions,
      activeLocationsOptions,
    } = context;
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
    }

    // get locations
    promises.push(queryClient.ensureQueryData(activeLocationsOptions));

    await Promise.all(promises);
    return;
  },
  component: lazyRouteComponent(() => import("@/pages/dashboard")),
});
