import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { DashboardSearchQuerySchema } from "@/schemas/dashboard";

import { getAuthFromRouterContext } from "@/utils/auth";
import {
  fetchDashboardMessagesOptions,
  fetchDashboardWidgetsOptions,
} from "@/utils/query/dashboard";
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
      dashboardWidgetsOptions: fetchDashboardWidgetsOptions({ auth }),
      activeLocationsOptions: fetchLocationsListOptions({
        auth,
        filters: { withActive: true },
      }),
    };
  },
  loader: async ({ context }) => {
    const {
      queryClient,
      dashboardMessagesOptions,
      dashboardWidgetsOptions,
      activeLocationsOptions,
    } = context;
    const promises = [];

    // get messages
    promises.push(queryClient.ensureQueryData(dashboardMessagesOptions));

    // get widgets
    promises.push(queryClient.ensureQueryData(dashboardWidgetsOptions));

    // get locations
    promises.push(queryClient.ensureQueryData(activeLocationsOptions));

    await Promise.all(promises);
    return;
  },
  component: lazyRouteComponent(() => import("@/pages/dashboard")),
});
