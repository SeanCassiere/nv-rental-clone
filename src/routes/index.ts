import { lazy, Route } from "@tanstack/router";

import { rootRoute } from "./__root";
import { queryClient } from "@/tanstack-query-config";

import { fetchDashboardWidgetList } from "@/api/dashboard";
import { fetchDashboardMessagesListModded } from "@/hooks/network/dashboard/useGetDashboardMessages";
import { fetchLocationsList } from "@/api/locations";

import { getAuthToken } from "@/utils/authLocal";
import { dashboardQKeys, locationQKeys } from "@/utils/query-key";

import { DashboardSearchQuerySchema } from "@/schemas/dashboard";

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (search) => DashboardSearchQuerySchema.parse(search),
  loader: async () => {
    const auth = getAuthToken();
    if (auth) {
      const promises = [];
      // get messages
      const messagesKey = dashboardQKeys.messages();
      if (!queryClient.getQueryData(messagesKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: messagesKey,
            queryFn: async () =>
              await fetchDashboardMessagesListModded({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
              }),
          })
        );
      }

      // get widgets
      const widgetsKey = dashboardQKeys.widgets();
      if (!queryClient.getQueryData(widgetsKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: widgetsKey,
            queryFn: async () =>
              await fetchDashboardWidgetList({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
              }),
          })
        );
      }

      // get locations
      const locationsKey = locationQKeys.all();
      if (!queryClient.getQueryData(locationsKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: locationsKey,
            queryFn: async () =>
              fetchLocationsList({
                clientId: auth.profile.navotar_clientid,
                userId: auth.profile.navotar_userid,
                accessToken: auth.access_token,
                withActive: true,
              }),
          })
        );
      }

      await Promise.all(promises);
    }
    return {};
  },
  component: lazy(() => import("@/pages/dashboard")),
});
