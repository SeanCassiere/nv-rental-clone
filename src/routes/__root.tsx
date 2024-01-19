import { Suspense } from "react";
import {
  Outlet,
  rootRouteWithContext,
  ScrollRestoration,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useAuth, type AuthContextProps } from "react-oidc-context";

import { LogoutDialog } from "@/components/common/logout-dialog";
import { HeaderLayout } from "@/components/header/header-layout";
import { HiddenFeatureSetter } from "@/components/hidden-feature-setter";
import { LoadingPlaceholder } from "@/components/loading-placeholder";

import { getAuthFromRouterContext } from "@/utils/auth";
import { UI_APPLICATION_SHOW_ROUTER_DEVTOOLS } from "@/utils/constants";
import {
  fetchClientProfileOptions,
  fetchFeaturesForClientOptions,
  fetchScreenSettingsForClientOptions,
} from "@/utils/query/client";
import {
  fetchPermissionsByUserIdOptions,
  fetchUserByIdOptions,
} from "@/utils/query/user";

import type { queryClient } from "@/tanstack-query-config";

export interface MyRouterContext {
  queryClient: typeof queryClient;
  auth: AuthContextProps;
}

const routerRootWithContext = rootRouteWithContext<MyRouterContext>();

export const rootRoute = routerRootWithContext({
  loader: async ({ context }) => {
    const { queryClient } = context;
    const auth = getAuthFromRouterContext(context);

    const promises = [];

    // current client's profile
    promises.push(
      queryClient.ensureQueryData(fetchClientProfileOptions({ auth }))
    );

    // current client's feature configurations
    promises.push(
      queryClient.ensureQueryData(fetchFeaturesForClientOptions({ auth }))
    );

    // current client screen settings configurations
    promises.push(
      queryClient.ensureQueryData(fetchScreenSettingsForClientOptions({ auth }))
    );

    // current user's profile
    promises.push(
      queryClient.ensureQueryData(
        fetchUserByIdOptions({ auth, userId: auth.userId })
      )
    );

    // current user's permissions
    promises.push(
      queryClient.ensureQueryData(
        fetchPermissionsByUserIdOptions({ auth, userId: auth.userId })
      )
    );

    try {
      await Promise.all(promises);
    } catch (error) {
      console.log("error in rootRoute.loader", error);
    }

    return;
  },
  component: RootComponent,
});

const exceptionRoutes = ["/oidc-callback", "/dev"] as const;

function RootComponent() {
  const routerStore = useRouterState();
  const routerMatches = routerStore.matches.map((route) => route.routeId);

  // check if the routerMatches array contains any of the exception routes
  const isExceptionRoute = exceptionRoutes.some((routeId) =>
    routerMatches.includes(routeId)
  );

  const auth = useAuth();

  const clientId = auth.user?.profile?.navotar_clientid;
  const userId = auth.user?.profile?.navotar_userid;

  const isHeaderShown =
    auth.isAuthenticated && clientId && userId && !isExceptionRoute;
  const isFreshAuthenticating = auth.isLoading && !auth.isAuthenticated;

  return (
    <>
      <LogoutDialog />
      {isHeaderShown && <HeaderLayout />}
      <main className="mx-auto w-full max-w-[1700px] flex-1 px-1 md:px-10">
        <ScrollRestoration getKey={(location) => location.pathname} />
        {isExceptionRoute && !isFreshAuthenticating && <Outlet />}
        {isExceptionRoute && isFreshAuthenticating && <LoadingPlaceholder />}
        {!isExceptionRoute && isFreshAuthenticating && <LoadingPlaceholder />}
        {!isExceptionRoute && !isFreshAuthenticating && (
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
