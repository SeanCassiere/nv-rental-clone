import { Suspense } from "react";
import {
  Outlet,
  RouterContext,
  ScrollRestoration,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useAuth } from "react-oidc-context";

import { HeaderLayout } from "@/components/header/header-layout";
import { HiddenFeatureSetter } from "@/components/hidden-feature-setter";
import { LoadingPlaceholder } from "@/components/loading-placeholder";

import { getAuthToken } from "@/utils/authLocal";
import {
  UI_APPLICATION_SHOW_ROUTER_DEVTOOLS,
  USER_STORAGE_KEYS,
} from "@/utils/constants";
import { clientQKeys, userQKeys } from "@/utils/query-key";
import { setLocalStorageForUser } from "@/utils/user-local-storage";

import type { apiClient } from "@/api";
import { queryClient } from "@/tanstack-query-config";

interface MyRouterContext {
  apiClient: typeof apiClient;
  queryClient: typeof queryClient;
}

const routerContext = new RouterContext<MyRouterContext>();

export const rootRoute = routerContext.createRootRoute({
  loader: async ({ context: { apiClient } }) => {
    const auth = getAuthToken();

    if (auth) {
      const promises = [];
      const authParams = {
        clientId: auth.profile.navotar_clientid,
        userId: auth.profile.navotar_userid,
      };

      // current client's profile
      promises.push(
        queryClient.ensureQueryData({
          queryKey: clientQKeys.profile(),
          queryFn: () =>
            apiClient.client
              .getProfile({
                params: { clientId: auth.profile.navotar_clientid },
              })
              .then((res) => {
                if (res.status === 200) {
                  const currency = res.body.currency || "USD";

                  setLocalStorageForUser(
                    auth.profile.navotar_clientid,
                    auth.profile.navotar_userid,
                    USER_STORAGE_KEYS.currency,
                    currency
                  );
                }
                return res;
              }),
          staleTime: 1000 * 30, // 30 seconds
        })
      );

      // current client's feature configurations
      promises.push(
        queryClient.ensureQueryData({
          queryKey: clientQKeys.features(),
          queryFn: () =>
            apiClient.client.getFeatures({
              params: { clientId: auth.profile.navotar_clientid },
              body: {},
            }),
          staleTime: 1000 * 60 * 5, // 5 minutes
        })
      );

      // current client screen settings configurations
      promises.push(
        queryClient.ensureQueryData({
          queryKey: clientQKeys.screenSettings(),
          queryFn: () =>
            apiClient.client.getScreenSettings({
              params: { clientId: auth.profile.navotar_clientid },
            }),
          staleTime: 1000 * 60 * 5, // 5 minutes
        })
      );

      // current user's profile
      promises.push(queryClient.ensureQueryData(userQKeys.me(authParams)));

      // current user's permissions
      promises.push(
        queryClient.ensureQueryData(userQKeys.permissions(authParams))
      );

      try {
        await Promise.all(promises);
      } catch (error) {
        console.log("error fetching data in the root route", error);
      }
    }

    return {};
  },
  component: RootComponent,
});

function RootComponent() {
  const auth = useAuth();

  const isHeaderShown = auth.isAuthenticated;
  const isFreshAuthenticating = auth.isLoading && !auth.isAuthenticated;

  return (
    <>
      {isHeaderShown && <HeaderLayout />}
      <main className="mx-auto w-full max-w-[1700px] flex-1 px-1 md:px-10">
        <ScrollRestoration getKey={(location) => location.pathname} />
        {isFreshAuthenticating ? (
          <LoadingPlaceholder />
        ) : (
          <>
            <HiddenFeatureSetter />
            <Suspense fallback={<LoadingPlaceholder />}>
              <Outlet />
            </Suspense>
          </>
        )}
        {UI_APPLICATION_SHOW_ROUTER_DEVTOOLS === true && (
          <TanStackRouterDevtools position="top-right" />
        )}
      </main>
    </>
  );
}
