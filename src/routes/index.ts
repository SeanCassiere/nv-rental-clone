import { Route, lazyRouteComponent } from "@tanstack/router";

import { rootRoute } from "./__root";

import { fetchDashboardMessagesListModded } from "@/hooks/network/dashboard/useGetDashboardMessages";
import { fetchDashboardWidgetList } from "@/api/dashboard";

import { getAuthToken } from "@/utils/authLocal";
import { dashboardQKeys, locationQKeys } from "@/utils/query-key";

import { DashboardSearchQuerySchema } from "@/schemas/dashboard";
import { apiClient } from "@/api";

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (search) => DashboardSearchQuerySchema.parse(search),
  loader: async ({ context: { queryClient } }) => {
    const auth = getAuthToken();
    if (auth) {
      const promises = [];
      // get messages
      const messagesKey = dashboardQKeys.messages();
      promises.push(
        queryClient.ensureQueryData({
          queryKey: messagesKey,
          queryFn: async () =>
            await fetchDashboardMessagesListModded({
              clientId: auth.profile.navotar_clientid,
              userId: auth.profile.navotar_userid,
              accessToken: auth.access_token,
            }),
          staleTime: 1000 * 60 * 1,
        })
      );

      // get widgets
      const widgetsKey = dashboardQKeys.widgets();
      promises.push(
        queryClient.ensureQueryData({
          queryKey: widgetsKey,
          queryFn: async () =>
            await fetchDashboardWidgetList({
              clientId: auth.profile.navotar_clientid,
              userId: auth.profile.navotar_userid,
              accessToken: auth.access_token,
            }),
        })
      );

      // get locations
      const locationsKey = locationQKeys.all();
      promises.push(
        queryClient.ensureQueryData({
          queryKey: locationsKey,
          queryFn: async () =>
            apiClient.getLocations({
              query: {
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                withActive: true,
              },
            }),
        })
      );

      await Promise.all(promises);
    }
    return {};
  },
}).update({
  component: lazyRouteComponent(() => import("@/pages/dashboard")),
});
