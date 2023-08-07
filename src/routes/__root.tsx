import { Suspense } from "react";
import { Outlet, RouterContext } from "@tanstack/router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { HeaderLayout } from "@/components/header/header-layout";
import LoadingPlaceholder from "@/components/loading-placeholder";

import { queryClient } from "@/tanstack-query-config";

import {
  fetchClientProfile,
  fetchClientFeatures,
  fetchClientScreenSettings,
} from "@/api/clients";
import { fetchUserPermissions } from "@/api/users";

import { getAuthToken } from "@/utils/authLocal";
import { clientQKeys, userQKeys } from "@/utils/query-key";
import { UI_APPLICATION_SHOW_ROUTER_DEVTOOLS } from "@/utils/constants";

interface MyRouterContext {
  queryClient: typeof queryClient;
}

const routerContext = new RouterContext<MyRouterContext>();

export const rootRoute = routerContext.createRootRoute({
  loader: async () => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];

      promises.push(
        queryClient.ensureQueryData({
          queryKey: clientQKeys.profile(),
          queryFn: async () =>
            await fetchClientProfile({
              clientId: auth.profile.navotar_clientid,
              userId: auth.profile.navotar_userid,
              accessToken: auth.access_token,
            }),
          staleTime: 1000 * 30, // 30 seconds
        })
      );

      promises.push(
        queryClient.ensureQueryData({
          queryKey: clientQKeys.features(),
          queryFn: async () =>
            fetchClientFeatures({
              clientId: auth.profile.navotar_clientid,
              accessToken: auth.access_token,
            }),
          staleTime: 1000 * 60 * 5, // 5 minutes
        })
      );

      promises.push(
        queryClient.ensureQueryData({
          queryKey: clientQKeys.screenSettings(),
          queryFn: async () =>
            fetchClientScreenSettings({
              clientId: auth.profile.navotar_clientid,
              accessToken: auth.access_token,
            }),
          staleTime: 1000 * 60 * 5, // 5 minutes
        })
      );

      promises.push(
        queryClient.ensureQueryData({
          queryKey: userQKeys.permissions(auth.profile.navotar_userid),
          queryFn: async () =>
            fetchUserPermissions({
              clientId: auth.profile.navotar_clientid,
              accessToken: auth.access_token,
              intendedUserId: auth.profile.navotar_userid,
            }),
          staleTime: 1000 * 60 * 5, // 5 minutes
        })
      );

      await Promise.all(promises);
    }

    return {};
  },
  component: () => {
    return (
      <HeaderLayout>
        <Suspense fallback={<LoadingPlaceholder />}>
          <Outlet />
        </Suspense>
        {UI_APPLICATION_SHOW_ROUTER_DEVTOOLS === true && (
          <TanStackRouterDevtools position="bottom-right" />
        )}
      </HeaderLayout>
    );
  },
});
