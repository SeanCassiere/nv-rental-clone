import { FileRoute } from "@tanstack/react-router";

import { DashboardSearchQuerySchema } from "@/schemas/dashboard";

import { getAuthFromRouterContext } from "@/utils/auth";
import {
  fetchDashboardMessagesOptions,
  fetchDashboardWidgetsOptions,
} from "@/utils/query/dashboard";
import { fetchLocationsListOptions } from "@/utils/query/location";

export const Route = new FileRoute("/").createRoute({
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
});
