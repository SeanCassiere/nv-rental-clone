import { Outlet, RouterContext } from "@tanstack/router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { HeaderLayout } from "@/components/header/header-layout";

import { queryClient } from "@/tanstack-query-config";

import { fetchClientFeatures } from "@/api/clients";
import { fetchUserPermissions } from "@/api/users";

import { getAuthToken } from "@/utils/authLocal";
import { clientQKeys, userQKeys } from "@/utils/query-key";
import { UI_APPLICATION_SHOW_ROUTER_DEVTOOLS } from "@/utils/constants";

const routerContext = new RouterContext();

export const rootRoute = routerContext.createRootRoute({
  loader: async () => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];

      const featuresKey = clientQKeys.features();
      if (!queryClient.getQueryData(featuresKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: featuresKey,
            queryFn: async () =>
              fetchClientFeatures({
                clientId: auth.profile.navotar_clientid,
                accessToken: auth.access_token,
              }),
            staleTime: 1000 * 60 * 5, // 5 minutes
          })
        );
      }

      const permissionsKey = userQKeys.permissions(auth.profile.navotar_userid);
      if (!queryClient.getQueryData(permissionsKey)) {
        promises.push(
          queryClient.prefetchQuery({
            queryKey: permissionsKey,
            queryFn: async () =>
              fetchUserPermissions({
                clientId: auth.profile.navotar_clientid,
                accessToken: auth.access_token,
                intendedUserId: auth.profile.navotar_userid,
              }),
            staleTime: 1000 * 60 * 5, // 5 minutes
          })
        );
      }

      await Promise.all(promises);
    }

    return {};
  },
  component: () => {
    return (
      <HeaderLayout>
        <Outlet />
        {UI_APPLICATION_SHOW_ROUTER_DEVTOOLS === true && (
          <TanStackRouterDevtools position="bottom-right" />
        )}
      </HeaderLayout>
    );
  },
});
