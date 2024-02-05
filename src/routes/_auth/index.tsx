import { createFileRoute } from "@tanstack/react-router";

import { DashboardSearchQuerySchema } from "@/lib/schemas/dashboard";
import {
  fetchDashboardMessagesOptions,
  fetchDashboardWidgetsOptions,
} from "@/lib/query/dashboard";
import { fetchLocationsListOptions } from "@/lib/query/location";

import { getAuthFromRouterContext } from "@/lib/utils/auth";

export const Route = createFileRoute("/_auth/")({
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

    if (!context.auth.isAuthenticated) return;

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
});
