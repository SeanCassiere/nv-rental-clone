import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { fetchDashboardMessagesListModded } from "@/hooks/network/dashboard/useGetDashboardMessages";
import { fetchDashboardWidgetList } from "@/api/dashboard";

import { DashboardSearchQuerySchema } from "@/schemas/dashboard";

import { getAuthToken } from "@/utils/authLocal";
import { dashboardQKeys, locationQKeys } from "@/utils/query-key";

import { rootRoute } from "./__root";

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (search) => DashboardSearchQuerySchema.parse(search),
  loader: async ({ context: { queryClient, apiClient } }) => {
    const auth = getAuthToken();
    if (auth) {
      const promises = [];
      // get messages
      const messagesKey = dashboardQKeys.messages();
      promises.push(
        queryClient.ensureQueryData({
          queryKey: messagesKey,
          queryFn: () =>
            fetchDashboardMessagesListModded(
              {
                query: {
                  clientId: auth.profile.navotar_clientid,
                },
              },
              {
                userId: auth.profile.navotar_userid,
              }
            ),
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
            apiClient.location.getList({
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
