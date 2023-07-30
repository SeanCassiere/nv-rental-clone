import { Outlet, RootRoute } from "@tanstack/router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { HeaderLayout } from "@/components/header/header-layout";

import { queryClient as qc } from "@/app-entry";

import { UI_APPLICATION_SHOW_ROUTER_DEVTOOLS } from "@/utils/constants";
import { getAuthToken } from "@/utils/authLocal";
import { clientQKeys, userQKeys } from "@/utils/query-key";
import { fetchClientFeatures } from "@/api/clients";
import { fetchUserPermissions } from "@/api/users";

export const rootRoute = new RootRoute({
  loader: async () => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];

      const featuresKey = clientQKeys.features();
      if (!qc.getQueryData(featuresKey)) {
        promises.push(
          qc.prefetchQuery({
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
      if (!qc.getQueryData(permissionsKey)) {
        promises.push(
          qc.prefetchQuery({
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
